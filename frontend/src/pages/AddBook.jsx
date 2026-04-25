import { useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    totalCopies: "",
    description: "",
    coverImage: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const categories = [
    "Programming",
    "Data Structures & Algorithms",
    "Database Systems",
    "Artificial Intelligence",
    "Computer Science",
    "Web Development",
    "Cyber Security",
    "Self Development",
    "Psychology",
    "Business & Finance",
    "History",
    "Fiction",
    "Literature",
    "Children",
    "Competitive Exams",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      await API.post("/books", {
        ...formData,
        totalCopies: Number(formData.totalCopies),
      });

      setMessage("Book added successfully");
      setFormData({
        title: "",
        author: "",
        category: "",
        isbn: "",
        totalCopies: "",
        description: "",
        coverImage: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add book");
      setIsError(true);
    }
  };

  return (
    <Layout>
      <div className="space-y-7">
        <section className="rounded-[32px] bg-gradient-to-r from-[#07112b] via-[#16213f] to-[#ef7f73] p-8 text-white shadow-lg">
          <p className="text-white/70 text-sm">Admin Collection Tool</p>
          <h1 className="text-4xl font-black mt-2">Add New Book</h1>
          <p className="text-white/75 mt-2 max-w-2xl">
            Create a clean library record with title, author, stock, description, and cover image.
          </p>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm">
            {message && (
              <div
                className={`mb-5 px-5 py-4 rounded-2xl border font-medium ${
                  isError
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-green-50 text-green-600 border-green-100"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                name="title"
                placeholder="Book title"
                value={formData.title}
                onChange={handleChange}
                className="bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
              />

              <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={handleChange}
                className="bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="isbn"
                placeholder="ISBN"
                value={formData.isbn}
                onChange={handleChange}
                className="bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
              />

              <input
                type="number"
                name="totalCopies"
                placeholder="Total copies"
                value={formData.totalCopies}
                onChange={handleChange}
                className="bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
              />

              <input
                type="text"
                name="coverImage"
                placeholder="Cover image URL"
                value={formData.coverImage}
                onChange={handleChange}
                className="bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
              />

              <textarea
                name="description"
                placeholder="Description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                className="md:col-span-2 bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none resize-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
              />

              <button className="md:col-span-2 w-fit bg-[#ef7f73] text-white px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition">
                Add Book
              </button>
            </form>
          </div>

          <div className="xl:col-span-4 bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#07112b]">Quick Tips</h2>
            <div className="mt-5 space-y-4">
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4">
                <p className="font-bold text-[#07112b]">Cover image</p>
                <p className="text-sm text-slate-500 mt-1">
                  Add a direct image URL for best cover quality.
                </p>
              </div>
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4">
                <p className="font-bold text-[#07112b]">ISBN</p>
                <p className="text-sm text-slate-500 mt-1">
                  Keep ISBN unique to avoid duplicate book errors.
                </p>
              </div>
              <div className="bg-[#fff1ef] border border-[#ffd7d2] rounded-2xl p-4">
                <p className="font-bold text-[#ef7f73]">Admin only</p>
                <p className="text-sm text-slate-600 mt-1">
                  This page is for managing the library collection.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AddBook;