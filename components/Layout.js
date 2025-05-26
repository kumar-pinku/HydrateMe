import { Toaster } from 'react-hot-toast';
export default function Layout({ title, children }) {

  return (
    <div className="min-h-screen bg-blue-100 p-4 text-center font-sans">
      <Toaster position="top-center" />
      <div className="bg-white rounded-3xl p-4 shadow-lg max-w-md mx-auto">
        <div className="font-bold text-blue-600 text-start mb-2">HydrateMe</div>
        {title && <div className="text-blue-800 font-semibold mb-2 text-start">{title}</div>}
        {children}
      </div>
    </div>
  );
}
