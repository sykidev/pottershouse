import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { GALLERY_TAGS } from '@/lib/site-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';

type Status = 'approved' | 'rejected';

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  date: string;
  description: string;
  videoUrl: string;
  imageUrl: string | null;
  tag: string;
  status: Status;
}

const selectCls = 'h-9 rounded-md border border-input bg-background px-2 text-sm';

export function AdminSermonsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Status>('approved');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    date: '',
    description: '',
    videoUrl: '',
    imageUrl: '',
  });

  // Public list reads approved-only; admin reads by tab. Invalidate both.
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['sermons'] });
    queryClient.invalidateQueries({ queryKey: ['sermons-admin'] });
  };

  const { data: sermons } = useQuery({
    queryKey: ['sermons-admin', tab],
    queryFn: () => apiRequest<Sermon[]>(`/sermons/admin?status=${tab}`),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/sermons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      invalidate();
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest(`/sermons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      invalidate();
      resetForm();
    },
  });

  // Approve / reject or retag without re-sending the whole sermon.
  const patchMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status?: Status; tag?: string } }) =>
      apiRequest(`/sermons/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/sermons/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  });

  const syncMutation = useMutation({
    mutationFn: () => apiRequest<{ imported: number; found: number }>('/sermons/sync-youtube', { method: 'POST' }),
    onSuccess: (res) => {
      invalidate();
      alert(`Synced from YouTube: ${res.imported} new sermon(s) imported (of ${res.found} live broadcasts found).`);
    },
    onError: (err) => {
      alert(`YouTube sync failed: ${(err as Error).message}`);
    },
  });

  function resetForm() {
    setFormData({
      title: '',
      speaker: '',
      date: '',
      description: '',
      videoUrl: '',
      imageUrl: '',
    });
    setIsEditing(false);
    setEditingId(null);
  }

  function handleEdit(sermon: Sermon) {
    setFormData({
      title: sermon.title,
      speaker: sermon.speaker,
      date: sermon.date,
      description: sermon.description,
      videoUrl: sermon.videoUrl,
      imageUrl: sermon.imageUrl || '',
    });
    setEditingId(sermon.id);
    setIsEditing(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      ...formData,
      imageUrl: formData.imageUrl || undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Sermons</h1>
        {!isEditing && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={syncMutation.isPending}
              onClick={() => syncMutation.mutate()}
            >
              {syncMutation.isPending ? 'Syncing…' : 'Sync from YouTube'}
            </Button>
            <Button onClick={() => setIsEditing(true)}>Add New Sermon</Button>
          </div>
        )}
      </div>

      {isEditing && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Sermon' : 'Add New Sermon'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Speaker</label>
                <Input
                  value={formData.speaker}
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Video URL</label>
                <Input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  required
                />
              </div>
              <ImageUpload
                label="Thumbnail"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving…'
                    : editingId
                    ? 'Update'
                    : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
              {createMutation.error || updateMutation.error ? (
                <p className="text-sm text-red-600">
                  {((createMutation.error || updateMutation.error) as Error).message ||
                    'Save failed. Please try again.'}
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Approved / Rejected tabs. Approved sermons show on the public site;
          rejected ones are hidden but kept so they can be restored. */}
      {!isEditing && (
        <div className="flex gap-2 mb-6">
          {(['approved', 'rejected'] as Status[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTab(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                tab === s
                  ? 'bg-crimson text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:text-crimson'
              }`}
            >
              {s} {sermons && tab === s ? `(${sermons.length})` : ''}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6">
        {sermons?.length === 0 && (
          <p className="text-sm text-gray-500">
            {tab === 'approved'
              ? 'No approved sermons yet. Sync from YouTube or add one.'
              : 'No rejected sermons.'}
          </p>
        )}
        {sermons?.map((sermon) => (
          <Card key={sermon.id}>
            <CardHeader>
              <CardTitle>{sermon.title}</CardTitle>
              <p className="text-sm text-gray-600">
                {sermon.speaker} • {new Date(sermon.date).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{sermon.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm text-gray-600">Tag</label>
                <select
                  className={selectCls}
                  value={sermon.tag}
                  onChange={(e) => patchMutation.mutate({ id: sermon.id, data: { tag: e.target.value } })}
                >
                  {GALLERY_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <Button size="sm" onClick={() => handleEdit(sermon)}>
                  Edit
                </Button>
                {sermon.status === 'approved' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => patchMutation.mutate({ id: sermon.id, data: { status: 'rejected' } })}
                  >
                    Reject
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => patchMutation.mutate({ id: sermon.id, data: { status: 'approved' } })}
                  >
                    Approve
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Delete this sermon?')) {
                      deleteMutation.mutate(sermon.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
