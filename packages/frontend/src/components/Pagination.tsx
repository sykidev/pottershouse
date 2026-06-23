import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

// Build the list of page slots, inserting '…' gaps for long ranges.
// Always shows first/last, the current page, and its immediate neighbours.
function buildPages(page: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'gap')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);

  if (start > 2) pages.push('gap');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('gap');

  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  const arrowCls =
    'group flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 ' +
    'transition-all duration-200 hover:border-crimson hover:text-crimson hover:shadow-md hover:scale-110 active:scale-95 ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:hover:shadow-none';

  return (
    <nav className="mt-14 flex items-center justify-center gap-1.5 sm:gap-2" aria-label="Pagination">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={arrowCls}
      >
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
      </button>

      {/* Numbered pages — hidden on the smallest screens to avoid wrapping. */}
      <div className="hidden xs:flex items-center gap-1.5 sm:gap-2">
        {pages.map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange(p)}
              className={`relative w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
                p === page
                  ? 'bg-crimson text-white shadow-lg shadow-crimson/30 scale-110'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-crimson hover:text-crimson hover:shadow-md hover:scale-110'
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* Compact indicator for very small screens. */}
      <span className="xs:hidden px-4 text-sm font-medium text-gray-600 tabular-nums">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className={arrowCls}
      >
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </nav>
  );
}
