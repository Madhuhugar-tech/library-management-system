import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import BookCover from "../components/BookCover";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { addToCart, toggleFavourite, isFavourite } = useLibrary();

  const [book, setBook] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    totalCopies: "",
    description: "",
    coverImage: "",
  });

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/books/${id}`);
      setBook(data);
      setFormData({
        title: data.title || "",
        author: data.author || "",
        category: data.category || "",
        isbn: data.isbn || "",
        totalCopies: data.totalCopies || "",
        description: data.description || "",
        coverImage: data.coverImage || "",
      });
    } catch (err) {
      console.log(err);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    const dueDate = prompt("Enter due date in YYYY-MM-DD format");
    if (!dueDate) return;

    try {
      await API.post("/borrow/issue", {
        bookId: book._id,
        dueDate,
      });
      setMessage("Book borrowed successfully");
      fetchBook();
    } catch (err) {
      setMessage(err.response?.data?.message || "Borrow failed");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(`Delete "${book.title}"?`);
    if (!ok) return;

    try {
      await API.delete(`/books/${book._id}`);
      navigate("/books");
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.put(`/books/${book._id}`, {
        ...formData,
        totalCopies: Number(formData.totalCopies),
      });

      setMessage(data.message || "Book updated successfully");
      setIsEditing(false);
      fetchBook();
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <p className="text-slate-500">Loading book details...</p>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">Book not found</h1>
          <p className="text-slate-500 mt-2">This book could not be loaded.</p>
          <button
            onClick={() => navigate("/books")}
            className="mt-4 bg-[#ef8a7f] text-white px-5 py-3 rounded-2xl font-semibold"
          >
            Back to Books
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {message && (
          <div className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-3 rounded-2xl">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-4">
            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <div className="bg-[#f8fafc] rounded-[20px] p-6 flex items-center justify-center min-h-[420px]">
                <div className="w-full max-w-[260px]">
                  <BookCover
                    book={book}
                    index={2}
                    className="w-full h-[360px] rounded-[18px] object-contain bg-white p-3"
                    innerClassName="w-44 h-64"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              {!isEditing ? (
                <>
                  <span className="inline-block text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    {book.category}
                  </span>

                  <h1 className="text-3xl font-bold text-slate-800 mt-4">{book.title}</h1>
                  <p className="text-slate-500 mt-2 text-lg">{book.author}</p>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#f7f8fc] rounded-2xl p-4">
                      <p className="text-xs text-slate-500">ISBN</p>
                      <p className="font-semibold text-slate-800 mt-2">{book.isbn}</p>
                    </div>

                    <div className="bg-[#f7f8fc] rounded-2xl p-4">
                      <p className="text-xs text-slate-500">Total Copies</p>
                      <p className="font-semibold text-slate-800 mt-2">{book.totalCopies}</p>
                    </div>

                    <div className="bg-[#f7f8fc] rounded-2xl p-4">
                      <p className="text-xs text-slate-500">Available Copies</p>
                      <p className="font-semibold text-slate-800 mt-2">{book.availableCopies}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {userInfo?.role === "user" && (
                      <>
                        <button
                          onClick={() => {
                            addToCart(book);
                            setMessage(`${book.title} added to cart`);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-medium transition"
                        >
                          Add to Cart
                        </button>

                        <button
                          onClick={() => {
                            const alreadyFav = isFavourite(book._id);
                            toggleFavourite(book);
                            setMessage(
                              alreadyFav
                                ? `${book.title} removed from favourites`
                                : `${book.title} added to favourites`
                            );
                          }}
                          className={`px-5 py-3 rounded-2xl font-medium transition ${
                            isFavourite(book._id)
                              ? "bg-rose-100 text-rose-600"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          {isFavourite(book._id) ? "Saved" : "Favourite"}
                        </button>

                        <button
                          onClick={handleBorrow}
                          disabled={book.availableCopies < 1}
                          className={`px-5 py-3 rounded-2xl font-semibold transition ${
                            book.availableCopies < 1
                              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                              : "bg-[#07112b] text-white hover:bg-slate-900"
                          }`}
                        >
                          {book.availableCopies < 1 ? "Not Available" : "Borrow Now"}
                        </button>
                      </>
                    )}

                    {userInfo?.role === "admin" && (
                      <>
                        <button
                          onClick={handleEditToggle}
                          className="px-5 py-3 rounded-2xl font-semibold bg-[#07112b] text-white hover:bg-slate-900 transition"
                        >
                          Edit Book
                        </button>

                        <button
                          onClick={handleDelete}
                          className="px-5 py-3 rounded-2xl font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          Delete Book
                        </button>

                        <button
                          onClick={() => navigate("/books")}
                          className="px-5 py-3 rounded-2xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                        >
                          Back to Books
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-800">Edit Book</h2>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 outline-none"
                  />

                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 outline-none"
                  />

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 outline-none"
                  />

                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    placeholder="ISBN"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 outline-none"
                  />

                  <input
                    type="number"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    placeholder="Total Copies"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 outline-none"
                  />

                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="Cover Image URL"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 outline-none"
                  />

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows="5"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 outline-none"
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl font-semibold bg-[#07112b] text-white hover:bg-slate-900 transition"
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="px-5 py-3 rounded-2xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800">Description</h2>
              <p className="text-slate-600 mt-4 leading-7">
                {book.description || "No description available for this book."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;