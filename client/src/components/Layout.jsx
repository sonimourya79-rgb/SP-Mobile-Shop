import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div key={location.pathname} className="animate-fade-in-up">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
