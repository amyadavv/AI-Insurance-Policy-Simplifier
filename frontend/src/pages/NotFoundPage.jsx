// frontend/src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
    <div>
      <h1 className="text-8xl font-extrabold text-primary-500 mb-4">404</h1>
      <p className="text-xl text-slate-300 mb-2">Page Not Found</p>
      <p className="text-slate-500 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl transition-all cursor-pointer font-medium"
      >
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
