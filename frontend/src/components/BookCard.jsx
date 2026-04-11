export default function BookCard({ book, isWished, onToggleWishlist, onClick }) {

  const price = Number(book.price);
  const discount = Number(book.discount_percent || 0);

  const finalPrice =
    discount > 0
      ? price - (price * discount) / 100
      : price;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
    >

      {/* IMAGE */}
      <div className="relative flex justify-center">

        {/* DISCOUNT */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevents navigation)
            onToggleWishlist(book.id);
          }}
          className="absolute top-2 right-2 z-10"
        >
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${
              isWished ? "text-red-500 fill-red-500" : "text-gray-400 fill-none"
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
          className="w-40 h-48 object-contain rounded-xl transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* CONTENT */}
      <div className="space-y-1">

        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {book.category}
        </p>

        <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {book.title}
        </h2>

        <div className="flex items-center gap-1 text-yellow-400 text-sm">
          ⭐⭐⭐⭐☆
          <span className="text-gray-400 text-xs">
            ({book.rating || 4.5})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">

          <span className="font-bold text-lg text-gray-900">
            ₹{finalPrice.toFixed(2)}
          </span>

          {discount > 0 && (
            <span className="text-gray-400 text-sm line-through">
              ₹{price.toFixed(2)}
            </span>
          )}

        </div>

        <button className="w-full mt-3 bg-stone-950 text-white py-2 rounded-xl text-sm hover:bg-black transition">
          Add to Cart
        </button>

      </div>
    </div>
  );
}