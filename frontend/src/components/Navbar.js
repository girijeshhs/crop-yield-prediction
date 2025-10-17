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
    <header className="sticky top-0 z-50 h-20 bg-white shadow-lg transition-all duration-300">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Sprout size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-text tracking-tight">
            CropCare
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium text-text hover:text-primary transition-colors duration-200 ${
                isActive ? 'text-primary' : ''
              }`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) =>
              `font-medium text-text hover:text-primary transition-colors duration-200 ${
                isActive ? 'text-primary' : ''
              }`
            }
          >
            Predict Yield
          </NavLink>
          <NavLink
            to="/disease"
            className={({ isActive }) =>
              `font-medium text-text hover:text-primary transition-colors duration-200 ${
                isActive ? 'text-primary' : ''
              }`
            }
          >
            Disease Detection
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-text hover:bg-primary/10 transition-all duration-200">
            <Bell size={20} />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-text hover:bg-primary/10 transition-all duration-200"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-text hover:bg-primary/10 transition-all duration-200">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
