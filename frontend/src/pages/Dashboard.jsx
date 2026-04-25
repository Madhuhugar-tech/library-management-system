import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api/axios";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import BookCover from "../components/BookCover";

const Dashboard = () => {
  const navigate = useNavigate();
  const { cartItems, favourites } = useLibrary();
  const { userInfo } = useAuth();

  const isAdmin = userInfo?.role === "admin";

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [allBorrows, setAllBorrows] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchBorrows();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/books");
      setBooks(data || []);
    } catch (err) {
      console.log(err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrows = async () => {
    try {
      if (isAdmin) {
        const { data } = await API.get("/borrow");
        setAllBorrows(data || []);
      } else {
        const { data } = await API.get("/borrow/my");
        setMyBorrows(data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      return (
        book.title?.toLowerCase().includes(search.toLowerCase()) ||
        book.author?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [books, search]);

  const featuredBook = filteredBooks[0];
  const showcaseBooks = filteredBooks.slice(0, 4);
  const recentBooks = books.slice(0, 5);

  const issuedCount = allBorrows.filter((b) => b.status === "issued").length;
  const returnedCount = allBorrows.filter((b) => b.status === "returned").length;
  const overdueCount = allBorrows.filter(
    (b) => b.status === "issued" && new Date(b.dueDate) < new Date()
  ).length;

  const lowStockBooks = books
    .filter((book) => book.availableCopies <= 2)
    .slice(0, 4);

  const userBorrowedCount = myBorrows.filter((b) => b.status === "issued").length;
  const userReturnedCount = myBorrows.filter((b) => b.status === "returned").length;

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto space-y-6">
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 rounded-[30px] border border-slate-200 bg-gradient-to-br from-white via-[#fff8f6] to-[#f9fbff] shadow-sm overflow-hidden">
            <div className="p-7 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#fff1ef] px-4 py-1.5 text-sm font-medium text-[#ef7f73]">
                    <span className="w-2 h-2 rounded-full bg-[#ef7f73]" />
                    {isAdmin ? "Admin Control Center" : "Your Personal Reading Space"}
                  </div>

                  <h1 className="mt-5 text-4xl md:text-5xl font-black text-[#07112b] leading-[1.05] max-w-[700px]">
                    {isAdmin ? "Run your library with clarity and style" : "Find books you’ll actually want to read"}
                  </h1>

                  <p className="mt-4 text-[20px] leading-8 text-slate-600 max-w-[720px]">
                    {isAdmin
                      ? "Track inventory, monitor borrow activity, and manage the entire collection from one elegant dashboard."
                      : "Browse trending titles, save favorites, manage your cart, and borrow books from a smart digital library."}
                  </p>

                  <div className="mt-6 flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder={isAdmin ? "Search books to manage" : "Search books by title or author"}
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-slate-700 outline-none shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={() => navigate("/books")}
                      className="rounded-2xl bg-[#ef7f73] px-7 py-4 text-white font-semibold shadow-sm hover:opacity-90 transition whitespace-nowrap"
                    >
                      {isAdmin ? "Manage Collection" : "Explore Books"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full lg:w-[320px] shrink-0">
                  <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Total Books</p>
                    <p className="mt-2 text-4xl font-black text-[#07112b]">{books.length}</p>
                  </div>

                  {isAdmin ? (
                    <>
                      <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Issued</p>
                        <p className="mt-2 text-4xl font-black text-[#07112b]">{issuedCount}</p>
                      </div>
                      <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Returned</p>
                        <p className="mt-2 text-4xl font-black text-[#07112b]">{returnedCount}</p>
                      </div>
                      <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Overdue</p>
                        <p className="mt-2 text-4xl font-black text-[#ef7f73]">{overdueCount}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Cart</p>
                        <p className="mt-2 text-4xl font-black text-[#07112b]">{cartItems.length}</p>
                      </div>
                      <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Favorites</p>
                        <p className="mt-2 text-4xl font-black text-[#07112b]">{favourites.length}</p>
                      </div>
                      <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Borrowed</p>
                        <p className="mt-2 text-4xl font-black text-[#07112b]">{userBorrowedCount + userReturnedCount}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-[#07112b]">
                  {isAdmin ? "Fresh Arrival" : "Featured Pick"}
                </h2>
                <span className="rounded-full bg-[#fff1ef] px-3 py-1 text-xs font-semibold text-[#ef7f73]">
                  {isAdmin ? "Library" : "Editor’s Pick"}
                </span>
              </div>

              {featuredBook ? (
                <div
                  onClick={() => navigate(`/book/${featuredBook._id}`)}
                  className="cursor-pointer"
                >
                  <div className="rounded-[26px] bg-gradient-to-br from-[#f8fafc] to-[#fff7f3] p-4">
                    <BookCover
                      book={featuredBook}
                      index={0}
                      className="w-full h-[260px] rounded-[22px] object-contain bg-white p-3"
                      innerClassName="w-36 h-52"
                    />
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-[#07112b] line-clamp-2">
                    {featuredBook.title}
                  </h3>
                  <p className="mt-2 text-lg text-slate-500">{featuredBook.author}</p>
                  <p className="mt-3 text-slate-600 line-clamp-3">
                    {featuredBook.description || "Discover this standout title from the collection."}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500">No featured book available.</p>
              )}
            </div>
          </div>
        </section>

        {isAdmin ? (
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-8 rounded-[30px] border border-slate-200 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-3xl font-black text-[#07112b]">Recent Borrow Activity</h2>
                  <p className="text-slate-500 mt-1">Latest borrow and return actions across the library.</p>
                </div>

                <button
                  onClick={() => navigate("/all-borrows")}
                  className="text-sm font-semibold text-[#ef7f73]"
                >
                  View all
                </button>
              </div>

              {allBorrows.length === 0 ? (
                <p className="text-slate-500">No borrow activity found.</p>
              ) : (
                <div className="space-y-4">
                  {allBorrows.slice(0, 6).map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl border border-slate-200 bg-[#fbfcfe] px-5 py-4 flex items-center justify-between hover:shadow-sm transition"
                    >
                      <div>
                        <p className="text-lg font-bold text-[#07112b]">
                          {item.user?.name || "User"}
                        </p>
                        <p className="text-slate-500 mt-1">
                          {item.book?.title || "Book"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-bold capitalize ${
                            item.status === "returned" ? "text-green-600" : "text-[#ef7f73]"
                          }`}
                        >
                          {item.status}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="xl:col-span-4 rounded-[30px] border border-slate-200 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-black text-[#07112b]">Low Stock Books</h2>
                  <p className="text-slate-500 text-sm mt-1">Books that may need attention.</p>
                </div>
              </div>

              {lowStockBooks.length === 0 ? (
                <p className="text-slate-500">No low stock books right now.</p>
              ) : (
                <div className="space-y-4">
                  {lowStockBooks.map((book, index) => (
                    <div
                      key={book._id}
                      onClick={() => navigate(`/book/${book._id}`)}
                      className="cursor-pointer rounded-2xl border border-slate-200 bg-[#fbfcfe] p-4 flex gap-4 items-center hover:shadow-sm transition"
                    >
                      <div className="w-20 shrink-0">
                        <BookCover
                          book={book}
                          index={index}
                          className="w-full h-24 rounded-xl object-contain bg-white p-2"
                          innerClassName="w-10 h-14"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-[#07112b] line-clamp-2">{book.title}</p>
                        <p className="text-sm text-slate-500 mt-1">{book.author}</p>
                        <p className="text-sm text-[#ef7f73] mt-2">
                          {book.availableCopies} copies left
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="rounded-[30px] border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-3xl font-black text-[#07112b]">Trending Books</h2>
                <p className="text-slate-500 mt-1">Books readers are checking out the most.</p>
              </div>

              <button
                onClick={() => navigate("/books")}
                className="text-sm font-semibold text-[#ef7f73]"
              >
                View all
              </button>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading books...</p>
            ) : showcaseBooks.length === 0 ? (
              <p className="text-slate-500">No books available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {showcaseBooks.map((book, index) => (
                  <div
                    key={book._id}
                    onClick={() => navigate(`/book/${book._id}`)}
                    className="cursor-pointer rounded-[24px] border border-slate-200 bg-[#fcfcfd] p-4 hover:shadow-md transition"
                  >
                    <BookCover
                      book={book}
                      index={index}
                      className="w-full h-64 rounded-[20px] object-contain bg-white p-3"
                      innerClassName="w-28 h-40"
                    />

                    <div className="mt-4">
                      <p className="text-xs font-semibold text-[#ef7f73]">{book.category}</p>
                      <h3 className="mt-1 text-lg font-bold text-[#07112b] line-clamp-2">{book.title}</h3>
                      <p className="mt-1 text-slate-500">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {!isAdmin && (
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-7 rounded-[30px] border border-slate-200 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-black text-[#07112b]">Your Borrow Summary</h2>
                  <p className="text-slate-500 mt-1">A quick look at your library activity.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-3xl bg-gradient-to-br from-[#fff7f3] to-white border border-slate-200 p-5">
                  <p className="text-sm text-slate-500">Borrowed</p>
                  <p className="mt-2 text-4xl font-black text-[#07112b]">{userBorrowedCount}</p>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-[#f8fbff] to-white border border-slate-200 p-5">
                  <p className="text-sm text-slate-500">Returned</p>
                  <p className="mt-2 text-4xl font-black text-[#07112b]">{userReturnedCount}</p>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-[#fff9f7] to-white border border-slate-200 p-5">
                  <p className="text-sm text-slate-500">Favorites</p>
                  <p className="mt-2 text-4xl font-black text-[#07112b]">{favourites.length}</p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-5 rounded-[30px] border border-slate-200 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-black text-[#07112b]">Recently Added</h2>
                  <p className="text-slate-500 text-sm mt-1">Fresh books from the collection.</p>
                </div>
              </div>

              <div className="space-y-4">
                {recentBooks.slice(0, 4).map((book, index) => (
                  <div
                    key={book._id}
                    onClick={() => navigate(`/book/${book._id}`)}
                    className="cursor-pointer rounded-2xl border border-slate-200 bg-[#fbfcfe] p-4 flex gap-4 items-center hover:shadow-sm transition"
                  >
                    <div className="w-20 shrink-0">
                      <BookCover
                        book={book}
                        index={index + 4}
                        className="w-full h-24 rounded-xl object-contain bg-white p-2"
                        innerClassName="w-10 h-14"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-[#07112b] line-clamp-2">{book.title}</p>
                      <p className="text-sm text-slate-500 mt-1">{book.author}</p>
                      <p className="text-xs text-[#ef7f73] mt-2">{book.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;