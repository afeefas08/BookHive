import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import api from "../services/api";
import BookCard from "../components/BookCard";
import { useParams, useNavigate } from "react-router-dom";

const categories = ["All", "Self Help", "Finance", "Mystery", "RomCom", "Fiction"];

export default function Collection() {
  const navigate = useNavigate();
  const { category } = useParams();

  const [filters, setFilters] = useState({
    search: "",
    sort: "default",
  });

  const [wishlist, setWishlist] = useState([]);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await api.get(`/books/`);
      return res.data;
    },
  });

  // ❤️ Wishlist toggle
  const toggleWishlist = (bookId) => {
    setWishlist((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  // 🔥 FILTER LOGIC (URL CATEGORY + SEARCH)
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchCategory =
        !category ||
        category === "all" ||
        book.category.toLowerCase() === category.toLowerCase();

      const matchSearch =
        book.title.toLowerCase().includes(filters.search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [books, filters.search, category]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          {/* LEFT TEXT */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Browse Books
            </h1>
            <p className="text-sm text-gray-500">
              Find your next favorite book
            </p>
          </div>

          {/* RIGHT SEARCH */}
          <div className="w-full md:w-[320px]">
            <input
              type="text"
              placeholder="Search books..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

        </div>

        {/* CATEGORY BUBBLES (URL CONTROLLED) */}
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((cat) => {
            const catSlug = cat.toLowerCase().replace(/\s+/g, "-");

            const isActive =
              (category === undefined && cat === "All") ||
              category === catSlug;

            return (
              <button
                key={cat}
                onClick={() =>
                  navigate(cat === "All" ? "/collections" : `/collections/${catSlug}`)
                }
                className={`px-4 py-2 rounded-full text-sm border transition
                  ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-300 hover:border-black"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* GRID */}
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isWished={wishlist.includes(book.id)}
                onToggleWishlist={toggleWishlist}
                onClick={()=> navigate(`/product/${book.slug}`)}
              />
            ))}

          </div>
        )}

      </div>
    </div>
  );
}