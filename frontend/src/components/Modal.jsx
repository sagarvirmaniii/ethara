import { useEffect } from 'react';

const Modal = ({ title, onClose, children, size = 'md' }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* py-8 gives top/bottom breathing room; pointer-events-none on wrapper so clicks on padding hit the backdrop */}
      <div className="w-full flex items-center justify-center min-h-full py-8 px-4 pointer-events-none">
        <div
          className={`modal-enter bg-white rounded-xl shadow-2xl w-full ${widths[size]} flex flex-col pointer-events-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header — never scrolls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xl leading-none"
            >
              &times;
            </button>
          </div>
          {/* Body — scrolls when content overflows */}
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
