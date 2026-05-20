const Pulse = ({ className }) => (
  <div className={`animate-pulse rounded bg-gray-100 ${className}`} />
);

export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-3">
    <svg className="animate-spin w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <p className="text-sm text-gray-400">Loading…</p>
  </div>
);

export const TableSkeleton = ({ rows = 4, cols = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: cols }).map((_, j) => (
          <td key={j} className="px-6 py-4">
            <Pulse className={`h-4 ${j === 0 ? 'w-3/5' : 'w-2/5'}`} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export const CardSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
        <Pulse className="h-5 w-3/4" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);
