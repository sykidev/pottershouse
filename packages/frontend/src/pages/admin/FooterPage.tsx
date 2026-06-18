import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useSaveContent } from '@/lib/content';
import { FOOTER_DEFAULT, FooterContent } from '@/lib/site-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function AdminFooterPage() {
  const [form, setForm] = useState<FooterContent>(FOOTER_DEFAULT);
  const [saved, setSaved] = useState(false);
  const save = useSaveContent('footer');

  const { data } = useQuery({
    queryKey: ['content', 'footer'],
    queryFn: () => apiRequest<{ data: Partial<FooterContent> }>('/content/footer'),
  });

  useEffect(() => {
    if (data?.data) setForm({ ...FOOTER_DEFAULT, ...data.data });
  }, [data]);

  function set<K extends keyof FooterContent>(key: K, value: FooterContent[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function updateLink(i: number, key: 'label' | 'href', value: string) {
    set(
      'quickLinks',
      form.quickLinks.map((l, idx) => (idx === i ? { ...l, [key]: value } : l))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate(form, { onSuccess: () => setSaved(true) });
  }

  const field = 'block text-sm font-medium mb-1';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Footer</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>About</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={field}>Title</label>
              <Input value={form.aboutTitle} onChange={(e) => set('aboutTitle', e.target.value)} />
            </div>
            <div>
              <label className={field}>Description</label>
              <Textarea rows={3} value={form.aboutText} onChange={(e) => set('aboutText', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={field}>Facebook URL</label>
              <Input value={form.facebook} onChange={(e) => set('facebook', e.target.value)} />
            </div>
            <div>
              <label className={field}>Instagram URL</label>
              <Input value={form.instagram} onChange={(e) => set('instagram', e.target.value)} />
            </div>
            <div>
              <label className={field}>YouTube URL</label>
              <Input value={form.youtube} onChange={(e) => set('youtube', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {form.quickLinks.map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => updateLink(i, 'label', e.target.value)}
                />
                <Input
                  placeholder="/path"
                  value={link.href}
                  onChange={(e) => updateLink(i, 'href', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => set('quickLinks', form.quickLinks.filter((_, idx) => idx !== i))}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set('quickLinks', [...form.quickLinks, { label: '', href: '/' }])}
            >
              Add Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              The footer's <strong>Contact Us</strong> (address, phone, email, Sunday service)
              is managed on the <strong>Visit Us Page</strong> editor, so the footer always
              stays in sync. Update it there.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Bottom Bar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={field}>Copyright Name</label>
              <Input value={form.copyrightName} onChange={(e) => set('copyrightName', e.target.value)} />
            </div>
            <div>
              <label className={field}>Scripture / Tagline</label>
              <Input value={form.scripture} onChange={(e) => set('scripture', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Saving…' : 'Save Footer'}
          </Button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
          {save.error && (
            <span className="text-sm text-red-600">{(save.error as Error).message}</span>
          )}
        </div>
      </form>
    </div>
  );
}
