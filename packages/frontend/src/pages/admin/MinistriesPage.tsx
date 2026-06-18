import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useSaveContent } from '@/lib/content';
import { MINISTRIES_DEFAULT, MinistriesContent } from '@/lib/site-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ICON_OPTIONS = ['Book', 'Music', 'Baby', 'Users', 'HandHeart', 'Heart', 'Sparkles'];

export function AdminMinistriesPage() {
  const [form, setForm] = useState<MinistriesContent>(MINISTRIES_DEFAULT);
  const [saved, setSaved] = useState(false);
  const save = useSaveContent('ministries');

  const { data } = useQuery({
    queryKey: ['content', 'ministries'],
    queryFn: () => apiRequest<{ data: Partial<MinistriesContent> }>('/content/ministries'),
  });

  useEffect(() => {
    if (data?.data) setForm({ ...MINISTRIES_DEFAULT, ...data.data });
  }, [data]);

  function set<K extends keyof MinistriesContent>(key: K, value: MinistriesContent[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function updateMinistry(i: number, key: 'icon' | 'title' | 'description', value: string) {
    set('ministries', form.ministries.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate(form, { onSuccess: () => setSaved(true) });
  }

  const field = 'block text-sm font-medium mb-1';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Ministries Page</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Hero</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={field}>Title</label>
              <Input value={form.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} />
            </div>
            <div>
              <label className={field}>Subtitle</label>
              <Textarea rows={2} value={form.heroSubtitle} onChange={(e) => set('heroSubtitle', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ministries</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={field}>Heading</label>
                <Input value={form.ministriesHeading} onChange={(e) => set('ministriesHeading', e.target.value)} />
              </div>
              <div>
                <label className={field}>Subtitle</label>
                <Input value={form.ministriesSubtitle} onChange={(e) => set('ministriesSubtitle', e.target.value)} />
              </div>
            </div>

            {form.ministries.map((m, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-500">Ministry {i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => set('ministries', form.ministries.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={field}>Icon</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={m.icon}
                      onChange={(e) => updateMinistry(i, 'icon', e.target.value)}
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={field}>Title</label>
                    <Input value={m.title} onChange={(e) => updateMinistry(i, 'title', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={field}>Description</label>
                  <Textarea rows={2} value={m.description} onChange={(e) => updateMinistry(i, 'description', e.target.value)} />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set('ministries', [...form.ministries, { icon: 'Heart', title: '', description: '' }])}
            >
              Add Ministry
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Team Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={field}>Team Heading</label>
                <Input value={form.teamHeading} onChange={(e) => set('teamHeading', e.target.value)} />
              </div>
              <div>
                <label className={field}>Team Subtitle</label>
                <Input value={form.teamSubtitle} onChange={(e) => set('teamSubtitle', e.target.value)} />
              </div>
            </div>
            <p className="text-sm text-gray-500">Team members are managed under <strong>Team</strong>.</p>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Saving…' : 'Save Page'}
          </Button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
          {save.error && <span className="text-sm text-red-600">{(save.error as Error).message}</span>}
        </div>
      </form>
    </div>
  );
}
