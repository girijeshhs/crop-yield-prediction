import { NavLink } from "react-router-dom";
import { Bell, User, Sun, Moon, Leaf } from "lucide-react";
import { useState } from "react";

const navLinkClasses = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
    isActive
      ? "bg-primary-lighter text-white shadow"
      : "text-slate hover:bg-primary/10 hover:text-primary"
  }`;

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className="bg-primary shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-lighter rounded-lg">
            <Leaf size={20} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-white">CropCare</div>
        </div>
        <nav className="flex gap-2">
          <NavLink to="/" className={navLinkClasses} end>
            Home
          </NavLink>
          <NavLink to="/predict" className={navLinkClasses}>
            Predict Yield
          </NavLink>
          <NavLink to="/disease" className={navLinkClasses}>
            Disease Detection
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <button
            className="p-2 text-white hover:bg-primary-lighter rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-white hover:bg-primary-lighter rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="p-2 text-white hover:bg-primary-lighter rounded-lg transition-colors"
            aria-label="User profile"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
