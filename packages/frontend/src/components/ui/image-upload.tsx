import { useId, useState } from 'react';
import { uploadImage } from '@/lib/api';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  /** Current image URL (or empty string). */
  value: string;
  /** Called with the new URL after a successful upload, or '' when removed. */
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  // Unique id so multiple uploaders on one page don't share an input.
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setProgress(0);
    setUploading(true);
    try {
      const url = await uploadImage(file, setProgress);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label} (optional)</label>

      {value ? (
        <div className="mb-2">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-md border border-gray-200"
          />
        </div>
      ) : null}

      {/* Hidden file input, opened natively by clicking its <label>. */}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = ''; // allow re-selecting the same file
        }}
      />

      <div className="flex items-center gap-2">
        {/* A label tied to the file input opens the picker with no JS — works
            reliably even though the input is visually hidden. */}
        <label
          htmlFor={inputId}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'cursor-pointer',
            uploading && 'pointer-events-none opacity-50'
          )}
        >
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </label>
        {value && !uploading ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>
            Remove
          </Button>
        ) : null}
      </div>

      {uploading ? (
        <div className="mt-2">
          <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
            <div
              className="h-full bg-primary transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Uploading… {progress}%</p>
        </div>
      ) : null}

      {/* Allow pasting a URL or relative path as a fallback. Uses type="text"
          (not "url") so an uploaded relative path like /uploads/abc.png passes
          HTML5 form validation. */}
      <Input
        type="text"
        value={value}
        placeholder="…or paste an image URL"
        className="mt-2"
        onChange={(e) => onChange(e.target.value)}
      />

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
