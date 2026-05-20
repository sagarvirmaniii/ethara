export const StatusBadge = ({ status }) => {
  const styles = {
    'Todo':        'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
    'In Progress': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    'Completed':   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  };
  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${styles[status] || styles['Todo']}`}>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const styles = {
    'Low':    'bg-gray-50 text-gray-600 ring-1 ring-gray-200',
    'Medium': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    'High':   'bg-red-50 text-red-700 ring-1 ring-red-200',
  };
  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${styles[priority] || styles['Medium']}`}>
      {priority}
    </span>
  );
};
