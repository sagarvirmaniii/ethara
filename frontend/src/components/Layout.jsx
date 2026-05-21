import Sidebar from './Sidebar';
import UserMenu from './UserMenu';

const Layout = ({ children }) => (
  <div className="flex h-screen bg-slate-50 overflow-hidden">
    <Sidebar />

    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      {/* Desktop topbar */}
      <header className="hidden lg:flex h-14 flex-shrink-0 items-center justify-end gap-4 px-6 bg-white border-b border-gray-100 sticky top-0 z-30">
        <UserMenu />
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div className="page-enter pt-14 lg:pt-0 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  </div>
);

export default Layout;
