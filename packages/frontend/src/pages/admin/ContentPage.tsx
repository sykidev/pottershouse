import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, uploadImage } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const SECTIONS = [
  { id: 'home.hero', name: 'Home Hero Section' },
  { id: 'about', name: 'About Page' },
  { id: 'contact', name: 'Contact Information' },
];

export function AdminContentPage() {
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState(SECTIONS[0].id);
  const [jsonData, setJsonData] = useState('');

  const { data: content } = useQuery({
    queryKey: ['content', selectedSection],
    queryFn: () => apiRequest<{ data: any }>(`/content/${selectedSection}`),
  });

  // Update jsonData when content changes
  if (content && jsonData === '') {
    setJsonData(JSON.stringify(content.data, null, 2));
  }

  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest(`/content/${selectedSection}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', selectedSection] });
      alert('Content updated successfully!');
    },
    onError: (error) => {
      alert((error as Error).message || 'Save failed. Please try again.');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const parsed = JSON.parse(jsonData);
      updateMutation.mutate(parsed);
    } catch (error) {
      alert('Invalid JSON format. Please check your syntax.');
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Edit Content</h1>
        <p className="text-gray-600">
          Select a section below and edit the JSON data. Be careful with the format.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded transition ${
                    selectedSection === section.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {SECTIONS.find((s) => s.id === selectedSection)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    JSON Data (edit carefully)
                  </label>
                  <Textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                </div>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>

              <ImageUrlHelper />

              <div className="mt-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Tips:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Use valid JSON format (double quotes for strings)</li>
                  <li>• Arrays should be in square brackets: ["item1", "item2"]</li>
                  <li>• Objects should be in curly braces: {`{"key": "value"}`}</li>
                  <li>• No trailing commas allowed</li>
                  <li>• For images (e.g. hero background), upload below and paste the URL into the JSON</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * Upload an image and get back a URL to paste into the JSON above
 * (e.g. for the hero background or About page images).
 */
function ImageUrlHelper() {
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      setUrl(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded">
      <h3 className="font-semibold mb-2">Upload an image</h3>
      <p className="text-sm text-gray-600 mb-3">
        Upload a file, then copy the URL into the JSON above.
      </p>
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {uploading ? <p className="text-sm text-gray-500 mt-2">Uploading…</p> : null}
      {url ? (
        <div className="mt-3 flex items-center gap-2">
          <Input value={url} readOnly className="font-mono text-sm" />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => navigator.clipboard.writeText(url)}
          >
            Copy
          </Button>
        </div>
      ) : null}
      {error ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
    </div>
  );
}
