import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read");
      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Layout>
      <div className="space-y-7">
        <section className="rounded-[32px] bg-gradient-to-r from-[#07112b] via-[#16213f] to-[#ef7f73] p-8 text-white shadow-lg">
          <p className="text-white/70 text-sm">Activity Center</p>
          <h1 className="text-4xl font-black mt-2">Notifications</h1>
          <p className="text-white/75 mt-2 max-w-2xl">
            Track important borrow, return, and library activity updates.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-4xl font-black mt-2 text-[#07112b]">{notifications.length}</p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Unread</p>
            <p className="text-4xl font-black mt-2 text-[#ef7f73]">{unreadCount}</p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Action</p>
              <p className="text-lg font-black mt-2 text-[#07112b]">Mark all as read</p>
            </div>

            <button
              onClick={markAllRead}
              className="bg-[#ef7f73] text-white px-5 py-3 rounded-2xl font-bold hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition"
            >
              Done
            </button>
          </div>
        </section>

        <section className="bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm">
          {notifications.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#fff1ef] text-[#ef7f73] flex items-center justify-center mx-auto text-3xl">
                🔔
              </div>
              <p className="text-xl font-black text-[#07112b] mt-5">No notifications yet</p>
              <p className="text-slate-500 mt-2">
                New library updates will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className={`rounded-[24px] border p-5 flex gap-4 items-start transition hover:shadow-md ${
                    n.read
                      ? "bg-white border-slate-200"
                      : "bg-gradient-to-r from-[#fff7f5] to-white border-[#ffd7d2]"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      n.read ? "bg-slate-100" : "bg-[#ef7f73] text-white"
                    }`}
                  >
                    🔔
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-black text-[#07112b] text-lg">{n.title}</h3>
                        <p className="text-slate-600 mt-1">{n.message}</p>
                      </div>

                      {!n.read && (
                        <span className="bg-[#ef7f73] text-white text-xs font-bold px-3 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-3">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Notifications;