import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useSaveContent } from '@/lib/content';
import { GIVE_DEFAULT, GiveContent, GiveWay } from '@/lib/site-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const EMPTY_WAY: GiveWay = {
  heading: '',
  accountName: '',
  accountNumber: '',
  bank: '',
  currency: 'Naira',
  swift: '',
};

export function AdminGivePage() {
  const [form, setForm] = useState<GiveContent>(GIVE_DEFAULT);
  const [saved, setSaved] = useState(false);
  const save = useSaveContent('give');

  const { data } = useQuery({
    queryKey: ['content', 'give'],
    queryFn: () => apiRequest<{ data: Partial<GiveContent> }>('/content/give'),
  });

  useEffect(() => {
    if (data?.data) setForm({ ...GIVE_DEFAULT, ...data.data });
  }, [data]);

  function set<K extends keyof GiveContent>(key: K, value: GiveContent[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function updateWay(i: number, key: keyof GiveWay, value: string) {
    set('ways', form.ways.map((w, idx) => (idx === i ? { ...w, [key]: value } : w)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate(form, { onSuccess: () => setSaved(true) });
  }

  const field = 'block text-sm font-medium mb-1';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Give Page</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Hero & Intro</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={field}>Title</label>
              <Input value={form.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} />
            </div>
            <div>
              <label className={field}>Subtitle</label>
              <Textarea rows={2} value={form.heroSubtitle} onChange={(e) => set('heroSubtitle', e.target.value)} />
            </div>
            <div>
              <label className={field}>Intro Paragraph</label>
              <Textarea rows={3} value={form.intro} onChange={(e) => set('intro', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ways to Give</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {form.ways.map((way, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-500">Account {i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => set('ways', form.ways.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </Button>
                </div>
                <div>
                  <label className={field}>Heading</label>
                  <Input value={way.heading} onChange={(e) => updateWay(i, 'heading', e.target.value)} placeholder="e.g., Project Account" />
                </div>
                <div>
                  <label className={field}>Account Name</label>
                  <Input value={way.accountName} onChange={(e) => updateWay(i, 'accountName', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={field}>Account Number</label>
                    <Input value={way.accountNumber} onChange={(e) => updateWay(i, 'accountNumber', e.target.value)} />
                  </div>
                  <div>
                    <label className={field}>Currency</label>
                    <Input value={way.currency} onChange={(e) => updateWay(i, 'currency', e.target.value)} placeholder="Naira / USD" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={field}>Bank</label>
                    <Input value={way.bank} onChange={(e) => updateWay(i, 'bank', e.target.value)} />
                  </div>
                  <div>
                    <label className={field}>Swift Code (optional)</label>
                    <Input value={way.swift} onChange={(e) => updateWay(i, 'swift', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set('ways', [...form.ways, { ...EMPTY_WAY }])}
            >
              Add Account
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Saving…' : 'Save Give Page'}
          </Button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
          {save.error && <span className="text-sm text-red-600">{(save.error as Error).message}</span>}
        </div>
      </form>
    </div>
  );
}
