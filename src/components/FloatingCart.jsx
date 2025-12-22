import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function FloatingCart() {
    const items = useCartStore((s) => s.items);
    const total = useCartStore((s) => s.total);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    // Only show if there are items in cart
    if (itemCount === 0) return null;

    return (
        <Link
            to="/cart"
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3 text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 animate-bounce-once"
            style={{
                background: 'linear-gradient(135deg, #03BEB0 0%, #065D5F 100%)',
                boxShadow: '0 10px 40px rgba(3, 190, 176, 0.4)'
            }}
        >
            <div className="relative">
                <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                <span className="absolute -top-2 -right-2 bg-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold px-1" style={{ color: '#03BEB0' }}>
                    {itemCount}
                </span>
            </div>
            <div className="border-l border-white/30 pl-3">
                <p className="text-[10px] text-white/80 leading-tight">Total</p>
                <p className="font-bold text-sm">Rp {total().toLocaleString('id-ID')}</p>
            </div>
            <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
        </Link>
    );
}
