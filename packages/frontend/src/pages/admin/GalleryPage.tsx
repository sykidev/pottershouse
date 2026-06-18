import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useSaveContent } from '@/lib/content';
import { GALLERY_DEFAULT, GALLERY_TAGS, GalleryContent } from '@/lib/site-content';
import { ImageUpload } from '@/components/ui/image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AdminGalleryPage() {
  const [form, setForm] = useState<GalleryContent>(GALLERY_DEFAULT);
  const [saved, setSaved] = useState(false);
  const save = useSaveContent('gallery');

  // Pending upload (filled before being added to the gallery list).
  const [pendingUrl, setPendingUrl] = useState('');
  const [pendingCaption, setPendingCaption] = useState('');
  const [pendingTag, setPendingTag] = useState(GALLERY_TAGS[0]);

  const { data } = useQuery({
    queryKey: ['content', 'gallery'],
    queryFn: () => apiRequest<{ data: Partial<GalleryContent> }>('/content/gallery'),
  });

  useEffect(() => {
    if (data?.data) setForm({ ...GALLERY_DEFAULT, ...data.data, images: data.data.images ?? [] });
  }, [data]);

  function set<K extends keyof GalleryContent>(key: K, value: GalleryContent[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function addImage() {
    if (!pendingUrl) return;
    set('images', [...form.images, { url: pendingUrl, caption: pendingCaption, tag: pendingTag }]);
    setPendingUrl('');
    setPendingCaption('');
    setPendingTag(GALLERY_TAGS[0]);
  }

  function updateImage(i: number, key: 'caption' | 'tag', value: string) {
    set('images', form.images.map((img, idx) => (idx === i ? { ...img, [key]: value } : img)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate(form, { onSuccess: () => setSaved(true) });
  }

  const field = 'block text-sm font-medium mb-1';
  const selectCls = 'w-full h-10 rounded-md border border-input bg-background px-3 text-sm';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Gallery</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Page Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={field}>Title</label>
              <Input value={form.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} />
            </div>
            <div>
              <label className={field}>Subtitle</label>
              <Input value={form.heroSubtitle} onChange={(e) => set('heroSubtitle', e.target.value)} />
            </div>
            <div>
              <label className={field}>Instagram URL</label>
              <Input value={form.instagramUrl} onChange={(e) => set('instagramUrl', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Add a Photo</CardTitle></CardHeader>
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
                  {GALLERY_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" disabled={!pendingUrl} onClick={addImage}>
              Add to Gallery
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photos ({form.images.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {form.images.length === 0 && <p className="text-sm text-gray-500">No photos yet. Add one above.</p>}
            {form.images.map((img, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-3 sm:items-center border rounded-lg p-3">
                <img src={img.url} alt={img.caption} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Caption"
                    value={img.caption}
                    onChange={(e) => updateImage(i, 'caption', e.target.value)}
                  />
                  <select className={selectCls} value={img.tag} onChange={(e) => updateImage(i, 'tag', e.target.value)}>
                    {GALLERY_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}
                >
                  Remove
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Saving…' : 'Save Gallery'}
          </Button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
          {save.error && <span className="text-sm text-red-600">{(save.error as Error).message}</span>}
        </div>
      </form>
    </div>
  );
}
