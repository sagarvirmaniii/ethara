import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { PageLoader, TableSkeleton } from '../components/Loaders';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = user?.role === 'Admin';

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, <span className="font-medium text-gray-700">{user?.name}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
      )}

      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className={`grid gap-5 mb-8 ${isAdmin ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'}`}>
            {isAdmin ? (
              <>
                <StatCard label="Total Projects" value={data?.totalProjects} color="blue" />
                <StatCard label="Total Tasks" value={data?.totalTasks} color="indigo" />
                <StatCard label="Completed" value={data?.completedTasks} color="green" />
                <StatCard label="Pending" value={data?.pendingTasks} color="yellow" />
                <StatCard label="Overdue" value={data?.overdueTasks} color="red" />
              </>
            ) : (
              <>
                <StatCard label="Assigned Tasks" value={data?.assignedTasks} color="indigo" />
                <StatCard label="Completed" value={data?.completedTasks} color="green" />
                <StatCard label="Pending" value={data?.pendingTasks} color="yellow" />
                <StatCard label="Overdue" value={data?.overdueTasks} color="red" />
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Recent Tasks</h2>
                <p className="text-xs text-gray-400 mt-0.5">Last 5 tasks</p>
              </div>
              <Link
                to="/tasks"
                className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {!data?.recentTasks?.length ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                        No tasks yet. {isAdmin && <Link to="/tasks" className="text-indigo-600 hover:underline">Create your first task</Link>}
                      </td>
                    </tr>
                  ) : (
                    data.recentTasks.map((task) => (
                      <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                        <td className="px-6 py-4 text-gray-500">{task.project?.projectName || '—'}</td>
                        <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                        <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
