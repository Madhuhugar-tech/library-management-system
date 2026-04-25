import { useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { userInfo, setUserInfo } = useAuth();

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const payload = {
        name: formData.name,
      };

      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      const { data } = await API.put("/auth/profile", payload);

      setUserInfo(data);
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Profile update failed");
      setIsError(true);
    }
  };

  return (
    <Layout>
      <div className="max-w-[1000px] mx-auto space-y-7">
        <section className="rounded-[32px] bg-gradient-to-r from-[#07112b] via-[#16213f] to-[#ef7f73] p-8 text-white shadow-lg">
          <p className="text-white/70 text-sm">Account Settings</p>
          <h1 className="text-4xl font-black mt-2">My Profile</h1>
          <p className="text-white/75 mt-2 max-w-2xl">
            Update your account name and password securely.
          </p>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-4 bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm h-fit">
            <div className="w-24 h-24 rounded-[30px] bg-[#fff1ef] text-[#ef7f73] flex items-center justify-center text-4xl font-black">
              {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2 className="text-2xl font-black text-[#07112b] mt-5">
              {userInfo?.name}
            </h2>
            <p className="text-slate-500 mt-1">{userInfo?.email}</p>

            <div className="mt-5 inline-flex px-4 py-2 rounded-full bg-[#f8fafc] border border-slate-200 text-sm font-bold text-slate-700 capitalize">
              {userInfo?.role}
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100">
                <p className="text-sm text-slate-500">Account Type</p>
                <p className="font-black text-[#07112b] capitalize mt-1">
                  {userInfo?.role}
                </p>
              </div>

              <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100">
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-black text-[#07112b] mt-1 break-all">
                  {userInfo?.email}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleUpdate}
            className="xl:col-span-8 bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm"
          >
            <h2 className="text-2xl font-black text-[#07112b]">
              Update Profile
            </h2>
            <p className="text-slate-500 mt-1">
              Change your display name or set a new password.
            </p>

            {message && (
              <div
                className={`mt-5 px-5 py-4 rounded-2xl border font-medium ${
                  isError
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-green-50 text-green-600 border-green-100"
                }`}
              >
                {message}
              </div>
            )}

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={userInfo?.email || ""}
                  disabled
                  className="mt-2 w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 text-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave empty if you don't want to change password"
                  className="mt-2 w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
                />
              </div>

              <button className="bg-[#ef7f73] text-white px-8 py-4 rounded-2xl font-black hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition">
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </div>
    </Layout>
  );
};

export default Profile;