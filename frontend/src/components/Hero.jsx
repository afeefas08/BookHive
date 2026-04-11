import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, ChevronRight, BookOpen, Sparkles, Shield, Truck } from 'lucide-react';
import Navbar from './Navbar'
import book_img from '../assets/book-img-1.png'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfbf7] to-white overflow-hidden">

      {/* Main hero section */}
      <main className="relative pt-5 pb-20 px-6 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className={`space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

              {/* Main heading */}
              <h1 className="text-6xl md:text-7xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
                Stories that
                <span className="block bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  transform minds
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Curated collection of world-class books delivered to your doorstep. Join thousands of readers who found their next favorite book.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-800 transition-all hover:scale-105 shadow-lg">
                  <span>Discover Books</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all backdrop-blur-sm">
                  Browse Categories
                </button>
              </div>

            </div>

            {/* Right content - Book showcase */}
            <img
                src={book_img}
                alt="Featured book"
                className="w-full max-w-md rounded-2xl transform hover:scale-105 transition-transform duration-500"
                    />
          </div>

        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero;