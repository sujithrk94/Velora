import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, ShieldCheck, Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartSlider from './CartSlider';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_url, category')
          .ilike('name', `%${searchQuery}%`)
          .limit(5);

        if (!error && data) {
          setSearchResults(data);
        }
      } catch (err) {
        console.error('Error searching products:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : '??';

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
  };

  return (
    <>
      <nav className="border-b border-gray-100/10 sticky top-0 bg-black backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-medium tracking-tight text-white">
                Velora
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex items-center" ref={searchContainerRef}>
                <AnimatePresence>
                  {isSearchExpanded && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 240, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-full py-1.5 pl-4 pr-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => {
                    setIsSearchExpanded(!isSearchExpanded);
                    if (isSearchExpanded) {
                      setSearchQuery('');
                      setSearchResults([]);
                    }
                  }}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                >
                  {isSearchExpanded ? <X size={20} /> : <Search size={20} />}
                </button>

                {/* Search Dropdown */}
                <AnimatePresence>
                  {isSearchExpanded && searchQuery.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-[calc(100%+10px)] right-0 w-[320px] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col"
                    >
                      {isSearching ? (
                        <div className="py-8 flex justify-center items-center">
                          <Loader2 size={24} className="text-gray-400 animate-spin" />
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-2 max-h-[400px] overflow-y-auto">
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.id}`}
                              onClick={() => {
                                setIsSearchExpanded(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                            >
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                <img
                                  src={product.image_url || `https://placehold.co/100x100/f9f9f9/888?text=${product.name}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover mix-blend-multiply"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                                <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                ${product.price}
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center px-4">
                          <p className="text-sm text-gray-500">No products found for "{searchQuery}"</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <CartSlider className="text-white hover:text-white" />

              {/* Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-xs font-semibold tracking-wider transition-all"
                    title={user.email}
                  >
                    {initials}
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        {/* click-away backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.94, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.94, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-10 z-20 min-w-[200px] bg-[#111] border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-white/8">
                            <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
                              Signed in as
                            </p>
                            <p className="text-white text-sm font-medium mt-0.5 truncate">
                              {user.email}
                            </p>
                          </div>
                          
                          {profile?.is_admin && (
                            <Link
                              to="/admin"
                              onClick={() => setDropdownOpen(false)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-violet-400 hover:text-violet-300 hover:bg-white/5 transition-colors border-b border-white/8"
                            >
                              <ShieldCheck size={14} />
                              Admin Panel
                            </Link>
                          )}

                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <LogOut size={14} />
                            Sign out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
                  title="Sign in"
                >
                  <User size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
