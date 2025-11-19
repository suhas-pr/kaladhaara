import { ShoppingCart, User, Home, Package, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type HeaderProps = {
  onNavigate: (page: string) => void;
  currentPage: string;
  cartItemCount: number;
  onAuthClick: (mode: 'login' | 'register') => void;
};

export default function Header({ onNavigate, currentPage, cartItemCount, onAuthClick }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="text-3xl font-bold tracking-tight">
              <span className="text-yellow-200">Kala</span>
              <span className="text-white">dhaara</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center space-x-1 hover:text-yellow-200 transition ${
                currentPage === 'home' ? 'text-yellow-200 font-semibold' : ''
              }`}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className={`flex items-center space-x-1 hover:text-yellow-200 transition ${
                currentPage === 'shop' ? 'text-yellow-200 font-semibold' : ''
              }`}
            >
              <Package size={20} />
              <span>Shop Kits</span>
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`flex items-center space-x-1 hover:text-yellow-200 transition ${
                currentPage === 'about' ? 'text-yellow-200 font-semibold' : ''
              }`}
            >
              <Mail size={20} />
              <span>About</span>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('cart')}
              className="relative hover:text-yellow-200 transition"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
                  <User size={20} />
                  <span className="text-sm">{user.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={signOut}
                  className="bg-white text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-200 hover:text-red-600 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onAuthClick('login')}
                  className="bg-white text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-200 hover:text-red-600 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthClick('register')}
                  className="bg-yellow-400 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
