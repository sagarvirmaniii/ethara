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
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`modal-enter bg-white rounded-2xl shadow-2xl w-full ${widths[size]} flex flex-col max-h-[90vh]`}>
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
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
