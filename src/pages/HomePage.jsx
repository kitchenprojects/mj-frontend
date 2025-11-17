import React from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiFeather, FiStar } from 'react-icons/fi';

export default function HomePage() {
  return (
    <div className="py-8">
      {/* Hero Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Text Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Delicious Homemade Meals
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Freshly prepared, just for you. Delivered right to your doorstep.
            </p>
            <div className="flex gap-4">
              <Link
                to="/menu"
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition"
              >
                View Full Menu
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-md border border-emerald-600 hover:bg-emerald-50 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
          
          {/* Image Content */}
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80" 
              alt="Delicious food" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <FiFeather size={40} className="text-emerald-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fresh Ingredients</h3>
            <p className="text-gray-500">
              We source only the best local and seasonal ingredients for our dishes.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <FiTruck size={40} className="text-emerald-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
            <p className="text-gray-500">
              Hot and fresh meals delivered to you, fast and reliable.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <FiStar size={40} className="text-emerald-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Service</h3>
            <p className="text-gray-500">
              Our team is dedicated to providing you with a 5-star experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}