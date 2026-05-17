import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (loading) return <div className="py-20 text-center font-light text-gray-400">Loading cart...</div>;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-8">
          <ShoppingBag size={28} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-4">Your bag is empty</h2>
        <p className="text-gray-500 mb-10 font-light max-w-xs mx-auto">Looks like you haven't added anything to your bag yet.</p>
        <Link to="/" className="inline-flex items-center justify-center bg-gray-900 text-white px-10 py-3.5 rounded-full font-medium hover:bg-black transition-all">
          Explore products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-16">Shopping bag</h1>
      
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="border-t border-gray-100">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-8 py-10 border-b border-gray-100 items-start">
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product?.image_url || `https://placehold.co/200x200/f9f9f9/666?text=${item.product?.name}`} 
                    alt={item.product?.name}
                    className="w-full h-full object-cover mix-blend-multiply opacity-90"
                  />
                </div>
                
                <div className="flex-grow flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 mb-1">{item.product?.name}</h3>
                    <p className="text-sm font-light text-gray-400 mb-6">{item.product?.category}</p>
                    
                    <div className="flex items-center border border-gray-200 rounded-full p-1 w-fit">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-4 h-full">
                    <p className="font-medium text-lg text-gray-900">${item.product?.price * item.quantity}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Summary */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-gray-50 rounded-3xl p-10 sticky top-24 border border-transparent hover:border-gray-100 transition-all">
            <h2 className="text-xl font-medium text-gray-900 mb-10">Order summary</h2>
            
            <div className="space-y-5 mb-10 font-light text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 font-medium">${cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-gray-900 font-medium">Calculated at next step</span>
              </div>
              <div className="pt-5 border-t border-gray-100 flex justify-between items-center text-xl font-medium text-gray-900">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
            </div>
            
            <button className="w-full bg-gray-900 text-white py-4 rounded-full font-medium flex items-center justify-center gap-3 hover:bg-black transition-all shadow-sm">
              Checkout <ArrowRight size={18} />
            </button>
            <p className="text-[11px] text-center text-gray-400 mt-6 tracking-widest uppercase font-medium">
              Free returns on all orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
