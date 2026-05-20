import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { PageLoader } from '../components/Loaders';
import api from '../api/axios';

const STATS = (tasks) => [
  { label: 'Total',       value: tasks.length,                                          border: 'border-indigo-400', text: 'text-indigo-600' },
  { label: 'Completed',   value: tasks.filter((t) => t.status === 'Completed').length,  border: 'border-emerald-400', text: 'text-emerald-600' },
  { label: 'In Progress', value: tasks.filter((t) => t.status === 'In Progress').length, border: 'border-blue-400',   text: 'text-blue-600'   },
  { label: 'Todo',        value: tasks.filter((t) => t.status === 'Todo').length,        border: 'border-gray-300',   text: 'text-gray-600'   },
];

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    Promise.all([api.get(`/projects/${id}`), api.get(`/tasks/project/${id}`)])
      .then(([p, t]) => { setProject(p.data); setTasks(t.data); })
      .catch(() => setError('Failed to load project details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout><PageLoader /></Layout>;

  if (error || !project) return (
    <Layout>
      <div className="text-center py-24">
        <p className="text-gray-500 mb-4">{error || 'Project not found'}</p>
        <Link to="/projects" className="text-sm font-medium text-indigo-600 hover:underline">← Back to Projects</Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Breadcrumb + title */}
      <div className="mb-7">
        <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-3 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Projects
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{project.projectName}</h1>
        {project.description && <p className="text-sm text-gray-500 mt-1 max-w-2xl">{project.description}</p>}
      </div>

      {/* Mini stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {STATS(tasks).map((s) => (
          <div key={s.label} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${s.border} shadow-sm p-4`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-2xl font-bold mt-1.5 ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Tasks</h2>
            <Link to="/tasks" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
              Manage Tasks →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Task', 'Assigned To', 'Status', 'Priority', 'Due'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">No tasks in this project yet</td>
                  </tr>
                ) : tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 font-medium text-gray-900">{task.title}</td>
                    <td className="px-6 py-3.5 text-gray-500">{task.assignedTo?.name || 'Unassigned'}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={task.status} /></td>
                    <td className="px-6 py-3.5"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-6 py-3.5 text-gray-500 text-xs">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="flex flex-col gap-5">
          {/* Team */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Team Members</h2>
            {project.teamMembers.length === 0 ? (
              <p className="text-sm text-gray-400">No members assigned</p>
            ) : (
              <ul className="space-y-3">
                {project.teamMembers.map((m) => (
                  <li key={m._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {m.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Project Info</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Created by</dt>
                <dd className="text-gray-700 font-medium">{project.createdBy?.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Created on</dt>
                <dd className="text-gray-700">{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Members</dt>
                <dd className="text-gray-700">{project.teamMembers.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
