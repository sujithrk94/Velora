import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          product_id,
          quantity,
          size,
          product:products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCart(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, size = null) => {
    if (!user) return;

    try {
      const existingItem = cart.find(item =>
        item.product_id === product.id && item.size === size
      );

      if (existingItem) {
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart')
          .insert([{
            product_id: product.id,
            quantity: 1,
            user_id: user.id,
            size: size
          }]);
        if (error) throw error;
      }
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return removeFromCart(itemId);
    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', itemId);
      if (error) throw error;
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Re-fetch cart whenever the user changes (login / logout)
  useEffect(() => {
    fetchCart();
  }, [user]);

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    cartTotal: cart.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0),
    cartCount: cart.reduce((count, item) => count + item.quantity, 0)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
