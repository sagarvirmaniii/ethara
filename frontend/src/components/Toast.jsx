import { createContext, useContext, useState, useCallback } from 'react';

const Ctx = createContext(null);
let uid = 0;

const STYLES = {
  success: { bar: 'bg-emerald-500', wrap: 'border-emerald-200 text-emerald-800' },
  error:   { bar: 'bg-red-500',     wrap: 'border-red-200   text-red-800'   },
  info:    { bar: 'bg-blue-500',    wrap: 'border-blue-200  text-blue-800'  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = 'success') => {
    const id = ++uid;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  return (
    <Ctx.Provider value={add}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none w-80">
        {toasts.map((t) => {
          const s = STYLES[t.type] ?? STYLES.info;
          return (
            <div
              key={t.id}
              className={`toast-enter pointer-events-auto flex items-center gap-3 bg-white border rounded-lg shadow-lg px-4 py-3 text-sm font-medium ${s.wrap}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.bar}`} />
              <span className="flex-1 leading-snug">{t.message}</span>
              <button
                onClick={() => remove(t.id)}
                className="text-current opacity-40 hover:opacity-70 leading-none text-base flex-shrink-0"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
};

export const useToast = () => useContext(Ctx);
