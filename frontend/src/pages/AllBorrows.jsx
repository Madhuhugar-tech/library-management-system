import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";

const AllBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const { data } = await API.get("/borrow");
      setBorrows(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredBorrows = useMemo(() => {
    return borrows.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.user?.name?.toLowerCase().includes(searchText) ||
        item.user?.email?.toLowerCase().includes(searchText) ||
        item.book?.title?.toLowerCase().includes(searchText);

      const matchesStatus = status === "all" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [borrows, search, status]);

  const totalRecords = borrows.length;
  const returnedCount = borrows.filter((item) => item.status === "returned").length;
  const issuedCount = borrows.filter((item) => item.status === "issued").length;
  const overdueCount = borrows.filter(
    (item) => item.status === "issued" && new Date(item.dueDate) < new Date()
  ).length;

  return (
    <Layout>
      <div className="space-y-7">
        <section className="rounded-[32px] bg-gradient-to-r from-[#07112b] via-[#16213f] to-[#ef7f73] p-8 text-white shadow-lg">
          <p className="text-white/70 text-sm">Admin Borrow Monitor</p>
          <h1 className="text-4xl font-black mt-2">All Borrows</h1>
          <p className="text-white/75 mt-2 max-w-2xl">
            Monitor issued books, returned records, due dates, and fine details in one place.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            ["Total Records", totalRecords],
            ["Issued", issuedCount],
            ["Returned", returnedCount],
            ["Overdue", overdueCount],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-4xl font-black mt-2 text-[#07112b]">{value}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-[30px] border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search user, email, or book"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
            >
              <option value="all">All Status</option>
              <option value="issued">Issued</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </section>

        <section className="bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm">
          {filteredBorrows.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl font-bold text-slate-700">No borrow records found</p>
              <p className="text-slate-500 mt-2">Try changing your search or status filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBorrows.map((borrow) => {
                const isOverdue =
                  borrow.status === "issued" && new Date(borrow.dueDate) < new Date();

                return (
                  <div
                    key={borrow._id}
                    className="rounded-[24px] border border-slate-200 bg-gradient-to-r from-white to-[#fbfcfe] p-5 hover:shadow-md transition"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                      <div>
                        <p className="text-lg font-black text-[#07112b]">
                          {borrow.book?.title || "Book"}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Borrowed by {borrow.user?.name || "User"} • {borrow.user?.email || "No email"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 items-center">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${
                            borrow.status === "returned"
                              ? "bg-green-50 text-green-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {borrow.status}
                        </span>

                        {isOverdue && (
                          <span className="px-4 py-2 rounded-full text-sm font-bold bg-red-50 text-red-600">
                            Overdue
                          </span>
                        )}

                        <span className="px-4 py-2 rounded-full text-sm bg-slate-100 text-slate-600">
                          Due: {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : "-"}
                        </span>

                        <span className="px-4 py-2 rounded-full text-sm bg-[#fff1ef] text-[#ef7f73] font-bold">
                          Fine: ₹{borrow.fine || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default AllBorrows;