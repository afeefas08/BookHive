import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";

export default function ProductPage() {
  const { slug } = useParams();
  const [count, setCount] = useState(1);
  const [isWished, setIsWished] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWished(stored.includes(slug));
  }, [slug]);

  const toggleWishlist = () => {
    const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");

    let updated;
    if (stored.includes(slug)) {
      updated = stored.filter((item) => item !== slug);
      setIsWished(false);
    } else {
      updated = [...stored, slug];
      setIsWished(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(updated)); // will change in upcoming.
  };

  const { data: allBooks = [] } = useQuery({
  queryKey: ["books"],
  queryFn: async () => {
    const res = await api.get("/books/");
    return res.data;
  },
});

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", slug],
    queryFn: async () => {
      const res = await api.get(`/books/${slug}/`);
      return res.data;
    },
  });

  if (isLoading) return <p className="p-10 text-gray-500">Loading...</p>;

  const price = Number(book.price);
  const discount = Number(book.discount_percent || 0);

  const finalPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  const similarProducts = allBooks.filter(
    (b) =>
      b.category === book.category &&
      b.slug !== book.slug
  );


  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="relative bg-white p-6 rounded-2xl shadow-sm flex justify-center">

          {/* ❤️ HEART */}
          <button
            onClick={toggleWishlist}
            className="absolute top-4 right-4 z-10"
          >
            <svg
              className={`w-6 h-6 transition-colors duration-200 text-red-500 ${
                isWished
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 fill-none"
              }`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <img
            src={book.image}
            alt={book.title}
            className="h-[400px] object-contain"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500 uppercase">{book.category}</p>

          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

          <p className="text-gray-600">by {book.author}</p>

          <div className="text-yellow-400">
            ⭐⭐⭐⭐☆{" "}
            <span className="text-gray-500 text-sm">(120 reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">
              ₹{finalPrice.toFixed(2)}
            </h2>

            {discount > 0 && (
              <>
                <span className="line-through text-gray-400">
                  ₹{price.toFixed(2)}
                </span>
                <span className="text-green-600 text-sm font-medium">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            This is a premium book available in BookHive.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCount((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>

            <span>{count}</span>

            <button
              onClick={() => setCount((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          <button className="w-full bg-black text-white py-3 rounded-xl">
            Add to Cart
          </button>
        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
  {similarProducts.length > 0 && (
  <div className="max-w-6xl mx-auto px-4 pb-12 mt-8">
    
    <h2 className="text-xl font-bold text-gray-900 mb-6">
      Similar Books
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {similarProducts.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`/product/${item.slug}`)}
          className="cursor-pointer"
        >
          <BookCard book={item} />
        </div>
      ))}

    </div>
  </div>
)}

    </div>
  );
}