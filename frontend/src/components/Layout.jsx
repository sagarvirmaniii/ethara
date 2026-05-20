import Sidebar from './Sidebar';
import UserMenu from './UserMenu';

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-slate-50">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top header bar */}
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 flex-shrink-0 sticky top-0 z-30">
        <UserMenu />
      </header>

      <main className="flex-1 overflow-auto">
        <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  </div>
);

export default Layout;
