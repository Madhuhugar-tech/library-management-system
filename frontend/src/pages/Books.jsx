import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import BookCover from "../components/BookCover";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";

const Books = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { addToCart, toggleFavourite, isFavourite } = useLibrary();

  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await API.get("/books");

      const withRatings = (data || []).map((book, index) => ({
        ...book,
        rating: 3.8 + ((index % 3) * 0.4),
      }));

      setBooks(withRatings);
    } catch (err) {
      console.log(err);
    }
  };

  const categories = useMemo(() => {
    return [...new Set(books.map((book) => book.category).filter(Boolean))];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const search = appliedSearch.toLowerCase();

      const matchesSearch =
        !search ||
        book.title?.toLowerCase().includes(search) ||
        book.author?.toLowerCase().includes(search) ||
        book.isbn?.toLowerCase().includes(search);

      const matchesCategory =
        !selectedCategory || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [books, appliedSearch, selectedCategory]);

  const handleSearch = () => {
    setAppliedSearch(searchInput);
  };

  const handleIssueBook = async (bookId, title) => {
    const dueDate = prompt("Enter due date in YYYY-MM-DD format");
    if (!dueDate) return;

    try {
      await API.post("/borrow/issue", { bookId, dueDate });
      setMessage(`${title} issued successfully`);
      fetchBooks();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to issue book");
    }
  };

  const renderStars = (rating) => {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  };

  return (
    <Layout>
      <div className="space-y-7">
        <section className="rounded-[32px] bg-gradient-to-r from-[#07112b] via-[#16213f] to-[#ef7f73] p-7 text-white shadow-lg">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <p className="text-sm text-white/70">Book House Collection</p>
              <h1 className="text-4xl font-black mt-2">Explore Books</h1>
              <p className="text-white/75 mt-2 max-w-xl">
                Search, filter, save favourites, and borrow books from your smart digital library.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-[260px]">
              <div className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20">
                <p className="text-sm text-white/70">Total Books</p>
                <p className="text-3xl font-black mt-1">{books.length}</p>
              </div>

              <div className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20">
                <p className="text-sm text-white/70">Results</p>
                <p className="text-3xl font-black mt-1">{filteredBooks.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[28px] border border-slate-200 px-5 py-4 shadow-sm">
          <div className="flex flex-col xl:flex-row gap-4">
            <input
              type="text"
              placeholder="Search using title, author, or ISBN"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-[#f7f8fc] border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#f7f8fc] border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none min-w-[210px] focus:ring-2 focus:ring-[#ef7f73]/40 transition"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="bg-[#ef7f73] text-white rounded-2xl px-8 py-4 text-sm font-bold hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition"
            >
              Search
            </button>
          </div>
        </section>

        {message && (
          <div className="bg-blue-50 text-blue-700 border border-blue-100 px-5 py-4 rounded-2xl">
            {message}
          </div>
        )}

        <section className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#07112b]">Available Books</h2>
              <p className="text-slate-500 mt-1">{filteredBooks.length} books found</p>
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl font-bold text-slate-700">No books found</p>
              <p className="text-slate-500 mt-2">Try another search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
              {filteredBooks.map((book, index) => (
                <div
                  key={book._id}
                  onClick={() => navigate(`/book/${book._id}`)}
                  className="group relative h-full min-h-[620px] flex flex-col bg-gradient-to-br from-white to-[#f8fafc] border border-slate-200 rounded-[28px] p-5 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#ef7f73]/10 rounded-bl-[60px] opacity-0 group-hover:opacity-100 transition" />

                  <div className="rounded-[24px] bg-gradient-to-br from-[#f8fafc] to-white p-4 group-hover:bg-[#fff7f4] transition">
                    <BookCover
                      book={book}
                      index={index}
                      className="w-full h-64 rounded-[20px] object-contain bg-white p-3 group-hover:scale-[1.03] transition duration-300"
                      innerClassName="w-28 h-40"
                    />
                  </div>

                  <div className="mt-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-black text-[#07112b] line-clamp-2 group-hover:text-[#ef7f73] transition min-h-[56px]">
                      {book.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1 min-h-[22px]">
                      {book.author}
                    </p>

                    <div className="mt-4 flex items-start justify-between gap-3 min-h-[48px]">
                      <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium line-clamp-2">
                        {book.category}
                      </span>

                      <span className="text-xs text-slate-500 whitespace-nowrap mt-1">
                        Avail: {book.availableCopies}
                      </span>
                    </div>

                    <div className="mt-4 min-h-[50px]">
                      <p className="text-amber-500 text-sm tracking-wide">
                        {renderStars(book.rating)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {book.rating.toFixed(1)} / 5
                      </p>
                    </div>

                    <div className="mt-auto pt-5">
                      {userInfo?.role === "user" && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(book);
                                setMessage(`${book.title} added to cart`);
                              }}
                              className="bg-slate-100 hover:bg-[#07112b] hover:text-white text-slate-700 rounded-xl py-2.5 text-sm font-semibold transition"
                            >
                              Add Cart
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const alreadyFav = isFavourite(book._id);
                                toggleFavourite(book);
                                setMessage(
                                  alreadyFav
                                    ? `${book.title} removed from favourites`
                                    : `${book.title} added to favourites`
                                );
                              }}
                              className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                                isFavourite(book._id)
                                  ? "bg-rose-100 text-rose-600"
                                  : "bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-700"
                              }`}
                            >
                              {isFavourite(book._id) ? "Saved" : "Favourite"}
                            </button>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIssueBook(book._id, book.title);
                            }}
                            disabled={book.availableCopies < 1}
                            className={`mt-3 w-full py-3 rounded-2xl font-bold transition ${
                              book.availableCopies < 1
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                : "bg-[#ef7f73] text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                            }`}
                          >
                            {book.availableCopies < 1 ? "Not Available" : "Borrow Now"}
                          </button>
                        </>
                      )}

                      {userInfo?.role === "admin" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/book/${book._id}`);
                          }}
                          className="w-full py-3 rounded-2xl font-bold bg-[#07112b] text-white hover:bg-[#ef7f73] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition"
                        >
                          Manage Book
                        </button>
                      )}
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

export default Books;