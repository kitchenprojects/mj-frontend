import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiClock, FiShield, FiAward, FiSearch, FiArrowRight } from 'react-icons/fi';
import api from '../services/api';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [stats] = useState({
    orders: '1K++',
    customers: '500++',
    menus: '50+',
    years: '5+ yrs'
  });

  useEffect(() => {
    api.get('/menu/categories').then((r) => setCategories(r.data.slice(0, 6)));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2303BEB0' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            <span style={{ color: '#065D5F' }}>Last-Minute Order?</span><br />
            <span style={{ color: '#03BEB0' }}>Worry-Free!</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to deliver thousands of portions on short notice. Available 24/7 whenever you need!
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative bg-white rounded-2xl shadow-lg p-2">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search for your favorite menu..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 focus:bg-white focus:outline-none transition-all"
                    style={{ '--tw-ring-color': '#03BEB0' }}
                  />
                </div>
                <Link
                  to="/menu"
                  className="px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-colors whitespace-nowrap"
                  style={{ backgroundColor: '#03BEB0' }}
                >
                  Search Menu
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ backgroundColor: '#03BEB0' }}
            >
              View Full Menu <FiArrowRight />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white font-bold rounded-2xl border-2 hover:bg-gray-50 transition-all"
              style={{ borderColor: '#03BEB0', color: '#03BEB0' }}
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8" style={{ backgroundColor: '#EBF2F2' }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wider">
            Quality and Hygiene are Our Foremost Standards
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            <div className="flex items-center gap-2" style={{ color: '#065D5F' }}>
              <FiShield size={24} />
              <span className="font-semibold">Guaranteed Quality</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#065D5F' }}>
              <FiAward size={24} />
              <span className="font-semibold">Hygiene Certified</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#065D5F' }}>
              <FiShield size={24} />
              <span className="font-semibold">Halal Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 text-white" style={{ background: 'linear-gradient(135deg, #03BEB0 0%, #02A99C 100%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-8">
            Dapur Nekti's Commitment to You
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold mb-1">{stats.orders}</div>
              <div className="text-white/80 text-sm">Orders Delivered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold mb-1">{stats.customers}</div>
              <div className="text-white/80 text-sm">Loyal Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold mb-1">{stats.menus}</div>
              <div className="text-white/80 text-sm">Menu Choices</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold mb-1">{stats.years}</div>
              <div className="text-white/80 text-sm">Years of Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 text-center" style={{ color: '#065D5F' }}>
            Popular Categories
          </h2>
          <p className="text-gray-500 text-center mb-8">Choose your favorite menu category</p>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center">
            {categories.map((cat) => (
              <Link
                key={cat.category_id}
                to={`/menu?category=${cat.category_id}`}
                className="group flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-teal-200 text-center w-[180px]"
              >
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.category_name}
                    className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full object-cover group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E6F7F6' }}>
                    <span className="text-2xl">🍱</span>
                  </div>
                )}
                <h3 className="font-semibold group-hover:text-teal-500 transition-colors" style={{ color: '#065D5F' }}>
                  {cat.category_name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{cat.description || 'View menu'}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#03BEB0' }}
            >
              View Full Menu <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12" style={{ backgroundColor: '#F0F7F7' }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: '#065D5F' }}>
            Why Choose Dapur Nekti?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl text-center shadow-sm">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F6' }}>
                <FiClock style={{ color: '#03BEB0' }} size={28} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#065D5F' }}>24/7 Ready</h3>
              <p className="text-gray-500 text-sm">Last-minute orders? We are ready anytime!</p>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center shadow-sm">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F6' }}>
                <FiTruck style={{ color: '#03BEB0' }} size={28} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#065D5F' }}>Fast Delivery</h3>
              <p className="text-gray-500 text-sm">Prompt delivery, food arrives piping hot</p>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center shadow-sm">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F6' }}>
                <FiShield style={{ color: '#03BEB0' }} size={28} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#065D5F' }}>Guaranteed Quality</h3>
              <p className="text-gray-500 text-sm">Fresh ingredients & rigorous hygiene standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl p-8 md:p-12 text-center text-white" style={{ background: 'linear-gradient(135deg, #065D5F 0%, #054D4F 100%)' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Need a Fast and Reliable Order?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Relax! Dapur Nekti is ready to handle large on-demand orders.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white font-bold rounded-2xl hover:bg-gray-100 transition-all"
              style={{ color: '#065D5F' }}
            >
              Order Now <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}