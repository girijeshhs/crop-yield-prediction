import { NavLink } from "react-router-dom";
import { Bell, User, Sprout } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-md bg-slate-900/80 border-b border-white/10 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30">
            <Sprout size={24} className="text-white" />
          </div>
          <div className="font-['Inter'] text-2xl font-bold text-white tracking-tight">
            CropCare
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-['Inter'] font-medium text-slate-300 hover:text-emerald-400 transition-colors duration-200 ${
                isActive ? 'text-emerald-400' : ''
              }`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) =>
              `font-['Inter'] font-medium text-slate-300 hover:text-emerald-400 transition-colors duration-200 ${
                isActive ? 'text-emerald-400' : ''
              }`
            }
          >
            Predict Yield
          </NavLink>
          <NavLink
            to="/disease"
            className={({ isActive }) =>
              `font-['Inter'] font-medium text-slate-300 hover:text-emerald-400 transition-colors duration-200 ${
                isActive ? 'text-emerald-400' : ''
              }`
            }
          >
            Disease Detection
          </NavLink>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-200">
            <Bell size={20} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-200">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
