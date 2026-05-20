const DOT = 'w-1.5 h-1.5 rounded-full flex-shrink-0';

export const StatusBadge = ({ status }) => {
  const map = {
    'Todo':        { dot: 'bg-gray-400',    text: 'text-gray-600',    bg: 'bg-gray-100'    },
    'In Progress': { dot: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50'     },
    'Completed':   { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50'  },
  };
  const s = map[status] ?? map['Todo'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`${DOT} ${s.dot}`} />
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const map = {
    'Low':    { dot: 'bg-gray-400',  text: 'text-gray-600',  bg: 'bg-gray-100'  },
    'Medium': { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50'  },
    'High':   { dot: 'bg-red-500',   text: 'text-red-700',   bg: 'bg-red-50'    },
  };
  const p = map[priority] ?? map['Medium'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${p.bg} ${p.text}`}>
      <span className={`${DOT} ${p.dot}`} />
      {priority}
    </span>
  );
};
