import { useEffect, useState } from 'react';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { supabase, CartItem } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type CartProps = {
  onNavigate: (page: string) => void;
  onCartUpdate: () => void;
};

export default function Cart({ onNavigate, onCartUpdate }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', user.id);

    if (data) {
      setCartItems(data as CartItem[]);
    }
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    if (!error) {
      loadCart();
      onCartUpdate();
    }
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (!error) {
      loadCart();
      onCartUpdate();
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity;
  }, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your cart</p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 mb-8 transition"
        >
          <ArrowLeft size={20} />
          <span>Continue Shopping</span>
        </button>

        <h1 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start adding some amazing art kits!</p>
            <button
              onClick={() => onNavigate('shop')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition"
            >
              Browse Kits
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-200">
                  <div className="flex gap-6">
                    <img
                      src={item.products?.image_url}
                      alt={item.products?.name}
                      className="w-32 h-32 object-cover rounded-xl border-2 border-pink-200"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {item.products?.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {item.products?.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-orange-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-orange-600 transition"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-orange-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-orange-600 transition"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-red-600">
                            ₹{((item.products?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-lg border-4 border-yellow-200 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4 flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-red-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('checkout')}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-pink-600 transition transform hover:scale-105 shadow-xl"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6 bg-orange-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 text-center">
                    Secure checkout with multiple payment options
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
