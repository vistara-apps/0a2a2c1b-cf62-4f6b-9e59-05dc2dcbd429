export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Loading RightsSphere</h2>
        <p className="text-white text-opacity-70">Preparing your legal rights guide...</p>
      </div>
    </div>
  );
}
