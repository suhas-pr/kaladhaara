import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [cartItemCount, setCartItemCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [user]);

  const loadCartCount = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id);

    if (data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(total);
    }
  };

  const handleNavigate = (page: string, productId?: string) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo(0, 0);
  };

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAddToCart = async (productId: string, quantity: number) => {
    if (!user) {
      handleAuthClick('login');
      return;
    }

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);
    } else {
      await supabase.from('cart_items').insert([
        {
          user_id: user.id,
          product_id: productId,
          quantity: quantity,
        },
      ]);
    }

    loadCartCount();
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen">
      <Header
        onNavigate={handleNavigate}
        currentPage={currentPage}
        cartItemCount={cartItemCount}
        onAuthClick={handleAuthClick}
      />

      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'shop' && <Shop onNavigate={handleNavigate} />}
      {currentPage === 'product' && selectedProductId && (
        <ProductDetail
          productId={selectedProductId}
          onNavigate={handleNavigate}
          onAddToCart={handleAddToCart}
          onAuthClick={handleAuthClick}
        />
      )}
      {currentPage === 'cart' && (
        <Cart onNavigate={handleNavigate} onCartUpdate={loadCartCount} />
      )}
      {currentPage === 'checkout' && (
        <Checkout onNavigate={handleNavigate} onCartUpdate={loadCartCount} />
      )}
      {currentPage === 'about' && <About />}

      {showAuthModal && (
        <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
