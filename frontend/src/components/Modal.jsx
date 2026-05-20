import { useEffect } from 'react';

const Modal = ({ title, onClose, children, footer, size = 'md' }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    // Lock body scroll — the overlay's own overflow-y-auto handles modal scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    // Overlay: fixed full-screen, scrollable, flex column so modal sits at top with margin
    <div
      className="modal-backdrop fixed inset-0 z-50 bg-black/50 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/*
        Centering wrapper: min-h-full so it fills the overlay height,
        flex + items-center so the modal is vertically centered on tall screens,
        py-8 px-4 so there's always breathing room on all sides.
        pointer-events-none so clicks on the padding area hit the overlay above.
      */}
      <div className="flex items-center justify-center min-h-full py-8 px-4 pointer-events-none">
        <div
          className={`modal-enter relative bg-white rounded-2xl shadow-2xl w-full ${widths[size]} flex flex-col pointer-events-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── always visible, never scrolls */}
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

          {/* ── Body ── natural height, no overflow clipping */}
          <div className="px-6 py-5 flex flex-col gap-4">
            {children}
          </div>

          {/* ── Footer ── always visible below body, never scrolls away */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
