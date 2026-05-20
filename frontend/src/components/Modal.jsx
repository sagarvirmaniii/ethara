import { useEffect } from 'react';

const Popup = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    /*
      Overlay scrolls. Inner wrapper uses min-h-full + flex items-center
      so the panel is perfectly centered on tall screens, and the overlay
      scrolls on short screens — no clipping ever.
    */
    <div
      className="fixed inset-0 z-50 bg-black/40 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-lg w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xl leading-none"
            >
              &times;
            </button>
          </div>

          {/* Body — form + buttons scroll together, nothing ever cut off */}
          <div className="px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
