import { useEffect } from 'react';

const WIDTHS = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

const Modal = ({ title, onClose, children, footer, size = 'md' }) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    /* Overlay — covers viewport, dims background */
    <div
      className="modal-overlay-enter fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-4 sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/*
        Panel wrapper: my-8 gives breathing room top+bottom.
        On short viewports the overlay scrolls to reveal the full panel.
        max-h-[calc(100vh-4rem)] + overflow-y-auto = internal scroll safety net.
      */}
      <div
        className={`modal-panel-enter relative w-full ${WIDTHS[size]} my-8 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-4rem)] overflow-hidden`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-white">
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 min-h-0">
          {children}
        </div>

        {/* ── Sticky footer ── */}
        {footer && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
