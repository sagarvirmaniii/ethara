import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import UserMenu from './UserMenu';

const IC = {
  dashboard: (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  projects: (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.414 6.5A1 1 0 0011.121 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  ),
  tasks: (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  menu: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  x: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: IC.dashboard },
  { to: '/projects',  label: 'Projects',  icon: IC.projects  },
  { to: '/tasks',     label: 'Tasks',     icon: IC.tasks     },
];

const NavItems = ({ onClose }) => (
  <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
    {NAV.map(({ to, label, icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
            isActive
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className={isActive ? 'text-indigo-600' : 'text-gray-400'}>{icon}</span>
            {label}
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

const Brand = () => (
  <div className="flex items-center gap-2.5 px-5 h-14 border-b border-gray-100 flex-shrink-0">
    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    <span className="text-sm font-bold text-gray-900 tracking-tight">TaskManager</span>
  </div>
);

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-40 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          aria-label="Open menu"
        >
          {IC.menu}
        </button>
        <span className="text-sm font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">TaskManager</span>
        <UserMenu />
      </div>

      {/* ── Mobile backdrop ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100 flex-shrink-0">
          <Brand />
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            {IC.x}
          </button>
        </div>
        <NavItems onClose={() => setOpen(false)} />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0">
        <Brand />
        <NavItems />
      </aside>
    </>
  );
};

export default Sidebar;
