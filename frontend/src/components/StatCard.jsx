const COLORS = {
  indigo: { accent: 'border-l-indigo-500',  val: 'text-indigo-600'  },
  green:  { accent: 'border-l-emerald-500', val: 'text-emerald-600' },
  yellow: { accent: 'border-l-amber-400',   val: 'text-amber-600'   },
  red:    { accent: 'border-l-red-500',     val: 'text-red-600'     },
  blue:   { accent: 'border-l-blue-500',    val: 'text-blue-600'    },
};

const StatCard = ({ label, value, color = 'indigo' }) => {
  const c = COLORS[color] ?? COLORS.indigo;
  return (
    <div className={`card-hover bg-white rounded-xl border border-gray-100 border-l-4 ${c.accent} shadow-sm px-5 py-4`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-2 tabular-nums ${c.val}`}>{value ?? 0}</p>
    </div>
  );
};

export default StatCard;
