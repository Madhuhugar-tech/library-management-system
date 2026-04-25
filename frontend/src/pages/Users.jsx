import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/auth/users");
      setUsers(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const value = search.toLowerCase();

      return (
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.role?.toLowerCase().includes(value)
      );
    });
  }, [users, search]);

  const totalUsers = users.length;
  const normalUsers = users.filter((u) => u.role === "user").length;
  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <Layout>
      <div className="space-y-7">
        <section className="rounded-[32px] bg-gradient-to-r from-[#07112b] via-[#16213f] to-[#ef7f73] p-8 text-white shadow-lg">
          <p className="text-white/70 text-sm">Admin Member Directory</p>
          <h1 className="text-4xl font-black mt-2">Users</h1>
          <p className="text-white/75 mt-2 max-w-2xl">
            View registered users, admins, and library members in one place.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="text-4xl font-black mt-2 text-[#07112b]">{totalUsers}</p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-slate-500">Normal Users</p>
            <p className="text-4xl font-black mt-2 text-[#07112b]">{normalUsers}</p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-slate-500">Admins</p>
            <p className="text-4xl font-black mt-2 text-[#07112b]">{admins}</p>
          </div>
        </section>

        <section className="bg-white rounded-[30px] border border-slate-200 p-5 shadow-sm">
          <input
            type="text"
            placeholder="Search users by name, email, or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
          />
        </section>

        <section className="bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#fff1ef] text-[#ef7f73] flex items-center justify-center mx-auto text-3xl">
                👥
              </div>
              <p className="text-xl font-black text-[#07112b] mt-5">
                No users found
              </p>
              <p className="text-slate-500 mt-2">
                Registered users will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="rounded-[26px] border border-slate-200 bg-gradient-to-br from-white to-[#fbfcfe] p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[22px] bg-[#fff1ef] text-[#ef7f73] flex items-center justify-center text-2xl font-black shrink-0">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-[#07112b] truncate">
                        {user.name}
                      </h3>
                      <p className="text-slate-500 mt-1 truncate">{user.email}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                            user.role === "admin"
                              ? "bg-[#fff1ef] text-[#ef7f73]"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>

                        <span className="px-3 py-1.5 rounded-full text-xs bg-slate-100 text-slate-600">
                          Joined:{" "}
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </div>
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

export default Users;