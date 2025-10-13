import { NavLink } from "react-router-dom";

const navLinkClasses = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
    isActive
      ? "bg-primary text-white shadow"
      : "text-slate-700 hover:bg-primary/10 hover:text-primary"
  }`;

function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="text-2xl font-bold text-primary">CropCare</div>
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
      </div>
    </header>
  );
}

export default Navbar;
