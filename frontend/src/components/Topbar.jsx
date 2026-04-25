import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";
import { useEffect, useState } from "react";
import API from "../api/axios";

const Topbar = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const { cartItems } = useLibrary();
  const [notificationCount, setNotificationCount] = useState(0);

  const isAdmin = userInfo?.role === "admin";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await API.get("/notifications");
        const unread = data.filter((n) => !n.read).length;
        setNotificationCount(unread);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Online Library</h2>
        <p className="text-slate-500 mt-1">
          {isAdmin
            ? "Manage books, borrows, and notifications"
            : "Discover books, borrow easily, manage smarter"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/notifications")}
          className="relative w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
        >
          🔔
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ef7f73] text-white text-[10px] rounded-full px-1.5 py-0.5">
              {notificationCount}
            </span>
          )}
        </button>

        {!isAdmin && (
          <button
            onClick={() => navigate("/cart")}
            className="relative w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
          >
            🛒
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-[10px] rounded-full px-1.5 py-0.5">
                {cartItems.length}
              </span>
            )}
          </button>
        )}

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 rounded-2xl px-3 py-2 transition"
        >
          <div className="w-11 h-11 rounded-full bg-[#c9d8ee] flex items-center justify-center text-sm font-bold text-slate-700">
            {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm text-slate-800">
              {userInfo?.name}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {userInfo?.role}
            </p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="bg-[#ff3a3a] hover:opacity-90 text-white px-6 py-3 rounded-2xl font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;