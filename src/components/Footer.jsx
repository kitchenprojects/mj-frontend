import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#065D5F' }} className="text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span style={{ color: '#03BEB0' }} className="font-bold text-lg">MJ</span>
              </div>
              <span className="text-xl font-bold">MJ Kitchen</span>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Catering & nasi box berkualitas untuk segala acara. Siap antar, hangat, dan terpercaya!
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <FaWhatsapp size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <FaFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Menu Cepat</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link to="/menu" className="hover:text-white transition-colors">Daftar Menu</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Keranjang</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Lacak Pesanan</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Daftar Akun</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2">
                <FiPhone size={16} />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp size={16} />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail size={16} />
                <span>hello@mjkitchen.com</span>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} MJ Kitchen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}