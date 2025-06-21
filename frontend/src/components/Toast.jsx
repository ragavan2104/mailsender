function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`fixed top-20 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl slide-in-top ${
      toast.type === 'success' ? 'bg-green-500/90 border border-green-400/50' :
      toast.type === 'error' ? 'bg-red-500/90 border border-red-400/50' :
      'bg-blue-500/90 border border-blue-400/50'
    }`}>
      <div className="flex items-center text-white">
        <div className="text-lg mr-3">
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
        </div>
        <p className="font-medium">{toast.message}</p>
        <button 
          onClick={onClose}
          className="ml-auto text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;
