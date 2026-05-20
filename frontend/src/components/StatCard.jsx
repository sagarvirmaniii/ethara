const palette = {
  indigo: { wrap: 'bg-white border-l-4 border-indigo-500', label: 'text-gray-500', value: 'text-gray-900', sub: 'text-indigo-600' },
  green:  { wrap: 'bg-white border-l-4 border-emerald-500', label: 'text-gray-500', value: 'text-gray-900', sub: 'text-emerald-600' },
  yellow: { wrap: 'bg-white border-l-4 border-amber-400', label: 'text-gray-500', value: 'text-gray-900', sub: 'text-amber-600' },
  red:    { wrap: 'bg-white border-l-4 border-red-500', label: 'text-gray-500', value: 'text-gray-900', sub: 'text-red-600' },
  blue:   { wrap: 'bg-white border-l-4 border-blue-500', label: 'text-gray-500', value: 'text-gray-900', sub: 'text-blue-600' },
};

const StatCard = ({ label, value, color = 'indigo', sub }) => {
  const p = palette[color] || palette.indigo;
  return (
    <div className={`card-hover rounded-xl p-6 shadow-sm border border-gray-100 ${p.wrap}`}>
      <p className={`text-sm font-medium ${p.label}`}>{label}</p>
      <p className={`text-4xl font-bold mt-2 ${p.value}`}>{value ?? 0}</p>
      {sub && <p className={`text-xs mt-1 font-medium ${p.sub}`}>{sub}</p>}
    </div>
  );
};

export default StatCard;
