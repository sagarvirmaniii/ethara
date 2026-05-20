import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inputCls, Btn } from '../components/FormField';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((p) => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name     = 'Full name is required';
    if (!form.email.trim())      e.email    = 'Email is required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ id, label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">TaskManager</h1>
          <p className="text-sm text-gray-500 mt-1">Team collaboration, simplified</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Create your account</h2>
          <p className="text-sm text-gray-500 mb-6">Get started for free</p>

          {apiError && (
            <div className="mb-5 flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Full Name" required error={errors.name}>
              <input type="text" required autoComplete="name" value={form.name} onChange={set('name')}
                className={`${inputCls} ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`} placeholder="Jane Smith" />
            </Field>

            <Field label="Email address" required error={errors.email}>
              <input type="email" required autoComplete="email" value={form.email} onChange={set('email')}
                className={`${inputCls} ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`} placeholder="you@example.com" />
            </Field>

            <Field label="Password" required error={errors.password}>
              <input type="password" required autoComplete="new-password" value={form.password} onChange={set('password')}
                className={`${inputCls} ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`} placeholder="Minimum 6 characters" />
            </Field>

            <Field label="Role">
              <select value={form.role} onChange={set('role')} className={inputCls}>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </Field>

            <Btn type="submit" size="lg" loading={loading} className="w-full mt-1">
              {loading ? 'Creating account…' : 'Create Account'}
            </Btn>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
