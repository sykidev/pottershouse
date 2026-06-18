import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  date: string;
  description: string;
  videoUrl: string;
  imageUrl: string | null;
}

export function AdminSermonsPage() {
  const queryClient = useQueryClient();
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

  const { data: sermons } = useQuery({
    queryKey: ['sermons'],
    queryFn: () => apiRequest<Sermon[]>('/sermons'),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/sermons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
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
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/sermons/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
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
          <Button onClick={() => setIsEditing(true)}>Add New Sermon</Button>
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
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
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
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleEdit(sermon)}>
                  Edit
                </Button>
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
