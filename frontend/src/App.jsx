import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import MyBorrows from "./pages/MyBorrows";
import Cart from "./pages/Cart";
import Notifications from "./pages/Notifications";
import Favourites from "./pages/Favourites";
import AddBook from "./pages/AddBook";
import AllBorrows from "./pages/AllBorrows";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-borrows"
          element={
            <ProtectedRoute>
              <MyBorrows />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-book"
          element={
            <ProtectedRoute adminOnly={true}>
              <AddBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-borrows"
          element={
            <ProtectedRoute adminOnly={true}>
              <AllBorrows />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;