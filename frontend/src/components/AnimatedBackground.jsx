function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Floating particles */}
      <div className="absolute top-20 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-40"></div>
      <div className="absolute top-40 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-blue-400 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}}></div>
    </div>
  );
}

export default AnimatedBackground;
