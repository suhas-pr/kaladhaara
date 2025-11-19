import { useEffect, useState } from 'react';
import { ShoppingCart, ArrowLeft, Star, Package, Shield } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type ProductDetailProps = {
  productId: string;
  onNavigate: (page: string) => void;
  onAddToCart: (productId: string, quantity: number) => void;
  onAuthClick: (mode: 'login' | 'register') => void;
};

export default function ProductDetail({ productId, onNavigate, onAddToCart, onAuthClick }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (data) setProduct(data);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      onAuthClick('login');
      return;
    }
    onAddToCart(product.id, quantity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 mb-8 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Shop</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-200">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 bg-yellow-400 text-red-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {product.category}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-4 border-pink-200">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">4.8 (127 reviews)</span>
            </div>

            <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>

            <div className="bg-gradient-to-r from-orange-100 to-pink-100 p-4 rounded-xl mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="text-orange-600" size={24} />
                <h3 className="font-bold text-gray-800">What's Included:</h3>
              </div>
              <p className="text-gray-700">{product.whats_included}</p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-xl mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="text-yellow-600" size={24} />
                <h3 className="font-bold text-gray-800">Age Recommendation:</h3>
              </div>
              <p className="text-gray-700">{product.age_recommendation}</p>
            </div>

            <div className="border-t-2 border-gray-200 pt-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-bold text-red-600">₹{product.price}</span>
                <span className="text-gray-600">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <label className="font-semibold text-gray-700">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-orange-500 text-white w-10 h-10 rounded-lg font-bold hover:bg-orange-600 transition"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="bg-orange-500 text-white w-10 h-10 rounded-lg font-bold hover:bg-orange-600 transition"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-pink-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={24} />
                <span>{product.stock === 0 ? 'Out of Stock' : user ? 'Add to Cart' : 'Sign In to Purchase'}</span>
              </button>
            </div>

            {!user && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 text-center">
                <p className="text-gray-700 mb-3">Please sign in to add items to your cart</p>
                <button
                  onClick={() => onAuthClick('login')}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition"
                >
                  Sign In Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
