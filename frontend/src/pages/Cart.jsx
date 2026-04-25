import Layout from "../components/Layout";
import API from "../api/axios";
import { useLibrary } from "../context/LibraryContext";
import BookCover from "../components/BookCover";
import { useState } from "react";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useLibrary();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleCheckout = async () => {
    setMessage("");
    setIsError(false);

    if (cartItems.length === 0) return;

    try {
      for (const book of cartItems) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        await API.post("/borrow/issue", {
          bookId: book._id,
          dueDate: dueDate.toISOString().split("T")[0],
        });
      }

      clearCart();
      setMessage("Books borrowed successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Checkout failed");
      setIsError(true);
    }
  };

  const availableItems = cartItems.filter((book) => (book.availableCopies || 0) > 0);

  return (
    <Layout>
      <div className="space-y-7">
        <section className="rounded-[32px] bg-gradient-to-r from-[#07112b] via-[#16213f] to-[#ef7f73] p-8 text-white shadow-lg">
          <p className="text-white/70 text-sm">Borrow Basket</p>
          <h1 className="text-4xl font-black mt-2">My Cart</h1>
          <p className="text-white/75 mt-2 max-w-2xl">
            Review selected books and borrow them together with one checkout.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Cart Items</p>
            <p className="text-4xl font-black mt-2 text-[#07112b]">
              {cartItems.length}
            </p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Available</p>
            <p className="text-4xl font-black mt-2 text-[#07112b]">
              {availableItems.length}
            </p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Borrow Period</p>
            <p className="text-4xl font-black mt-2 text-[#07112b]">7d</p>
          </div>
        </section>

        {message && (
          <div
            className={`px-5 py-4 rounded-2xl border font-medium ${
              isError
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-green-50 text-green-600 border-green-100"
            }`}
          >
            {message}
          </div>
        )}

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm">
            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-[#fff1ef] text-[#ef7f73] flex items-center justify-center mx-auto text-3xl">
                  🛒
                </div>
                <p className="text-xl font-black text-[#07112b] mt-5">
                  Your cart is empty
                </p>
                <p className="text-slate-500 mt-2">
                  Add books from Explore to borrow them later.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {cartItems.map((book, index) => (
                  <div
                    key={book._id}
                    className="rounded-[26px] border border-slate-200 bg-gradient-to-r from-white to-[#fbfcfe] p-5 flex flex-col md:flex-row md:items-center gap-5 hover:shadow-md transition"
                  >
                    <div className="w-28 shrink-0">
                      <BookCover
                        book={book}
                        index={index}
                        className="w-full h-36 rounded-2xl object-contain bg-white p-2"
                        innerClassName="w-16 h-24"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-black text-[#07112b]">
                        {book.title}
                      </h3>
                      <p className="text-slate-500 mt-1">{book.author}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                          {book.category}
                        </span>

                        <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium">
                          Avail: {book.availableCopies ?? "-"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(book._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-5 py-3 rounded-2xl text-sm font-bold transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="xl:col-span-4 bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm h-fit">
            <h2 className="text-2xl font-black text-[#07112b]">Checkout Summary</h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between bg-[#f8fafc] rounded-2xl p-4">
                <span className="text-slate-500">Selected Books</span>
                <span className="font-black text-[#07112b]">{cartItems.length}</span>
              </div>

              <div className="flex items-center justify-between bg-[#f8fafc] rounded-2xl p-4">
                <span className="text-slate-500">Borrow Duration</span>
                <span className="font-black text-[#07112b]">7 Days</span>
              </div>

              <div className="flex items-center justify-between bg-[#f8fafc] rounded-2xl p-4">
                <span className="text-slate-500">Due Date</span>
                <span className="font-black text-[#07112b]">
                  {(() => {
                    const date = new Date();
                    date.setDate(date.getDate() + 7);
                    return date.toLocaleDateString();
                  })()}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className={`mt-6 w-full px-6 py-4 rounded-2xl font-black transition ${
                cartItems.length === 0
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-[#ef7f73] text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              }`}
            >
              Checkout Borrow
            </button>

            <button
              onClick={clearCart}
              disabled={cartItems.length === 0}
              className="mt-3 w-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 px-6 py-4 rounded-2xl font-black transition"
            >
              Clear Cart
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Cart;