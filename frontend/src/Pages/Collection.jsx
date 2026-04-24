import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useState } from 'react';
import api from "../services/api"
import BookCard from "../components/BookCard";
import { ChevronDown } from "lucide-react";
import PriceRangeSlider from "../components/PriceRangeSlider";

export default function Collection() {
  const { category } = useParams();
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    author: true,
    price: true,
  });

  const toggleFilterGroup = (group) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };
  const clearAllFilters = () => {
    navigate("/collections")
  };

  const authors = searchParams.get("authors")?.split(",") || [];
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";

  // Fetch Books
  const { data , isLoading, error } = useQuery({
    queryKey: ["books", { category, authors, minPrice,maxPrice }],
    queryFn: async () => {
      const params = new URLSearchParams();
    
      
      if (category)
        params.append("category", category)
      if (authors.length) 
        params.append("authors", authors.join(","));
      if (minPrice !== "")
        params.append("min_price", minPrice);
      if (maxPrice !== "") 
        params.append("max_price", maxPrice);
      
      const url = `/books/?${params.toString()}`;

      const response = await api.get(url);
      return response.data;
    },
    keepPreviousData: true
  })

  const books = data?.results || [];
  const totalCount = data?.count || 0;
  const maxPriceFromBackend = data?.max_price || 1000;

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/books/categories/");
      return res.data;
    }
  });

  // Fetch Authors
  const { data: authorsData = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const res = await api.get("/books/authors/");
      return res.data;
    }
  });

  if (error)
    return <p>Error loading books</p>

    // category
  const toggleCategory = (cat) => {
    const currentCategory = category // from useParams()

    if(currentCategory === cat) {
      navigate('/collections?' + searchParams.toString()) // uncheck
    }
    else{  // select category
      navigate(`/collections/${cat}?${searchParams.toString()}`);
    }
  };
  

  // Author
  const toggleAuthor = (author) => {
    const newParams = new URLSearchParams(searchParams)

    let updateAuthors

    if(authors.includes(author)){
      updateAuthors = authors.filter(a => a !== author) // remove
    }
    else{
      updateAuthors = [...authors, author] // add
    }

    if(updateAuthors.length > 0){
      newParams.set("authors", updateAuthors.join(","))
    }
    else{
      newParams.delete("authors")
    }
    setSearchParams(newParams);
  }

  const handlePriceChange = (min, max) => {
    const newParams = new URLSearchParams(searchParams);

    if (min) 
      newParams.set("min_price", min);
    else 
      newParams.delete("min_price");

    if (max) 
      newParams.set("max_price", max);
    else 
      newParams.delete("max_price");

    setSearchParams(newParams);
  };

  // ================Price Ranger=========================
  const [priceRange, setPriceRange] = useState({
      min: Number(minPrice) || 0,
      max: Number(maxPrice) || maxPriceFromBackend
    });

    const handleSliderChange = (type, value) => {
      let newMin = priceRange.min;
      let newMax = priceRange.max;

      if (type === "min") {
        newMin = Math.min(Number(value), priceRange.max - 50);
      } else {
        newMax = Math.max(Number(value), priceRange.min + 50);
      }

      setPriceRange({ min: newMin, max: newMax });

      // sync with URL
      handlePriceChange(newMin, newMax);
    };

  return (
  <div className="min-h-screen bg-gray-50 ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Book Collection
        </h1>
        <p className="text-sm text-gray-500">{books.length} books</p>
      </div>

      <div className="flex gap-8">

        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
        <div className="sticky top-24">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">FILTERS</h3>
            <button
              onClick={clearAllFilters}
              className="text-xs text-stone-800 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>

          {/* CATEGORY */}
          <div className="mb-6">
            <button
              onClick={() => toggleFilterGroup("category")}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="text-sm font-medium text-gray-900">CATEGORY</span>
              <ChevronDown
                size={16}
                className={`text-stone-900 transition-transform ${
                  expandedFilters.category ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedFilters.category && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category === cat.slug}
                      onChange={() => toggleCategory(cat.slug)}
                      className="w-4 h-4 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* AUTHOR */}
          <div className="mb-6">
            <button
              onClick={() => toggleFilterGroup("author")}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="text-sm font-medium text-gray-900">AUTHOR</span>
              <ChevronDown
                size={16}
                className={`text-stone-900 transition-transform ${
                  expandedFilters.author ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedFilters.author && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {authorsData.map((a) => (
                  <label key={a.author_slug} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={authors.includes(a.author_slug)}
                      onChange={() => toggleAuthor(a.author_slug)}
                      className="w-4 h-4 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      {a.author}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* PRICE */}
          <div className="mb-6">
            <button
              onClick={() => toggleFilterGroup("price")}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="text-sm font-medium text-gray-900">PRICE</span>
              <ChevronDown
                size={16}
                className={`text-stone-900 transition-transform ${
                  expandedFilters.price ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedFilters.price && (
              <div className="space-y-2">
              <PriceRangeSlider
  minLimit={0}
  maxLimit={1000}
  minValue={Number(minPrice) || 0}
  maxValue={Number(maxPrice) || 1000}
  onPriceChange={(min, max) => {
    const params = new URLSearchParams(searchParams);

    params.set("min_price", min);
    params.set("max_price", max);

    setSearchParams(params);
  }}
/>
              </div>
            )}
          </div>

        </div>
      </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1">

          {isLoading && books.length === 0 ? (
            <div className="flex justify-center py-16">
              <p className="text-gray-400">Loading...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="flex justify-center py-16">
              <p className="text-gray-500">No Books available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  </div>
);
}
