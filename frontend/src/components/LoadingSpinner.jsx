function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        <p className="text-white text-lg">Loading your mail application...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
