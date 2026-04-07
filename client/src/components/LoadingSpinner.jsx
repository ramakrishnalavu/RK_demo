import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      </div>
      <p className="text-gray-400 text-sm animate-pulse">{message}</p>
    </div>
  );
}
