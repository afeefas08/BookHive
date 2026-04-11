import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [state, setState] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartItemCount] = useState(0);

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const navigation = [
    { title: "Books", path: "/collections" },
    { title: "Categories", path: "/collections", hasDropdown: true },
    { title: "Deals", path: "/collections" },
  ];

  const categories = [
    {
      section: "Genre",
      items: [
        { title: "Fiction", path: "/collections/Fiction" },
        { title: "Non-Fiction", path: "/collections/Non-Fiction" },
        { title: "Science Fiction", path: "/collections/Science Fiction" },
        { title: "Fantasy", path: "/collections/Fantasy" },
      ],
    },
    {
      section: "Special Categories",
      items: [
        { title: "Mystery & Thriller", path: "/collections/Mystery" },
        { title: "Biography & Memoir", path: "/collections/Biography" },
        { title: "Self Help", path: "/collections/Self Help" },
      ],
    },
  ];

  const handleLogout = () => dispatch(logout());

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".menu-btn")) setState(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex items-center justify-between h-16">

          {/* LOGO FIXED → HOME */}
          <Link to="/" className="flex items-center">
            <svg className="h-8 w-8 text-stone-900" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="ml-2 text-lg font-semibold text-stone-900">
              BookHive
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">

            {navigation.map((item, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() =>
                  item.hasDropdown && setDropdownOpen(true)
                }
                onMouseLeave={() =>
                  item.hasDropdown && setDropdownOpen(false)
                }
              >

                {/* NORMAL LINK */}
                {!item.hasDropdown ? (
                  <Link
                    to={item.path}
                    className="text-stone-700 hover:text-stone-900 font-medium"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span className="text-stone-700 hover:text-stone-900 font-medium cursor-pointer">
                    {item.title}
                  </span>
                )}

                {/* DROPDOWN FIXED (NO HOVER BREAK) */}
                {item.hasDropdown && dropdownOpen && (
                  <div
                    className="
                      absolute left-0 top-full mt-2 w-[520px]
                      bg-white/95 backdrop-blur-md
                      rounded-2xl shadow-2xl border border-gray-100
                      p-5 z-50
                    "
                  >
                    <div className="grid grid-cols-2 gap-8">

                      {categories.map((cat, i) => (
                        <div key={i}>
                          <h3 className="text-sm font-semibold text-stone-800 mb-3">
                            {cat.section}
                          </h3>

                          <div className="space-y-2">
                            {cat.items.map((item, j) => (
                              <Link
                                key={j}
                                to={item.path}
                                className="
                                  block px-3 py-2 rounded-lg
                                  text-sm text-stone-600
                                  hover:bg-stone-100 hover:text-black
                                  transition
                                "
                              >
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                )}

              </div>
            ))}

          </div>

          {/* RIGHT SIDE (ICONS NOT CHANGED) */}
          <div className="flex items-center space-x-5">

            {/* ❤️ HEART (UNCHANGED) */}
            <a href="/wishlist" className="text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </a>

            {/* 🛒 CART (UNCHANGED) */}
            <a href="/cart" className="text-stone-700 relative">
              <svg width="24px" height="24px" viewBox="0 0 24 24">
                <circle cx="16.5" cy="18.5" r="1.5"/>
                <circle cx="9.5" cy="18.5" r="1.5"/>
                <path d="M18 16H8a1 1 0 0 1-.958-.713L4.256 6H3a1 1 0 0 1 0-2h2a1 1 0 0 1 .958.713L6.344 6H21a1 1 0 0 1 .937 1.352l-3 8A1 1 0 0 1 18 16z"/>
              </svg>

              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-stone-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </a>

            {/* LOGIN */}
            {token ? (
              <span className="text-sm text-stone-700">
                {user?.username || "User"}
              </span>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 text-white bg-stone-900 rounded-full">
                  Login
                </button>
              </Link>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}