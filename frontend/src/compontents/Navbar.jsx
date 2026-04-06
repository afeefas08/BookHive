import React, { useEffect, useState } from 'react'

export default function Navbar() {
    const [state, setState] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [cartItemCount, setCartItemCount] = useState(0)

    const navigation = [
        { title: "Books", path: "javascript:void(0)" },
        { title: "Categories", path: "javascript:void(0)", hasDropdown: true },
        { title: "Sellers", path: "javascript:void(0)" },
        { title: "Deals", path: "javascript:void(0)" }
    ]

    const categories = [
        {
            section: "Genre",
            bold: true,
            color: "text-stone-800",
            items: [
                { title: "Fiction", path: "javascript:void(0)" },
                { title: "Non-Fiction", path: "javascript:void(0)" },
                { title: "Science Fiction", path: "javascript:void(0)" },
                { title: "Fantasy", path: "javascript:void(0)" }
            ]
        },
        {
            section: "Special Categories",
            bold: true,
            color: "text-stone-800",
            items: [
                { title: "Mystery & Thriller", path: "javascript:void(0)" },
                { title: "Biography & Memoir", path: "javascript:void(0)" },
                { title: "Children's Books", path: "javascript:void(0)" },
                { title: "Self help", path: "javascript:void(0)" }
            ]
        }
    ]

    useEffect(() => {
        const handleClick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) setState(false);
        };
        document.addEventListener('click', handleClick);
        
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [])

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center">
                            <svg className="h-8 w-8 text-stone-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="ml-2 text-stone-900 font-semibold text-lg">BookHive</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navigation.map((item, idx) => {
                            if (item.hasDropdown) {
                                return (
                                    <div 
                                        key={idx}
                                        className="relative"
                                        onMouseEnter={() => setDropdownOpen(true)}
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        <a 
                                            href={item.path} 
                                            className="text-stone-700 hover:text-stone-900 font-medium transition-colors duration-200"
                                        >
                                            {item.title}
                                        </a>
                                        
                                        {dropdownOpen && (
                                            <div className="absolute left-0 top-full mt-2 w-[520px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 py-5 z-50 animate-fadeIn">
                                                <div className="grid grid-cols-2 gap-8 px-6">
                                                    {categories.map((category, catIdx) => (
                                                        <div key={catIdx}>
                                                            <h3 className={`font-semibold ${category.color} text-sm uppercase tracking-wider mb-4`}>
                                                                {category.section}
                                                            </h3>
                                                            <ul className="space-y-2">
                                                                {category.items.map((item, itemIdx) => (
                                                                    <li key={itemIdx}>
                                                                        <a 
                                                                            href={item.path}
                                                                            className="text-stone-600 hover:text-stone-900 hover:bg-stone-50 block px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                                                                        >
                                                                            {item.title}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                            return (
                                <a 
                                    key={idx} 
                                    href={item.path} 
                                    className="text-stone-700 hover:text-stone-900 font-medium transition-colors duration-200"
                                >
                                    {item.title}
                                </a>
                            )
                        })}
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-5">
                        <a href="javascript:void(0)" className="text-red-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </a>
                        
                        <a href="javascript:void(0)" className="text-stone-700 relative">
                            <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16.5" cy="18.5" r="1.5"/>
                                <circle cx="9.5" cy="18.5" r="1.5"/>
                                <path d="M18 16H8a1 1 0 0 1-.958-.713L4.256 6H3a1 1 0 0 1 0-2h2a1 1 0 0 1 .958.713L6.344 6H21a1 1 0 0 1 .937 1.352l-3 8A1 1 0 0 1 18 16zm-9.256-2h8.563l2.25-6H6.944z"/>
                            </svg>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-stone-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </a>

                        <button
                            className="px-4 py-2 text-white bg-stone-900 rounded-full duration-150 hover:bg-stone-800 transition-colors"
                        >
                            Login
                        </button>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button 
                                className="menu-btn text-stone-700 hover:text-stone-900 p-2 rounded-lg transition-colors duration-200"
                                onClick={() => setState(!state)}
                            >
                                {state ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {state && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-slideDown">
                        <div className="space-y-3">
                            {navigation.map((item, idx) => (
                                <a 
                                    key={idx} 
                                    href={item.path} 
                                    className="block text-stone-700 hover:text-stone-900 font-medium py-2 transition-colors duration-200"
                                    onClick={() => setState(false)}
                                >
                                    {item.title}
                                </a>
                            ))}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="space-y-3">
                                    <a href="javascript:void(0)" className="block text-stone-700 hover:text-stone-900 py-2">Account</a>
                                    <a href="javascript:void(0)" className="block text-stone-700 hover:text-stone-900 py-2">Wishlist</a>
                                    <a href="javascript:void(0)" className="block text-stone-700 hover:text-stone-900 py-2">Cart</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </nav>
    )
}