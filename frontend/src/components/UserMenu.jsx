import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key   = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', key); };
  }, []);

  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const handleLogout = () => { setOpen(false); logout(); navigate('/login'); };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        aria-expanded={open}
      >
        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold select-none flex-shrink-0">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">{user?.name}</span>
        <svg className={`hidden sm:block w-3.5 h-3.5 text-gray-400 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {/* Profile */}
          <div className="px-4 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold select-none flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <span className={`mt-2.5 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
              user?.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {user?.role}
            </span>
          </div>

          {/* Sign out */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
