import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let id = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const toastId = ++id;
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toastId)), 3500);
  }, []);

  const removeToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-enter pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-[260px] max-w-sm ${
              t.type === 'success'
                ? 'bg-white border border-green-200 text-green-800'
                : t.type === 'error'
                ? 'bg-white border border-red-200 text-red-800'
                : 'bg-white border border-blue-200 text-blue-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
              t.type === 'success' ? 'bg-green-500' : t.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`} />
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0 leading-none"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
