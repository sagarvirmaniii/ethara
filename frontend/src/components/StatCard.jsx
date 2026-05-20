const COLORS = {
  indigo: { border: 'border-indigo-400', val: 'text-indigo-600', bg: 'bg-indigo-50' },
  green:  { border: 'border-emerald-400', val: 'text-emerald-600', bg: 'bg-emerald-50' },
  yellow: { border: 'border-amber-400',   val: 'text-amber-600',   bg: 'bg-amber-50'   },
  red:    { border: 'border-red-400',     val: 'text-red-600',     bg: 'bg-red-50'     },
  blue:   { border: 'border-blue-400',    val: 'text-blue-600',    bg: 'bg-blue-50'    },
};

const StatCard = ({ label, value, color = 'indigo' }) => {
  const c = COLORS[color] ?? COLORS.indigo;
  return (
    <div className={`card-hover bg-white rounded-xl border border-gray-100 border-l-4 ${c.border} shadow-sm p-5`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${c.val}`}>{value ?? 0}</p>
    </div>
  );
};

export default StatCard;
