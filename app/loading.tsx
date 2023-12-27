"use client"
export default function Loading() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl flex justify-center items-center h-screen">
      <div className="flex justify-center items-center space-x-2">
        <div className="animate-bounce h-4 w-4 bg-blue-400 rounded-full"></div>
        <div className="animate-bounce200 h-4 w-4 bg-blue-500 rounded-full"></div>
        <div className="animate-bounce400 h-4 w-4 bg-blue-600 rounded-full"></div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.5);
            opacity: 0.7;
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .animate-bounce200 {
          animation: bounce 1s infinite 200ms;
        }
        .animate-bounce400 {
          animation: bounce 1s infinite 400ms;
        }
      `}</style>
    </main>
  );
}
