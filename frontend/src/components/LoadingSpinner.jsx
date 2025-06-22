function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-gray-600 text-lg font-medium">Loading your mail application...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
