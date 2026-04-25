import { useState } from "react";

const BookCover = ({
  book,
  className = "w-full h-56 rounded-2xl object-contain bg-white p-2",
}) => {
  const [error, setError] = useState(false);

  let cover = book?.coverImage;

  if (!cover && book?.isbn) {
    cover = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
  }

  if (!cover || error) {
    return (
      <div className={className + " flex items-center justify-center bg-slate-100"}>
        <span className="text-2xl font-bold text-gray-500">
          {book?.title?.charAt(0) || "B"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={cover}
      alt={book.title}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default BookCover;