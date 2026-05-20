import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { CardSkeleton } from '../components/Loaders';
import { Btn, inputCls } from '../components/FormField';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const DEFAULT = { projectName: '', description: '', teamMembers: [] };

const Projects = () => {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'Admin';

  const [projects, setProjects]   = useState([]);
  const [members, setMembers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(DEFAULT);
  const [formError, setFormError] = useState('');
  const [saving, setSaving]       = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProjects = async () => {
    try { const r = await api.get('/projects'); setProjects(r.data); }
    catch { toast('Failed to load projects', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchProjects();
    if (isAdmin) api.get('/projects/members').then((r) => setMembers(r.data)).catch(() => {});
  }, [isAdmin]);

  const openCreate = () => { setEditing(null); setForm(DEFAULT); setFormError(''); setShowModal(true); };
  const openEdit   = (p) => {
    setEditing(p);
    setForm({ projectName: p.projectName, description: p.description || '', teamMembers: p.teamMembers.map((m) => m._id) });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.projectName.trim()) return setFormError('Project name is required');
    setSaving(true);
    try {
      if (editing) { await api.put(`/projects/${editing._id}`, form); toast('Project updated', 'success'); }
      else         { await api.post('/projects', form);               toast('Project created', 'success'); }
      setShowModal(false);
      fetchProjects();
    } catch (err) { setFormError(err.response?.data?.message || 'Failed to save project'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    setDeletingId(id);
    try { await api.delete(`/projects/${id}`); setProjects((p) => p.filter((x) => x._id !== id)); toast('Project deleted', 'success'); }
    catch { toast('Failed to delete project', 'error'); }
    finally { setDeletingId(null); }
  };

  const toggleMember = (id) =>
    setForm((f) => ({
      ...f,
      teamMembers: f.teamMembers.includes(id) ? f.teamMembers.filter((m) => m !== id) : [...f.teamMembers, id],
    }));

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? 'Loading…' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {isAdmin && (
          <Btn onClick={openCreate}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Btn>
        )}
      </div>

      {/* Content */}
      {loading ? <CardSkeleton count={3} /> : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.414 6.5A1 1 0 0011.121 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600">No projects yet</p>
          {isAdmin && (
            <button onClick={openCreate} className="mt-2 text-sm text-indigo-600 hover:underline">
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div key={p._id} className="card-hover bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
              <div className="flex items-start justify-between mb-2.5">
                <Link to={`/projects/${p._id}`} className="text-sm font-semibold text-gray-900 hover:text-indigo-600 leading-snug">
                  {p.projectName}
                </Link>
                {isAdmin && (
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md">Edit</button>
                    <button onClick={() => handleDelete(p._id)} disabled={deletingId === p._id} className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50">
                      {deletingId === p._id ? '…' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 flex-1 mb-4">
                {p.description || 'No description provided'}
              </p>

              <div className="flex items-center justify-between pt-3.5 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {p.teamMembers.slice(0, 3).map((m) => (
                      <div key={m._id} title={m.name} className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold ring-2 ring-white">
                        {m.name[0].toUpperCase()}
                      </div>
                    ))}
                    {p.teamMembers.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold ring-2 ring-white">
                        +{p.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{p.teamMembers.length} member{p.teamMembers.length !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          title={editing ? 'Edit Project' : 'New Project'}
          onClose={() => setShowModal(false)}
          footer={
            <div className="flex gap-3">
              <Btn type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Btn>
              <Btn type="submit" form="project-form" loading={saving} className="flex-1">
                {saving ? 'Saving…' : editing ? 'Update Project' : 'Create Project'}
              </Btn>
            </div>
          }
        >
          <form id="project-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{formError}</div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Project Name <span className="text-red-500">*</span></label>
              <input
                type="text" autoFocus value={form.projectName}
                onChange={(e) => { setForm({ ...form, projectName: e.target.value }); setFormError(''); }}
                className={inputCls} placeholder="Enter project name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputCls} resize-none`} placeholder="Optional description"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Team Members</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {members.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">No members available</p>
                ) : members.map((m) => (
                  <label key={m._id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={form.teamMembers.includes(m._id)} onChange={() => toggleMember(m._id)} className="w-4 h-4 accent-indigo-600 flex-shrink-0" />
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {m.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default Projects;
