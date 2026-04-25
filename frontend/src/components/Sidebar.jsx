import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { userInfo } = useAuth();
  const isAdmin = userInfo?.role === "admin";

  const adminLinks = [
    { to: "/", label: "Dashboard", icon: "⌂" },
    { to: "/books", label: "Explore", icon: "◎" },
    { to: "/notifications", label: "Notifications", icon: "🔔" },
    { to: "/add-book", label: "Add Book", icon: "+" },
    { to: "/all-borrows", label: "All Borrows", icon: "☰" },
    { to: "/users", label: "Users", icon: "👥" },
  ];

  const userLinks = [
    { to: "/", label: "Dashboard", icon: "⌂" },
    { to: "/books", label: "Explore", icon: "◎" },
    { to: "/my-borrows", label: "My Library", icon: "▥" },
    { to: "/notifications", label: "Notifications", icon: "🔔" },
    { to: "/favourites", label: "Favourites", icon: "★" },
    { to: "/cart", label: "Cart", icon: "🛒" },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-[300px] min-h-screen bg-[#eef2f7] border-r border-slate-200 px-8 py-6 flex flex-col">
      <div>
        <h1 className="text-[48px] leading-[0.95] font-black text-[#07112b]">
          Book
          <br />
          House
        </h1>
      </div>

      <nav className="mt-10 flex flex-col gap-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-[22px] text-[18px] font-medium transition ${
                isActive
                  ? "bg-white text-[#ef7f73] shadow-sm border border-slate-200"
                  : "text-slate-700 hover:bg-white/70"
              }`
            }
          >
            <span className="w-6 text-center">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-300">
        <p className="text-sm uppercase tracking-wide text-slate-500">Account</p>
        <div className="mt-4">
          <p className="text-[18px] font-semibold text-[#07112b]">
            {userInfo?.name}
          </p>
          <p className="text-slate-500 capitalize">{userInfo?.role}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;