import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import BookCard from "../components/BookCard";
import { ChevronDown, Sliders } from "lucide-react";

export default function Collection() {
  const navigate = useNavigate();
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    author: true,
    price: true,
  });

  // Get filter values from URL
  const urlCategories = searchParams.get("categories")?.split(",") || [];
  const urlAuthors = searchParams.get("authors")?.split(",") || [];
  const urlMinPrice = Number(searchParams.get("min_price")) || 0;
  const urlMaxPrice = Number(searchParams.get("max_price")) || 10000;
  const urlSort = searchParams.get("sort") || "default";
  const urlSearch = searchParams.get("search") || "";

  // Local state for price range (for slider UI)
  const [priceRange, setPriceRange] = useState({ 
    min: urlMinPrice, 
    max: urlMaxPrice 
  });

  // Fetch books with all URL params
  const {
    data: booksData = { results: [], max_price: 10000 },
    isLoading: booksLoading,
    error: booksError,
  } = useQuery({
    queryKey: ["books", urlCategories, urlAuthors, urlMinPrice, urlMaxPrice, urlSort, urlSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (urlCategories.length) params.append("categories", urlCategories.join(","));
      if (urlAuthors.length) params.append("authors", urlAuthors.join(","));
      if (urlMinPrice > 0) params.append("min_price", urlMinPrice);
      if (urlMaxPrice < 10000) params.append("max_price", urlMaxPrice);
      if (urlSort !== "default") params.append("sort", urlSort);
      if (urlSearch) params.append("search", urlSearch);
      
      const res = await api.get(`/books/?${params.toString()}`);
      return res.data || { results: [], max_price: 10000 };
    },
    keepPreviousData: true,
  });

  const books = booksData.results || [];
  const maxPriceFromBackend = booksData.max_price || 10000;

  // Fetch categories
  const { data: categoriesData = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/books/category/");
      return res.data || [];
    },
    keepPreviousData: true,
  });

  // Fetch authors
  const { data: authorsData = [], isLoading: authorsLoading } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const res = await api.get("/books/authors/");
      return res.data || [];
    },
    keepPreviousData: true,
  });

  // Extract category names with slugs
  const categories = useMemo(() => {
    if (!categoriesData.length) return [];
    if (typeof categoriesData[0] === 'string') {
      return categoriesData.map(cat => ({ 
        name: cat, 
        slug: cat.toLowerCase().replace(/\s+/g, '-') 
      }));
    }
    return categoriesData
      .map(item => ({
        name: item.name || item.category || item.category_name || item.title,
        slug: item.slug || (item.name || item.category || "").toLowerCase().replace(/\s+/g, '-')
      }))
      .filter(item => item.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesData]);

  // Extract author names
  const authors = useMemo(() => {
    if (!authorsData.length) return [];
    if (typeof authorsData[0] === 'string') return authorsData;
    return authorsData
      .map(item => item.name || item.author || item.author_name || item.full_name)
      .filter(Boolean)
      .sort();
  }, [authorsData]);

  // Initialize price range when max price loads from backend
  useEffect(() => {
    if (maxPriceFromBackend) {
      setPriceRange({ 
        min: urlMinPrice || 0, 
        max: urlMaxPrice < 10000 ? urlMaxPrice : maxPriceFromBackend 
      });
    }
  }, [maxPriceFromBackend]);

  // Update URL when filters change
  const updateUrlParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : value > 0)) {
        newParams.set(key, Array.isArray(value) ? value.join(",") : value);
      } else {
        newParams.delete(key);
      }
    });
    
    setSearchParams(newParams);
  };

  // Toggle category filter
  const toggleCategory = (catSlug) => {
    const newCategories = urlCategories.includes(catSlug)
      ? urlCategories.filter(c => c !== catSlug)
      : [...urlCategories, catSlug];
    updateUrlParams({ categories: newCategories });
  };

  // Toggle author filter
  const toggleAuthor = (author) => {
    const newAuthors = urlAuthors.includes(author)
      ? urlAuthors.filter(a => a !== author)
      : [...urlAuthors, author];
    updateUrlParams({ authors: newAuthors });
  };

  // Handle price range change (debounced for performance)
  const handlePriceChange = (type, value) => {
    const numValue = Number(value);
    const newRange = { ...priceRange, [type]: numValue };
    
    // Ensure min doesn't exceed max and max doesn't go below min
    if (type === 'min' && numValue > priceRange.max) {
      newRange.max = numValue;
    }
    if (type === 'max' && numValue < priceRange.min) {
      newRange.min = numValue;
    }
    
    setPriceRange(newRange);
    
    // Debounce URL update
    if (window.priceTimeout) clearTimeout(window.priceTimeout);
    window.priceTimeout = setTimeout(() => {
      updateUrlParams({ 
        min_price: newRange.min > 0 ? newRange.min : null,
        max_price: newRange.max < maxPriceFromBackend ? newRange.max : null
      });
    }, 500);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    updateUrlParams({ sort: newSort !== "default" ? newSort : null });
  };

  // Clear all filters
  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (urlSearch) newParams.set("search", urlSearch);
    setSearchParams(newParams);
    setPriceRange({ min: 0, max: maxPriceFromBackend });
  };

  const activeFilterCount =
    urlCategories.length +
    urlAuthors.length +
    (urlMinPrice > 0 || urlMaxPrice < maxPriceFromBackend ? 1 : 0);

  const toggleFilterGroup = (group) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const toggleWishlist = (bookId) => {
    setWishlist((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const isLoading = booksLoading || categoriesLoading || authorsLoading;

  // Format price display
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">All Books</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-500">{books.length} books</p>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <div className="relative inline-block w-full sm:w-48">
                <select
                  value={urlSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 cursor-pointer focus:outline-none focus:border-gray-400 hover:border-gray-300"
                >
                  <option value="default">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title-asc">Title: A to Z</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Sliders size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-gray-900 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Minimal Design */}
          <aside
            className={`${
              mobileFiltersOpen ? "block" : "hidden"
            } lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">FILTERS</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter - Checkboxes */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterGroup("category")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="text-sm font-medium text-gray-900">CATEGORY</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      expandedFilters.category ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFilters.category && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categoriesLoading ? (
                      <p className="text-xs text-gray-400">Loading...</p>
                    ) : (
                      categories.map((cat) => (
                        <label key={cat.slug} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={urlCategories.includes(cat.slug)}
                            onChange={() => toggleCategory(cat.slug)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 cursor-pointer"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-gray-900">
                            {cat.name}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Author Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterGroup("author")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="text-sm font-medium text-gray-900">AUTHOR</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      expandedFilters.author ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFilters.author && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {authorsLoading ? (
                      <p className="text-xs text-gray-400">Loading...</p>
                    ) : (
                      authors.slice(0, 15).map((author) => (
                        <label key={author} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={urlAuthors.includes(author)}
                            onChange={() => toggleAuthor(author)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 cursor-pointer"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-gray-900">
                            {author}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Price Range - Slider Only */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterGroup("price")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="text-sm font-medium text-gray-900">PRICE</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      expandedFilters.price ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFilters.price && (
                  <div className="space-y-3">
                    {/* Price display */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 font-medium">
                        {formatPrice(priceRange.min)}
                      </span>
                      <span className="text-xs text-gray-400">—</span>
                      <span className="text-sm text-gray-900 font-medium">
                        {formatPrice(priceRange.max)}
                      </span>
                    </div>

                    {/* Slider */}
                    <div className="px-1">
                      <div className="relative h-6 flex items-center">
                        {/* Track background */}
                        <div className="absolute w-full h-1 bg-gray-200 rounded-full" />
                        
                        {/* Selected range */}
                        <div
                          className="absolute h-1 bg-gray-900 rounded-full"
                          style={{
                            left: `${(priceRange.min / maxPriceFromBackend) * 100}%`,
                            right: `${100 - (priceRange.max / maxPriceFromBackend) * 100}%`
                          }}
                        />
                        
                        {/* Min slider input */}
                        <input
                          type="range"
                          min="0"
                          max={maxPriceFromBackend}
                          value={priceRange.min}
                          onChange={(e) => handlePriceChange('min', e.target.value)}
                          className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-900 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                        />
                        
                        {/* Max slider input */}
                        <input
                          type="range"
                          min="0"
                          max={maxPriceFromBackend}
                          value={priceRange.max}
                          onChange={(e) => handlePriceChange('max', e.target.value)}
                          className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-1045;border-gray-900 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                        />
                      </div>
                      
                      {/* Price range labels */}
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">{formatPrice(0)}</span>
                        <span className="text-xs text-gray-500">{formatPrice(maxPriceFromBackend)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-gray-400 text-sm">Loading books...</p>
              </div>
            ) : booksError ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-red-500 text-sm">Error loading books.</p>
              </div>
            ) : books.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">No books match your filters</p>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-900 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isWished={wishlist.includes(book.id)}
                    onToggleWishlist={toggleWishlist}
                    onClick={() => navigate(`/product/${book.slug}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}