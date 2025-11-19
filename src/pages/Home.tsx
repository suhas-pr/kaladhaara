import { useEffect, useState } from 'react';
import { Star, Sparkles, Heart, Palette } from 'lucide-react';
import { supabase, Product, Review } from '../lib/supabase';

type HomeProps = {
  onNavigate: (page: string, productId?: string) => void;
};

export default function Home({ onNavigate }: HomeProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadFeaturedProducts();
    loadReviews();
  }, []);

  const loadFeaturedProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(4);

    if (data) setFeaturedProducts(data);
  };

  const loadReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .limit(3)
      .order('created_at', { ascending: false });

    if (data) setReviews(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-yellow-50">
      <section className="relative bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 animate-bounce">
            <Sparkles size={40} />
          </div>
          <div className="absolute top-20 right-20 animate-pulse">
            <Palette size={50} />
          </div>
          <div className="absolute bottom-10 left-1/3 animate-bounce delay-150">
            <Heart size={35} />
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Bring Stories to Life with Art!
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover magical DIY art kits inspired by the timeless tales of Ramayana, Mahabharata, and Bhagavatham
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-yellow-400 text-red-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transform hover:scale-105 transition shadow-2xl"
          >
            Explore Our Kits
          </button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition border-4 border-orange-200">
            <div className="bg-gradient-to-br from-orange-400 to-red-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Creative Learning</h3>
            <p className="text-gray-600">
              Combine art and storytelling for a fun educational experience
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition border-4 border-pink-200">
            <div className="bg-gradient-to-br from-pink-400 to-red-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Cultural Heritage</h3>
            <p className="text-gray-600">
              Introduce kids to Indian mythology through engaging activities
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition border-4 border-yellow-200">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Quality</h3>
            <p className="text-gray-600">
              All kits include high-quality materials and detailed story guides
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            Featured Art Kits
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition cursor-pointer border-4 border-transparent hover:border-orange-300"
                onClick={() => onNavigate('product', product.id)}
              >
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                    {product.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600">₹{product.price}</span>
                    <span className="text-sm text-gray-500">{product.age_recommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-bold hover:from-orange-600 hover:to-pink-600 transition shadow-lg"
            >
              View All Kits
            </button>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            What Parents Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-2xl shadow-lg border-4 border-yellow-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.content}"</p>
                <p className="font-semibold text-gray-800">- {review.customer_name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Creating?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of families exploring mythology through art
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-yellow-400 text-red-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transform hover:scale-105 transition shadow-2xl"
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
}
