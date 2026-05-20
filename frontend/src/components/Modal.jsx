import { useEffect } from 'react';

const Modal = ({ title, onClose, children, footer, size = 'md' }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    /*
      Overlay: fixed inset-0, overflow-y-auto is the ONLY scroller.
      No body scroll lock — the overlay itself is the scroll container.
      flex + justify-center centers horizontally.
      p-4 ensures the modal never touches screen edges on any side.
    */
    <div
      className="modal-backdrop fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/*
        Modal box: my-8 gives 32px top+bottom breathing room and also
        acts as the vertical centering mechanism on tall screens.
        max-h-[90vh] + overflow-y-auto lets the box itself scroll on
        very short viewports as a second safety net.
        w-full + max-w-* handles responsive width.
      */}
      <div
        className={`modal-enter relative bg-white rounded-2xl shadow-2xl w-full ${widths[size]} my-8 h-fit flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — never scrolls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body — all form content lives here */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {children}
        </div>

        {/* Footer — Cancel / Submit buttons, always below body */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
