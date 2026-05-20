import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { PageLoader } from '../components/Loaders';
import api from '../api/axios';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get(`/projects/${id}`), api.get(`/tasks/project/${id}`)])
      .then(([pRes, tRes]) => {
        setProject(pRes.data);
        setTasks(tRes.data);
      })
      .catch(() => setError('Failed to load project details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout><PageLoader /></Layout>;

  if (error || !project) {
    return (
      <Layout>
        <div className="text-center py-24">
          <p className="text-gray-500 mb-4">{error || 'Project not found'}</p>
          <Link to="/projects" className="text-indigo-600 hover:underline text-sm font-medium">
            Back to Projects
          </Link>
        </div>
      </Layout>
    );
  }

  const stats = [
    { label: 'Total Tasks', value: tasks.length, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    { label: 'Completed', value: tasks.filter((t) => t.status === 'Completed').length, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { label: 'In Progress', value: tasks.filter((t) => t.status === 'In Progress').length, color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { label: 'Todo', value: tasks.filter((t) => t.status === 'Todo').length, color: 'bg-gray-50 text-gray-700 border-gray-100' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{project.projectName}</h1>
        {project.description && (
          <p className="text-gray-500 text-sm mt-1.5 max-w-2xl">{project.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.color}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.label}</p>
            <p className="text-3xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Tasks</h2>
            <Link
              to="/tasks"
              className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-1"
            >
              Manage Tasks
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                      No tasks in this project yet
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 text-gray-500">{task.assignedTo?.name || 'Unassigned'}</td>
                      <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                      <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Team Members</h2>
            {project.teamMembers.length === 0 ? (
              <p className="text-sm text-gray-400">No members assigned to this project</p>
            ) : (
              <ul className="space-y-3">
                {project.teamMembers.map((m) => (
                  <li key={m._id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
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

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Project Info</h2>
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
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Total members</dt>
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
