import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useSaveContent } from '@/lib/content';
import { VISIT_DEFAULT, VisitContent } from '@/lib/site-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function AdminVisitPage() {
  const [form, setForm] = useState<VisitContent>(VISIT_DEFAULT);
  const [saved, setSaved] = useState(false);
  const save = useSaveContent('visit');

  const { data } = useQuery({
    queryKey: ['content', 'visit'],
    queryFn: () => apiRequest<{ data: Partial<VisitContent> }>('/content/visit'),
  });

  useEffect(() => {
    if (data?.data) setForm({ ...VISIT_DEFAULT, ...data.data });
  }, [data]);

  function set<K extends keyof VisitContent>(key: K, value: VisitContent[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function updateService(i: number, key: 'day' | 'name' | 'time', value: string) {
    set('services', form.services.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  }

  function updatePhone(i: number, value: string) {
    set('phones', form.phones.map((p, idx) => (idx === i ? value : p)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate(form, { onSuccess: () => setSaved(true) });
  }

  const field = 'block text-sm font-medium mb-1';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Visit Us Page</h1>
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
          <CardHeader><CardTitle>Church Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={field}>Church Name</label>
              <Input value={form.churchName} onChange={(e) => set('churchName', e.target.value)} />
            </div>
            <div>
              <label className={field}>Address</label>
              <Textarea rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} />
            </div>
            <div>
              <label className={field}>Postal Code</label>
              <Input value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} />
            </div>
            <div>
              <label className={field}>Email</label>
              <Input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="(optional)" />
            </div>
            <div>
              <label className={field}>Phone Numbers</label>
              <p className="text-xs text-gray-500 mb-2">These also appear in the site footer's Contact Us.</p>
              <div className="space-y-2">
                {form.phones.map((phone, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input value={phone} onChange={(e) => updatePhone(i, e.target.value)} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => set('phones', form.phones.filter((_, idx) => idx !== i))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => set('phones', [...form.phones, ''])}>
                  Add Phone
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Service Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={field}>Section Heading</label>
              <Input value={form.servicesHeading} onChange={(e) => set('servicesHeading', e.target.value)} />
            </div>
            {form.services.map((s, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-500">Service {i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => set('services', form.services.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </Button>
                </div>
                <div>
                  <label className={field}>Day</label>
                  <Input value={s.day} onChange={(e) => updateService(i, 'day', e.target.value)} placeholder="e.g., Sunday" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={field}>Service Name</label>
                    <Input value={s.name} onChange={(e) => updateService(i, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className={field}>Time</label>
                    <Input value={s.time} onChange={(e) => updateService(i, 'time', e.target.value)} placeholder="e.g., 9:00 AM WAT" />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set('services', [...form.services, { day: '', name: '', time: '' }])}
            >
              Add Service
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Call to Action</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={field}>CTA Heading</label>
              <Input value={form.ctaHeading} onChange={(e) => set('ctaHeading', e.target.value)} />
            </div>
            <p className="text-sm text-gray-500">
              The Call Us / Email Us buttons use the phone and email above.
            </p>
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
