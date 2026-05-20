import { useEffect } from 'react';

const Modal = ({ title, onClose, children, footer, size = 'md' }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKey);

    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const widths = {
    sm: 'max-w-lg',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative my-8 flex w-full ${widths[size]} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-8">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 bg-white px-8 py-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;