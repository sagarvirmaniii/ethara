/* Shared input class — used everywhere inputs/selects/textareas appear */
export const inputCls = [
  'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5',
  'text-sm text-gray-900 placeholder-gray-400',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
  'disabled:bg-slate-50 disabled:text-gray-400 disabled:cursor-not-allowed',
].join(' ');

export const FormField = ({ label, required, error, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const Spinner = () => (
  <svg className="animate-spin w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-sm gap-2',
};

const VARIANTS = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500 shadow-sm',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-300 shadow-sm',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm',
  ghost:     'text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300',
};

export const Btn = ({
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  children,
  className = '',
  ...props
}) => (
  <button
    disabled={disabled || loading}
    className={[
      'inline-flex items-center justify-center font-medium rounded-lg',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
      'btn-press',
      SIZES[size],
      VARIANTS[variant],
      className,
    ].join(' ')}
    {...props}
  >
    {loading ? <><Spinner />{children}</> : children}
  </button>
);
