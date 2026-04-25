import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f3f5f9] flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;