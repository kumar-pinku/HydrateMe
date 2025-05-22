import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ title, children }) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="min-h-screen bg-blue-100 p-4 text-center font-sans">
      <div className="bg-white rounded-3xl p-4 shadow-lg max-w-md mx-auto">
        <div className="font-bold text-blue-600 text-start mb-2">Drink Water Reminder</div>

        {/* Navigation Tabs */}
        <div className="flex justify-between items-center mb-4 text-blue-600">
          <Link
            href="/"
            className={`px-2 py-1 ${currentPath === '/' ? 'border-b-2 border-blue-500 font-bold' : 'opacity-60'}`}
          >
            Home
          </Link>
          <Link
            href="/history"
            className={`px-2 py-1 ${currentPath === '/history' ? 'border-b-2 border-blue-500 font-bold' : 'opacity-60'}`}
          >
            History
          </Link>
          <Link
            href="/settings"
            className={`px-2 py-1 ${currentPath === '/settings' ? 'border-b-2 border-blue-500 font-bold' : 'opacity-60'}`}
          >
            Settings
          </Link>
        </div>

        {title && <div className="text-blue-800 font-semibold mb-2 text-start">{title}</div>}

        {children}
      </div>
    </div>
  );
}
