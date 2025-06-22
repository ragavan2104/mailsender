function ProgressBar({ status, progress }) {
  if (!status) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
