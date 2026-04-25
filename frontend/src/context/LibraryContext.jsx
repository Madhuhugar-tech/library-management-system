import { createContext, useContext, useState } from "react";

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [favourites, setFavourites] = useState([]);

  const addToCart = (book) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === book._id);
      if (exists) return prev;
      return [...prev, book];
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== bookId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleFavourite = (book) => {
    setFavourites((prev) => {
      const exists = prev.find((item) => item._id === book._id);
      if (exists) {
        return prev.filter((item) => item._id !== book._id);
      }
      return [...prev, book];
    });
  };

  const isFavourite = (bookId) => {
    return favourites.some((item) => item._id === bookId);
  };

  return (
    <LibraryContext.Provider
      value={{
        cartItems,
        favourites,
        addToCart,
        removeFromCart,
        clearCart,
        toggleFavourite,
        isFavourite,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);