import { useEffect, useState } from 'react';
import { CreditCard, Smartphone, Wallet, Lock, CheckCircle } from 'lucide-react';
import { supabase, CartItem } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type CheckoutProps = {
  onNavigate: (page: string) => void;
  onCartUpdate: () => void;
};

export default function Checkout({ onNavigate, onCartUpdate }: CheckoutProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    paymentMethod: 'card',
  });

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

    if (data && data.length > 0) {
      setCartItems(data as CartItem[]);
    }
    setLoading(false);
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity;
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) return;

    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.pincode || !formData.phone) {
      alert('Please fill in all shipping details');
      return;
    }

    setProcessing(true);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending',
          shipping_address: {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
          },
        },
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      alert('Error placing order. Please try again.');
      setProcessing(false);
      return;
    }

    const orderItems = cartItems.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products?.price || 0,
    }));

    await supabase.from('order_items').insert(orderItems);

    await supabase.from('cart_items').delete().eq('user_id', user.id);

    setProcessing(false);
    setOrderPlaced(true);
    onCartUpdate();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to proceed with checkout</p>
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

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-2xl text-center border-4 border-green-400">
            <CheckCircle size={80} className="mx-auto mb-6 text-green-500" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for your order! We'll send you a confirmation email shortly.
            </p>
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 p-6 rounded-xl mb-8">
              <p className="text-gray-700">
                Your creative journey begins now! We're preparing your art kits with love and care.
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-pink-600 transition transform hover:scale-105 shadow-xl"
            >
              Continue Shopping
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
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
            <button
              onClick={() => onNavigate('shop')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition"
            >
              Browse Kits
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="Street address, apartment, etc."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="PIN Code"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-pink-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <CreditCard className="mr-3 text-orange-500" size={24} />
                  <span className="font-semibold">Credit / Debit Card</span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <Smartphone className="mr-3 text-orange-500" size={24} />
                  <span className="font-semibold">UPI</span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={formData.paymentMethod === 'wallet'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <Wallet className="mr-3 text-orange-500" size={24} />
                  <span className="font-semibold">Digital Wallet</span>
                </label>
              </div>

              <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 flex items-start space-x-3">
                <Lock className="text-yellow-600 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-800">Secure Payment</p>
                  <p className="text-sm text-gray-600">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-4 border-yellow-200 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span className="flex-1">
                      {item.products?.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{((item.products?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-red-600">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-pink-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {processing ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
