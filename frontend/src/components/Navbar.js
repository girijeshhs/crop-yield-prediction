import { NavLink } from "react-router-dom";
import { Bell, User, Sun, Moon, Sprout } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 h-20 transition-all duration-300 ${
      isScrolled
        ? 'backdrop-blur-md bg-primary/95 shadow-2xl shadow-primary/20'
        : 'bg-primary'
    }`}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
            <Sprout size={24} className="text-white" />
          </div>
          <div className="font-display text-2xl font-bold text-white tracking-tight">
            CropCare
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Predict Yield
          </NavLink>
          <NavLink
            to="/disease"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Disease Detection
          </NavLink>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-secondary transition-all duration-200 hover:scale-110"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-secondary transition-all duration-200 hover:scale-110"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-secondary transition-all duration-200 hover:scale-110"
            aria-label="User profile"
          >
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu - Hidden for now, can be implemented later */}
    </header>
  );
};

export default Navbar;
