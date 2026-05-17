import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <CartProvider>
            <Routes>
              {/* Admin — own full-screen layout, no Navbar/Footer */}
              <Route path="/admin" element={<AdminPage />} />

              {/* Store layout */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </CartProvider>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
