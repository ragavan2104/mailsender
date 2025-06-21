function ProgressBar({ status, progress }) {
  if (!status) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      <div className="h-1 bg-purple-900/50">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 animate-pulse-glow"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
