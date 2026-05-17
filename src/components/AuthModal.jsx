import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reset = () => {
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
    setLoading(false);
    setShowPassword(false);
  };

  const switchTab = (t) => {
    setTab(t);
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await signIn(email, password);
        onClose();
        reset();
      } else {
        await signUp(email, password);
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-[#111111] rounded-3xl shadow-2xl overflow-hidden border border-white/8">

              {/* Header */}
              <div className="px-8 pt-8 pb-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-7 right-7 text-white/30 hover:text-white/70 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="mb-6">
                  <span className="text-white/40 text-xs tracking-[0.2em] uppercase font-medium">Velora</span>
                  <h2 className="text-2xl font-semibold text-white mt-1 tracking-tight">
                    {tab === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-white/40 text-sm mt-1">
                    {tab === 'login'
                      ? 'Sign in to access your cart and orders.'
                      : 'Join Velora to start shopping.'}
                  </p>
                </div>

                {/* Tab switcher */}
                <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                  {['login', 'register'].map((t) => (
                    <button
                      key={t}
                      onClick={() => switchTab(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                        tab === t
                          ? 'bg-white text-black shadow'
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      {t === 'login' ? 'Sign In' : 'Register'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="px-8 pb-8">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4 py-6 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 size={28} className="text-emerald-400" />
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{success}</p>
                    <button
                      onClick={() => switchTab('login')}
                      className="text-white text-sm font-medium underline underline-offset-4"
                    >
                      Go to Sign In
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-white/40 uppercase tracking-widest font-medium">
                        Email
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="you@example.com"
                          className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-white/40 uppercase tracking-widest font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {tab === 'register' && (
                        <p className="text-white/25 text-xs mt-1">Minimum 6 characters</p>
                      )}
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-400 text-xs bg-red-400/8 border border-red-400/15 rounded-xl px-4 py-3 leading-relaxed"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-white text-black py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {tab === 'login' ? 'Signing in...' : 'Creating account...'}
                        </>
                      ) : (
                        tab === 'login' ? 'Sign In' : 'Create Account'
                      )}
                    </button>

                    {/* Switch tab hint */}
                    <p className="text-center text-white/30 text-xs pt-1">
                      {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                      <button
                        type="button"
                        onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
                        className="text-white/60 hover:text-white underline underline-offset-2 transition-colors"
                      >
                        {tab === 'login' ? 'Register' : 'Sign in'}
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
