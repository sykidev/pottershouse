import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { GALLERY_DEFAULT, GALLERY_TAGS, GalleryContent } from '@/lib/site-content';
import { ImageUpload } from '@/components/ui/image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Check, X, Instagram } from 'lucide-react';

type Status = 'pending' | 'approved' | 'rejected';

interface GalleryRow {
  id: number;
  source: string;
  imageUrl: string;
  permalink: string | null;
  caption: string;
  tag: string;
  mediaType: string | null;
  status: Status;
  postedAt: string | null;
}

interface SyncResult {
  added: number;
  skipped: number;
  scanned: number;
  pages: number;
  reachedCap: boolean;
  username: string;
}

const selectCls = 'w-full h-10 rounded-md border border-input bg-background px-3 text-sm';
const field = 'block text-sm font-medium mb-1';

export function AdminGalleryPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Status>('pending');
  const [syncMsg, setSyncMsg] = useState<string>('');

  // ---- Page settings (stored on the `gallery` content section) ----
  // Keep the full data object so we don't clobber sync-written fields
  // (igUsername / igProfilePictureUrl) when saving the three editable fields.
  const [content, setContent] = useState<Record<string, any>>({ ...GALLERY_DEFAULT });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const { data: contentData } = useQuery({
    queryKey: ['content', 'gallery'],
    queryFn: () => apiRequest<{ data: Partial<GalleryContent> }>('/content/gallery'),
  });
  useEffect(() => {
    if (contentData?.data) setContent({ ...GALLERY_DEFAULT, ...contentData.data });
  }, [contentData]);

  const saveSettings = useMutation({
    mutationFn: (data: Record<string, any>) =>
      apiRequest('/content/gallery', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['content', 'gallery'] });
      setSettingsSaved(true);
    },
  });

  // ---- Images for the active tab ----
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery-admin', tab],
    queryFn: () => apiRequest<GalleryRow[]>(`/gallery/admin?status=${tab}`),
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ['gallery-admin'] });
    qc.invalidateQueries({ queryKey: ['gallery'] }); // public feed
  };

  // ---- Sync from Instagram ----
  const sync = useMutation({
    mutationFn: () => apiRequest<SyncResult>('/gallery/sync', { method: 'POST' }),
    onSuccess: (r) => {
      setSyncMsg(
        `Pulled ${r.scanned} posts — ${r.added} new added to Pending, ${r.skipped} already known.` +
          (r.reachedCap ? ' (page cap reached)' : ''),
      );
      invalidateAll();
    },
    onError: (e) => setSyncMsg((e as Error).message || 'Sync failed'),
  });

  // ---- Per-image mutations ----
  const patch = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Pick<GalleryRow, 'status' | 'caption' | 'tag'>> }) =>
      apiRequest(`/gallery/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: invalidateAll,
  });
  const remove = useMutation({
    mutationFn: (id: number) => apiRequest(`/gallery/${id}`, { method: 'DELETE' }),
    onSuccess: invalidateAll,
  });
  const bulk = useMutation({
    mutationFn: (action: 'approve' | 'reject') =>
      apiRequest('/gallery/bulk', { method: 'POST', body: JSON.stringify({ ids: images.map((i) => i.id), action }) }),
    onSuccess: invalidateAll,
  });

  // ---- Manual upload ----
  const [pendingUrl, setPendingUrl] = useState('');
  const [pendingCaption, setPendingCaption] = useState('');
  const [pendingTag, setPendingTag] = useState(GALLERY_TAGS[0]);
  const addManual = useMutation({
    mutationFn: () =>
      apiRequest('/gallery', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: pendingUrl, caption: pendingCaption, tag: pendingTag }),
      }),
    onSuccess: () => {
      setPendingUrl('');
      setPendingCaption('');
      setPendingTag(GALLERY_TAGS[0]);
      setTab('approved');
      invalidateAll();
    },
  });

  const tabs = useMemo(
    () => [
      { key: 'pending' as Status, label: 'Pending' },
      { key: 'approved' as Status, label: 'Approved' },
      { key: 'rejected' as Status, label: 'Rejected' },
    ],
    [],
  );

  function setSetting(key: string, value: string) {
    setContent((c) => ({ ...c, [key]: value }));
    setSettingsSaved(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Gallery</h1>

      {/* Sync */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="w-5 h-5" /> Instagram Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Pull every post from Instagram into the gallery as <strong>Pending</strong>. The public site only fetches
            from our database, so this is the only time we call Instagram. Already-imported posts are skipped, so your
            approve/reject choices are kept.
          </p>
          <Button type="button" onClick={() => sync.mutate()} disabled={sync.isPending}>
            <RefreshCw className={`w-4 h-4 mr-2 ${sync.isPending ? 'animate-spin' : ''}`} />
            {sync.isPending ? 'Syncing…' : 'Sync from Instagram'}
          </Button>
          {syncMsg && <p className="text-sm text-gray-700">{syncMsg}</p>}
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-crimson text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:text-crimson'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {images.length > 0 && tab === 'pending' && (
          <Button type="button" variant="outline" size="sm" disabled={bulk.isPending} onClick={() => bulk.mutate('approve')}>
            <Check className="w-4 h-4 mr-1" /> Approve all {images.length}
          </Button>
        )}
      </div>

      {/* Image grid */}
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-gray-500">
          {tab === 'pending' ? 'Nothing pending. Sync from Instagram to pull new posts.' : `No ${tab} images.`}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="border rounded-xl overflow-hidden bg-white flex flex-col">
              <div className="relative aspect-square bg-gray-100">
                <img src={img.imageUrl} alt={img.caption || 'Gallery image'} className="w-full h-full object-cover" />
                {img.permalink && (
                  <a
                    href={img.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm"
                  >
                    Instagram
                  </a>
                )}
              </div>
              <div className="p-3 space-y-2 flex-1 flex flex-col">
                <Input
                  defaultValue={img.caption}
                  placeholder="Caption"
                  onBlur={(e) => {
                    if (e.target.value !== img.caption) patch.mutate({ id: img.id, data: { caption: e.target.value } });
                  }}
                />
                <select
                  className={selectCls}
                  value={img.tag}
                  onChange={(e) => patch.mutate({ id: img.id, data: { tag: e.target.value } })}
                >
                  {GALLERY_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 pt-1 mt-auto">
                  {tab !== 'approved' && (
                    <Button
                      type="button"
                      size="sm"
                      className="flex-1"
                      onClick={() => patch.mutate({ id: img.id, data: { status: 'approved' } })}
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  )}
                  {tab !== 'rejected' && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => patch.mutate({ id: img.id, data: { status: 'rejected' } })}
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  )}
                  <Button type="button" size="sm" variant="ghost" onClick={() => remove.mutate(img.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual add */}
      <Card className="mt-8 max-w-3xl">
        <CardHeader>
          <CardTitle>Add a Photo Manually</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload label="Photo" value={pendingUrl} onChange={setPendingUrl} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={field}>Caption (optional)</label>
              <Input value={pendingCaption} onChange={(e) => setPendingCaption(e.target.value)} />
            </div>
            <div>
              <label className={field}>Tag / Ministry</label>
              <select className={selectCls} value={pendingTag} onChange={(e) => setPendingTag(e.target.value)}>
                {GALLERY_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" disabled={!pendingUrl || addManual.isPending} onClick={() => addManual.mutate()}>
            {addManual.isPending ? 'Adding…' : 'Add to Gallery (approved)'}
          </Button>
        </CardContent>
      </Card>

      {/* Page settings */}
      <Card className="mt-6 max-w-3xl">
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className={field}>Title</label>
            <Input value={content.heroTitle ?? ''} onChange={(e) => setSetting('heroTitle', e.target.value)} />
          </div>
          <div>
            <label className={field}>Subtitle</label>
            <Input value={content.heroSubtitle ?? ''} onChange={(e) => setSetting('heroSubtitle', e.target.value)} />
          </div>
          <div>
            <label className={field}>Instagram URL</label>
            <Input value={content.instagramUrl ?? ''} onChange={(e) => setSetting('instagramUrl', e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" disabled={saveSettings.isPending} onClick={() => saveSettings.mutate(content)}>
              {saveSettings.isPending ? 'Saving…' : 'Save Settings'}
            </Button>
            {settingsSaved && <span className="text-sm text-green-600">Saved!</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
