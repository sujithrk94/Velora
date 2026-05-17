import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ShoppingCart, Package, DollarSign,
  ChevronDown, ChevronUp, Search, LogOut,
  ShieldCheck, Loader2, ArrowLeft, RefreshCw
} from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

/* ── helpers ── */
const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
const initials = (email) => (email ? email.slice(0, 2).toUpperCase() : '??');
const avatarColor = (email) => {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-indigo-500 to-blue-700',
  ];
  let hash = 0;
  for (let c of (email || '')) hash += c.charCodeAt(0);
  return colors[hash % colors.length];
};

/* ── stat card ── */
const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/4 border border-white/8 rounded-2xl p-6 flex flex-col gap-4"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={18} className="text-white" />
    </div>
    <div>
      <p className="text-3xl font-semibold text-white tracking-tight">{value}</p>
      <p className="text-white/40 text-sm mt-0.5">{label}</p>
      {sub && <p className="text-white/25 text-xs mt-1">{sub}</p>}
    </div>
  </motion.div>
);

/* ── user row ── */
const UserRow = ({ profile, cartItems, index }) => {
  const [open, setOpen] = useState(false);
  const total = cartItems.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border border-white/8 rounded-2xl overflow-hidden bg-white/3 hover:bg-white/5 transition-colors"
    >
      {/* Header row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-6 py-4 text-left"
      >
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(profile.email)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {initials(profile.email)}
        </div>

        {/* Email */}
        <div className="flex-grow min-w-0">
          <p className="text-white text-sm font-medium truncate">{profile.email}</p>
          <p className="text-white/30 text-xs mt-0.5">
            Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {profile.is_admin && (
            <span className="text-[10px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
              Admin
            </span>
          )}
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${cartItems.length > 0
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-white/5 text-white/25 border border-white/8'
            }`}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
          <span className="text-white/60 text-sm font-medium w-16 text-right">{fmt(total)}</span>
          {open ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
        </div>
      </button>

      {/* Cart items accordion */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/6 mx-4 mb-4">
              {cartItems.length === 0 ? (
                <p className="text-white/25 text-sm text-center py-8">No items in cart</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {/* Column headers */}
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-3 text-[10px] uppercase tracking-widest text-white/25 font-semibold">
                    <span>Product</span>
                    <span>Size</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Subtotal</span>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center bg-white/3 rounded-xl px-3 py-3 border border-white/5"
                    >
                      {/* Product */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-white/6 overflow-hidden flex-shrink-0 border border-white/8">
                          {item.product?.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={14} className="text-white/20" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.product?.name || '—'}</p>
                          <p className="text-white/35 text-xs">{item.product?.category || '—'}</p>
                        </div>
                      </div>

                      {/* Size */}
                      <span className="text-white/50 text-sm">{item.size || '—'}</span>

                      {/* Qty */}
                      <span className="text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/8 text-white text-sm font-semibold">
                          {item.quantity}
                        </span>
                      </span>

                      {/* Subtotal */}
                      <span className="text-right text-white text-sm font-semibold">
                        {fmt((item.product?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}

                  {/* Row total */}
                  <div className="flex justify-between items-center px-3 pt-2 border-t border-white/6 mt-2">
                    <span className="text-white/30 text-xs uppercase tracking-widest font-semibold">Cart Total</span>
                    <span className="text-white font-semibold">{fmt(total)}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   ADMIN PAGE
════════════════════════════════════════ */
const AdminPage = () => {
  const { user, signOut, authLoading } = useAuth();
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [rawError, setRawError] = useState(null);
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  /* ── check admin & load data ── */
  const loadData = async () => {
    if (!user) return;

    try {
      // Check if current user is admin
      const { data: myProfile, error: profileErr } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      setDebugData(myProfile);

      if (profileErr) {
        console.error('Error fetching admin profile:', profileErr);
        setRawError(profileErr.message);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (!myProfile || !myProfile.is_admin) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      // Fetch all profiles
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch all cart items (admin policy allows this)
      const { data: allCart } = await supabase
        .from('cart')
        .select('*, product:products(*)');

      setProfiles(allProfiles || []);
      setCartItems(allCart || []);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  useEffect(() => {
    if (!authLoading) loadData();
  }, [user, authLoading]);

  /* ── redirect if not logged in ── */
  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [user, authLoading]);

  /* ── filtered users ── */
  const filtered = profiles.filter((p) =>
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const cartFor = (uid) => cartItems.filter((c) => c.user_id === uid);

  /* ── stats ── */
  const totalCartValue = cartItems.reduce(
    (s, i) => s + (i.product?.price || 0) * i.quantity, 0
  );
  const usersWithCart = new Set(cartItems.map((c) => c.user_id)).size;
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  /* ── loading screen ── */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-white/30 animate-spin" />
          <p className="text-white/30 text-sm">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  /* ── access denied ── */
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={28} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">Access Denied</h1>
          <p className="text-white/40 text-sm mb-6 leading-relaxed">
            You don't have admin privileges. Contact the site owner to get access.
          </p>

          {/* Debug Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-left">
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Debug Info</p>
            <div className="space-y-2">
              <p className="text-xs text-white/50 truncate">
                <span className="text-white/30">User ID:</span> {user?.id}
              </p>
              <p className="text-xs text-white/50">
                <span className="text-white/30">DB Response:</span> {debugData ? JSON.stringify(debugData) : 'null'}
              </p>
              {rawError && (
                <p className="text-xs text-red-400">
                  <span className="text-white/30 text-red-400/50">Supabase Error:</span> {rawError}
                </p>
              )}
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} /> Back to store
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── admin dashboard ── */
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <header className="border-b border-white/8 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white/40 hover:text-white/70 transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-white font-semibold tracking-tight">Velora</span>
            <span className="text-white/20 text-sm">/</span>
            <span className="text-white/50 text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/30 text-sm hidden sm:block">{user?.email}</span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => { signOut(); navigate('/'); }}
              className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/70 transition-colors p-2 rounded-lg hover:bg-white/5"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-white/35 mt-1 text-sm">Monitor all user accounts and their shopping carts.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={Users}
            label="Total Users"
            value={profiles.length}
            color="bg-violet-500/20"
          />
          <StatCard
            icon={ShoppingCart}
            label="Active Carts"
            value={usersWithCart}
            sub={`of ${profiles.length} users`}
            color="bg-blue-500/20"
          />
          <StatCard
            icon={Package}
            label="Total Items"
            value={totalItems}
            color="bg-emerald-500/20"
          />
          <StatCard
            icon={DollarSign}
            label="Cart Value"
            value={fmt(totalCartValue)}
            color="bg-amber-500/20"
          />
        </div>

        {/* User count */}
        <p className="text-white/25 text-xs mb-4 uppercase tracking-widest font-semibold">
          {filtered.length} {filtered.length === 1 ? 'user' : 'users'}
        </p>

        {/* User list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/25 text-sm">No users found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((profile, i) => (
              <UserRow
                key={profile.id}
                profile={profile}
                cartItems={cartFor(profile.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
