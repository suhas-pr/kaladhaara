import { useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';

type ShopProps = {
  onNavigate: (page: string, productId?: string) => void;
};

export default function Shop({ onNavigate }: ShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', 'Ramayana', 'Mahabharata', 'Bhagavatham'];

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (filter !== 'All') {
      query = query.eq('category', filter);
    }

    const { data } = await query;
    if (data) setProducts(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
          Our Art & DIY Kits
        </h1>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          Explore our collection of creative kits that bring ancient stories to life
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-full font-semibold transition transform hover:scale-105 ${
                filter === category
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-100 border-2 border-orange-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition cursor-pointer border-4 border-transparent hover:border-orange-300"
              onClick={() => onNavigate('product', product.id)}
            >
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 right-3 bg-yellow-400 text-red-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {product.category}
                </div>
                {product.featured && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500 bg-orange-100 px-3 py-1 rounded-full">
                    {product.age_recommendation}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-red-600">₹{product.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('product', product.id);
                    }}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition shadow-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
