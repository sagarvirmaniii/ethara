import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { TableSkeleton } from '../components/Loaders';
import { Btn, inputCls } from '../components/FormField';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const defaultForm = {
  title: '', description: '', assignedTo: '', project: '',
  status: 'Todo', priority: 'Medium', dueDate: '',
};

const Tasks = () => {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'Admin';

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const r = await api.get('/projects');
        setProjects(r.data);
        if (r.data.length > 0) setSelectedProject(r.data[0]._id);
      } catch {
        toast('Failed to load projects', 'error');
      } finally {
        setProjectsLoading(false);
      }
    };
    init();
    if (isAdmin) api.get('/projects/members').then((r) => setMembers(r.data)).catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedProject) return;
    setLoading(true);
    api.get(`/tasks/project/${selectedProject}`)
      .then((r) => setTasks(r.data))
      .catch(() => toast('Failed to load tasks', 'error'))
      .finally(() => setLoading(false));
  }, [selectedProject]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...defaultForm, project: selectedProject });
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo?._id || '',
      project: task.project,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setFormError('Task title is required');
    if (!form.project) return setFormError('Please select a project');
    setSaving(true);
    try {
      if (editing) {
        const { data } = await api.put(`/tasks/${editing._id}`, form);
        setTasks((prev) => prev.map((t) => t._id === editing._id ? data : t));
        toast('Task updated successfully', 'success');
      } else {
        await api.post('/tasks', form);
        const r = await api.get(`/tasks/project/${selectedProject}`);
        setTasks(r.data);
        toast('Task created successfully', 'success');
      }
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (task, status) => {
    setUpdatingId(task._id);
    try {
      await api.put(`/tasks/${task._id}`, { status });
      setTasks((prev) => prev.map((t) => t._id === task._id ? { ...t, status } : t));
      toast('Status updated', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast('Task deleted', 'success');
    } catch {
      toast('Failed to delete task', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setFormError(''); };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading...' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {isAdmin && (
          <Btn onClick={openCreate} size="md" disabled={projects.length === 0}>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Btn>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Filter by Project</label>
        {projectsLoading ? (
          <div className="h-10 w-64 bg-gray-100 rounded-lg animate-pulse" />
        ) : projects.length === 0 ? (
          <p className="text-sm text-gray-400">No projects available</p>
        ) : (
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className={`${inputCls} w-64`}
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.projectName}</option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</th>
                {isAdmin && (
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton rows={4} cols={isAdmin ? 6 : 5} />
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-16 text-center">
                    <p className="text-gray-400 text-sm">No tasks found for this project</p>
                    {isAdmin && (
                      <button onClick={openCreate} className="mt-2 text-indigo-600 text-sm hover:underline font-medium">
                        Create the first task
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const isMyTask = task.assignedTo?._id === user._id;
                  const canUpdateStatus = !isAdmin && isMyTask;

                  return (
                    <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">{task.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {task.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {task.assignedTo.name[0].toUpperCase()}
                            </div>
                            <span className="text-gray-700 text-sm">{task.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {canUpdateStatus ? (
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusUpdate(task, e.target.value)}
                            disabled={updatingId === task._id}
                            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:opacity-60 cursor-pointer"
                          >
                            <option>Todo</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                          </select>
                        ) : (
                          <StatusBadge status={task.status} />
                        )}
                      </td>
                      <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {task.dueDate ? (
                          <span className={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-red-500 font-medium' : ''}>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        ) : '—'}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(task)}
                              className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task._id)}
                              disabled={deletingId === task._id}
                              className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all disabled:opacity-50"
                            >
                              {deletingId === task._id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Task' : 'New Task'}
          onClose={() => setShowModal(false)}
          footer={
            <div className="flex gap-3">
              <Btn type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                Cancel
              </Btn>
              <Btn type="submit" form="task-form" loading={saving} className="flex-1">
                {saving ? 'Saving...' : editing ? 'Update Task' : 'Create Task'}
              </Btn>
            </div>
          }
        >
          <form id="task-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{formError}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={set('title')}
                className={inputCls}
                placeholder="Task title"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={2}
                className={`${inputCls} resize-none`}
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Project <span className="text-red-500">*</span>
                </label>
                <select value={form.project} onChange={set('project')} className={inputCls}>
                  <option value="">Select project</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign To</label>
                <select value={form.assignedTo} onChange={set('assignedTo')} className={inputCls}>
                  <option value="">Unassigned</option>
                  {members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select value={form.status} onChange={set('status')} className={inputCls}>
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                <select value={form.priority} onChange={set('priority')} className={inputCls}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={set('dueDate')}
                className={inputCls}
              />
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default Tasks;
