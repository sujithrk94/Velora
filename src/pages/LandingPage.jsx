import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import ProductCard from '../components/ProductCard';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const filteredProducts = products;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setProducts(data);
          setFetchError(null);
        } else {
          setFetchError('No products found in the database.');
        }
      } catch (err) {
        setFetchError(`Could not load products from Supabase: ${err.message}`);
        console.error('Supabase fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Error Banner */}
      {fetchError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse"></div>
            <p className="text-sm font-medium text-amber-800">{fetchError}</p>
          </div>
        </div>
      )}

      {/* Hero Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-min">

          {/* Main Text Block */}
          <div
            className="lg:col-span-2 rounded-2xl p-8 md:p-16 flex flex-col justify-center relative overflow-hidden min-h-[500px] bg-gray-100"
            style={{
              backgroundImage: "url('/velora-cover-image.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >

            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Elevate your <br /> everyday wear.
              </h1>
              <p className="text-gray-800 text-lg mb-4 max-w-md font-medium leading-relaxed">
                Clean silhouettes, premium comfort, and pieces made to move with you.
              </p>
              <p className="text-gray-600 text-sm mb-10 font-medium tracking-wide">
                Designed for modern living.
              </p>

            </div>
          </div>

        </div>
      </section>


      {/* Products Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline mb-16">
          <div>
            <h2 className="text-3xl font-medium text-gray-900">Browse collection</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-100 rounded-2xl mb-6"></div>
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : !fetchError ? (
            <p className="col-span-3 text-center text-gray-400 font-light py-20">No products available.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
