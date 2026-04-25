import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";
import BookCover from "../components/BookCover";

const MyBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const { data } = await API.get("/borrow/my");
      setBorrows(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await API.put(`/borrow/return/${borrowId}`);
      setMessage("Book returned successfully");
      fetchBorrows();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to return book");
    }
  };

  const issuedCount = borrows.filter((b) => b.status === "issued").length;
  const returnedCount = borrows.filter((b) => b.status === "returned").length;
  const fineTotal = borrows.reduce((sum, b) => sum + (b.fine || 0), 0);

  const activeBorrows = useMemo(() => {
    return [...borrows].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [borrows]);

  return (
    <Layout>
      <div className="space-y-7">
        <section className="rounded-[32px] bg-gradient-to-r from-[#07112b] via-[#16213f] to-[#ef7f73] p-8 text-white shadow-lg">
          <p className="text-white/70 text-sm">Personal Library</p>
          <h1 className="text-4xl font-black mt-2">My Library</h1>
          <p className="text-white/75 mt-2 max-w-2xl">
            Track borrowed books, due dates, returns, and fine details.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            ["Borrowed", issuedCount],
            ["Returned", returnedCount],
            ["Total Fine", `₹${fineTotal}`],
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

        {message && (
          <div className="bg-blue-50 text-blue-700 border border-blue-100 px-5 py-4 rounded-2xl">
            {message}
          </div>
        )}

        <section className="bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm">
          {activeBorrows.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#fff1ef] text-[#ef7f73] flex items-center justify-center mx-auto text-3xl">
                📚
              </div>
              <p className="text-xl font-black text-[#07112b] mt-5">
                No borrowed books yet
              </p>
              <p className="text-slate-500 mt-2">
                Borrowed books will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {activeBorrows.map((borrow, index) => {
                const isIssued = borrow.status === "issued";
                const isOverdue = isIssued && new Date(borrow.dueDate) < new Date();

                return (
                  <div
                    key={borrow._id}
                    className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-[#fbfcfe] p-5 hover:shadow-md transition"
                  >
                    <div className="flex gap-5">
                      <div className="w-28 shrink-0">
                        <BookCover
                          book={borrow.book}
                          index={index}
                          className="w-full h-36 rounded-2xl object-contain bg-white p-2"
                          innerClassName="w-16 h-24"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-black text-[#07112b] line-clamp-2">
                          {borrow.book?.title || "Book"}
                        </h3>
                        <p className="text-slate-500 mt-1">{borrow.book?.author}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                              isIssued
                                ? "bg-orange-50 text-orange-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {borrow.status}
                          </span>

                          {isOverdue && (
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-600">
                              Overdue
                            </span>
                          )}

                          <span className="px-3 py-1.5 rounded-full text-xs bg-slate-100 text-slate-600">
                            Fine: ₹{borrow.fine || 0}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 mt-4">
                          Due Date:{" "}
                          <span className="font-semibold text-slate-700">
                            {borrow.dueDate
                              ? new Date(borrow.dueDate).toLocaleDateString()
                              : "-"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                      {isIssued ? (
                        <button
                          onClick={() => handleReturn(borrow._id)}
                          className="bg-[#07112b] text-white px-5 py-3 rounded-2xl font-bold hover:bg-[#ef7f73] hover:shadow-lg active:scale-[0.98] transition"
                        >
                          Return Book
                        </button>
                      ) : (
                        <span className="bg-green-50 text-green-700 px-5 py-3 rounded-2xl text-sm font-bold">
                          Returned
                        </span>
                      )}
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

export default MyBorrows;