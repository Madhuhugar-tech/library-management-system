import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const booksRes = await API.get("/books");
      const borrowsRes = await API.get("/borrow");

      setBooks(booksRes.data || []);
      setBorrows(borrowsRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const totalBooks = books.length;
  const issuedBooks = borrows.filter(b => b.status === "issued").length;
  const returnedBooks = borrows.filter(b => b.status === "returned").length;

  const overdueBooks = borrows.filter(b => {
    return (
      b.status === "issued" &&
      new Date(b.dueDate) < new Date()
    );
  });

  return (
    <Layout>
      <div className="space-y-6">

        {/* TITLE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Manage books, users, and library activity
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Total Books</p>
            <h2 className="text-2xl font-bold">{totalBooks}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Issued</p>
            <h2 className="text-2xl font-bold">{issuedBooks}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Returned</p>
            <h2 className="text-2xl font-bold">{returnedBooks}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Overdue</p>
            <h2 className="text-2xl font-bold text-red-500">
              {overdueBooks.length}
            </h2>
          </div>
        </div>

        {/* RECENT BORROWS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

          <div className="space-y-3">
            {borrows.slice(0, 5).map(b => (
              <div key={b._id} className="bg-gray-100 p-3 rounded">
                <p className="font-semibold">{b.user?.name}</p>
                <p className="text-sm">{b.book?.title}</p>
                <p className="text-xs text-gray-500">{b.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* OVERDUE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4 text-red-500">
            Overdue Books
          </h2>

          {overdueBooks.length === 0 ? (
            <p>No overdue books</p>
          ) : (
            overdueBooks.map(b => (
              <div key={b._id} className="bg-red-50 p-3 rounded mb-2">
                <p className="font-semibold">{b.user?.name}</p>
                <p>{b.book?.title}</p>
                <p className="text-sm text-red-500">
                  Due: {new Date(b.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;