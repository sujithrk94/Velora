import React from 'react';
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet';
import { cn } from '../lib/utils';

const CartSlider = ({ children, open, onOpenChange }) => {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children || (
          <button className="text-white/70 hover:text-white transition-colors relative">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0 border-none">
        <SheetHeader className="p-6 border-b border-gray-100">
          <SheetTitle className="flex items-center gap-2 uppercase tracking-tight font-medium">
            Shopping Bag ({cartCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-gray-900 font-medium">Your bag is empty</p>
                <p className="text-sm text-gray-400 font-light">Add items to get started</p>
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.product?.image_url || `https://placehold.co/200x240/f9f9f9/666?text=${item.product?.name}`}
                    alt={item.product?.name}
                    className="w-full h-full object-cover mix-blend-multiply opacity-90"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-gray-900 uppercase tracking-tight leading-tight">
                        {item.product?.name}
                      </h4>
                      <p className="text-sm font-medium text-gray-900">${item.product?.price}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-medium">
                      {item.product?.category} {item.size ? `• Size ${item.size}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-100 rounded-full p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 rounded-full"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 rounded-full"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between text-sm mb-6">
              <span className="text-gray-500 font-light">Subtotal</span>
              <span className="text-gray-900 font-medium">${cartTotal}</span>
            </div>
            <button className="w-full bg-gray-900 text-white h-12 rounded-full font-medium flex items-center justify-center gap-3 hover:bg-black transition-all shadow-sm">
              Checkout <ArrowRight size={18} />
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.15em] font-medium">
              Free shipping on orders over $150
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSlider;
