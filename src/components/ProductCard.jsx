import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[4/5] bg-[#F9F9F9] rounded-2xl overflow-hidden relative mb-6 transition-all duration-500 group-hover:bg-[#F3F3F3]">
          <img
            src={product.image_url || `https://placehold.co/600x750/f9f9f9/888?text=${product.name}`}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
          />

        </div>
      </Link>

      <div className="flex justify-between items-start px-1">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">{product.category}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-base font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">{product.name}</h3>
          </Link>
          <p className="text-base font-medium text-gray-900">${product.price}</p>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
