import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { SheetTrigger } from '../components/ui/sheet';
import CartSlider from '../components/CartSlider';
import { PRODUCTS } from '../data/products';

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await supabase.from('products').select('*').eq('id', id).single();
        if (data) {
          setProduct(data);
        } else {
          const mock = PRODUCTS.find(p => p.id === parseInt(id));
          setProduct(mock || PRODUCTS[0]);
        }
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    addToCart(product, selectedSize);
    setIsCartOpen(true);
  };

  const sizes = product?.sizes || DEFAULT_SIZES;
  if (loading) return <div className="py-20 text-center font-light text-gray-400">Loading details...</div>;
  if (!product) return <div className="py-20 text-center font-light text-gray-400">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <p className="text-sm font-medium tracking-tight">Please select a size to continue</p>
        </div>
      )}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 mb-12 transition-colors font-medium group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Gallery */}
        <div className="flex-1 space-y-6">
          <div className="aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
            <img
              src={product.image_url || `https://placehold.co/800x1000/f9f9f9/666?text=${product.name}`}
              alt={product.name}
              className="w-full h-full object-cover mix-blend-multiply opacity-90"
            />
          </div>

        </div>

        {/* Info */}
        <div className="flex-1 lg:py-4">
          <div className="mb-10">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-4 block">
              {product.category}
            </span>
            <h1 className="text-4xl lg:text-5xl font-medium tracking-tight text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-medium text-gray-900">${product.price}</p>
          </div>

          <div className="mb-12">
            <h3 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">Description</h3>
            <div className="text-gray-500 font-light leading-relaxed text-lg max-w-xl">
              <p>{product.description || "Experimental design meets peak utility. This premium piece is constructed from high-tenacity, weather-resistant materials. It features a spacious main compartment, dedicated tech sleeves, and hidden pockets for total organization."}</p>
            </div>
          </div>

          <div className="space-y-10">
            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-medium uppercase tracking-widest text-gray-400">Select Size</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-12 h-12 rounded-full border text-sm font-medium transition-all flex items-center justify-center",
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white shadow-lg shadow-gray-200"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Slider Trigger */}
            <CartSlider open={isCartOpen} onOpenChange={setIsCartOpen}>
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white h-14 rounded-full font-medium flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl shadow-gray-100 group"
              >
                <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                Add to bag
              </button>
            </CartSlider>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-100">
              <div className="flex flex-col gap-1">
                <h4 className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Shipping</h4>
                <p className="text-sm font-medium text-gray-700">Free worldwide</p>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Returns</h4>
                <p className="text-sm font-medium text-gray-700">30-day extended</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
