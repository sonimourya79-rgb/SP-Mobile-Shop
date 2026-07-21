import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-navy-900 mb-3">404</h1>
      <p className="text-navy-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-navy-800 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-navy-700">
        Back to Home
      </Link>
    </div>
  );
}
