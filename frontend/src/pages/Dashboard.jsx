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
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    api.get('/dashboard')
      .then((r) => setData(r.data))
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Welcome back, <span className="font-medium text-gray-700">{user?.name}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {loading ? <PageLoader /> : (
        <>
          {/* Stat cards */}
          <div className={`grid gap-4 mb-7 ${isAdmin ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'}`}>
            {isAdmin ? (
              <>
                <StatCard label="Projects"  value={data?.totalProjects}  color="blue"   />
                <StatCard label="Tasks"     value={data?.totalTasks}     color="indigo" />
                <StatCard label="Completed" value={data?.completedTasks} color="green"  />
                <StatCard label="Pending"   value={data?.pendingTasks}   color="yellow" />
                <StatCard label="Overdue"   value={data?.overdueTasks}   color="red"    />
              </>
            ) : (
              <>
                <StatCard label="Assigned"  value={data?.assignedTasks}  color="indigo" />
                <StatCard label="Completed" value={data?.completedTasks} color="green"  />
                <StatCard label="Pending"   value={data?.pendingTasks}   color="yellow" />
                <StatCard label="Overdue"   value={data?.overdueTasks}   color="red"    />
              </>
            )}
          </div>

          {/* Recent tasks */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Recent Tasks</h2>
                <p className="text-xs text-gray-400 mt-0.5">Last 5 tasks across all projects</p>
              </div>
              <Link to="/tasks" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                View all →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Task', 'Project', 'Status', 'Priority'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {!data?.recentTasks?.length ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                        No tasks yet.{' '}
                        {isAdmin && <Link to="/tasks" className="text-indigo-600 hover:underline">Create your first task</Link>}
                      </td>
                    </tr>
                  ) : (
                    data.recentTasks.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="px-6 py-3.5 font-medium text-gray-900">{task.title}</td>
                        <td className="px-6 py-3.5 text-gray-500">{task.project?.projectName || '—'}</td>
                        <td className="px-6 py-3.5"><StatusBadge status={task.status} /></td>
                        <td className="px-6 py-3.5"><PriorityBadge priority={task.priority} /></td>
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
