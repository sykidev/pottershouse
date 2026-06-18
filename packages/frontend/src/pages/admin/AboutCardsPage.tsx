import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AboutCard {
  id: number;
  type: 'story' | 'vision' | 'mission';
  title: string;
  shortDescription: string;
  fullDescription: string;
  year: string | null;
  icon: string | null;
  orderIndex: number;
}

export function AdminAboutCardsPage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: 'story' as 'story' | 'vision' | 'mission',
    title: '',
    shortDescription: '',
    fullDescription: '',
    year: '',
    icon: '',
    orderIndex: 0,
  });

  const { data: cards } = useQuery({
    queryKey: ['about-cards'],
    queryFn: () => apiRequest<AboutCard[]>('/about-cards'),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/about-cards', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-cards'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest(`/about-cards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-cards'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/about-cards/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-cards'] });
    },
  });

  function resetForm() {
    setFormData({
      type: 'story',
      title: '',
      shortDescription: '',
      fullDescription: '',
      year: '',
      icon: '',
      orderIndex: 0,
    });
    setIsEditing(false);
    setEditingId(null);
  }

  function handleEdit(card: AboutCard) {
    setFormData({
      type: card.type,
      title: card.title,
      shortDescription: card.shortDescription,
      fullDescription: card.fullDescription,
      year: card.year || '',
      icon: card.icon || '',
      orderIndex: card.orderIndex,
    });
    setEditingId(card.id);
    setIsEditing(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      ...formData,
      year: formData.year || null,
      icon: formData.icon || null,
      orderIndex: Number(formData.orderIndex),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  }

  const storyCards = cards?.filter(c => c.type === 'story') || [];
  const visionCards = cards?.filter(c => c.type === 'vision') || [];
  const missionCards = cards?.filter(c => c.type === 'mission') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage About Cards</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Add New Card'}
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Card' : 'Add New Card'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-2">Card Type</label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'story' | 'vision' | 'mission' })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="story">Story Timeline</option>
                  <option value="vision">Vision</option>
                  <option value="mission">Mission</option>
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium mb-2">Short Description (Card Preview)</label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <label htmlFor="fullDescription" className="block text-sm font-medium mb-2">Full Description (Modal View)</label>
                <Textarea
                  id="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  rows={8}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use line breaks for paragraphs. This text appears when the card is clicked.
                </p>
              </div>

              {formData.type === 'story' && (
                <div>
                  <label htmlFor="year" className="block text-sm font-medium mb-2">Year (for timeline)</label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g., 2013 or March 4, 2019"
                  />
                </div>
              )}

              <div>
                <label htmlFor="icon" className="block text-sm font-medium mb-2">Icon Name (optional)</label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., Eye, Target, Heart, Sparkles"
                />
              </div>

              <div>
                <label htmlFor="orderIndex" className="block text-sm font-medium mb-2">Display Order</label>
                <Input
                  id="orderIndex"
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Lower numbers appear first. Story cards: 1,2,3... Vision: 4, Mission: 5
                </p>
              </div>

              <div className="flex gap-2">
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

      {/* Story Timeline Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Story Timeline Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storyCards.map((card) => (
              <div key={card.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{card.title}</h3>
                    {card.year && (
                      <span className="text-sm text-gray-500">Year: {card.year}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(card)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Delete this card?')) {
                          deleteMutation.mutate(card.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{card.shortDescription}</p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600">View full description</summary>
                  <p className="mt-2 whitespace-pre-line text-gray-700">{card.fullDescription}</p>
                </details>
              </div>
            ))}
            {storyCards.length === 0 && (
              <p className="text-gray-500 text-center py-8">No story cards yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vision Card */}
      <Card>
        <CardHeader>
          <CardTitle>Vision Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visionCards.map((card) => (
              <div key={card.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{card.title}</h3>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(card)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Delete this card?')) {
                          deleteMutation.mutate(card.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{card.shortDescription}</p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600">View full description</summary>
                  <p className="mt-2 whitespace-pre-line text-gray-700">{card.fullDescription}</p>
                </details>
              </div>
            ))}
            {visionCards.length === 0 && (
              <p className="text-gray-500 text-center py-8">No vision card yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mission Card */}
      <Card>
        <CardHeader>
          <CardTitle>Mission Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {missionCards.map((card) => (
              <div key={card.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{card.title}</h3>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(card)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Delete this card?')) {
                          deleteMutation.mutate(card.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{card.shortDescription}</p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600">View full description</summary>
                  <p className="mt-2 whitespace-pre-line text-gray-700">{card.fullDescription}</p>
                </details>
              </div>
            ))}
            {missionCards.length === 0 && (
              <p className="text-gray-500 text-center py-8">No mission card yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
