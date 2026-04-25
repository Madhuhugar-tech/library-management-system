import Layout from "../components/Layout";
import { useLibrary } from "../context/LibraryContext";
import BookCover from "../components/BookCover";

const Favourites = () => {
  const { favourites, toggleFavourite, addToCart } = useLibrary();

  return (
    <Layout>
      <div className="space-y-7">
        <section className="rounded-[32px] bg-gradient-to-r from-[#07112b] via-[#16213f] to-[#ef7f73] p-8 text-white shadow-lg">
          <p className="text-white/70 text-sm">Saved Collection</p>
          <h1 className="text-4xl font-black mt-2">Favourites</h1>
          <p className="text-white/75 mt-2 max-w-2xl">
            Keep your favourite books ready for later reading and borrowing.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Saved Books</p>
            <p className="text-4xl font-black mt-2 text-[#07112b]">
              {favourites.length}
            </p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Ready to Borrow</p>
            <p className="text-4xl font-black mt-2 text-[#07112b]">
              {favourites.filter((b) => (b.availableCopies || 0) > 0).length}
            </p>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Categories</p>
            <p className="text-4xl font-black mt-2 text-[#07112b]">
              {[...new Set(favourites.map((b) => b.category).filter(Boolean))].length}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-[30px] border border-slate-200 p-6 shadow-sm">
          {favourites.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#fff1ef] text-[#ef7f73] flex items-center justify-center mx-auto text-3xl">
                ★
              </div>
              <p className="text-xl font-black text-[#07112b] mt-5">
                No favourite books yet
              </p>
              <p className="text-slate-500 mt-2">
                Save books from Explore to see them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {favourites.map((book, index) => (
                <div
                  key={book._id}
                  className="group bg-gradient-to-br from-white to-[#f8fafc] border border-slate-200 rounded-[28px] p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="rounded-[24px] bg-gradient-to-br from-[#f8fafc] to-white p-4">
                    <BookCover
                      book={book}
                      index={index}
                      className="w-full h-60 rounded-[20px] object-contain bg-white p-3 group-hover:scale-[1.03] transition duration-300"
                      innerClassName="w-28 h-40"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[#07112b] line-clamp-2 group-hover:text-[#ef7f73] transition">
                    {book.title}
                  </h3>

                  <p className="text-slate-500 mt-1">{book.author}</p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                      {book.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      Avail: {book.availableCopies ?? "-"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => addToCart(book)}
                      className="bg-slate-100 hover:bg-[#07112b] hover:text-white text-slate-700 rounded-xl py-3 text-sm font-bold transition"
                    >
                      Add Cart
                    </button>

                    <button
                      onClick={() => toggleFavourite(book)}
                      className="bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl py-3 text-sm font-bold transition"
                    >
                      Remove
                    </button>
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

export default Favourites;