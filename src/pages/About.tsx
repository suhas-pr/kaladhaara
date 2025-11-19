import { Heart, Palette, BookOpen, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
          About Kaladhaara
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border-4 border-orange-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Kaladhaara was born from a simple belief: that the rich tapestry of Indian mythology
              deserves to be passed on to the next generation in engaging, creative ways. We combine
              the timeless wisdom of the Ramayana, Mahabharata, and Bhagavatham with the joy of
              hands-on artistic creation.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Each kit is carefully designed to spark curiosity, nurture creativity, and instill
              cultural values in young minds through the magic of art.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-4 border-pink-200">
              <div className="bg-gradient-to-br from-orange-400 to-red-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To make Indian mythology accessible and exciting for children through creative,
                hands-on learning experiences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-4 border-yellow-200">
              <div className="bg-gradient-to-br from-pink-400 to-red-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Our Vision</h3>
              <p className="text-gray-600">
                A world where every child grows up connected to their cultural roots while
                developing their artistic talents.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-4 border-orange-200">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Our Approach</h3>
              <p className="text-gray-600">
                We blend storytelling with art, making learning fun and memorable through
                multi-sensory experiences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-4 border-pink-200">
              <div className="bg-gradient-to-br from-red-400 to-pink-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Our Community</h3>
              <p className="text-gray-600">
                Join thousands of families creating memories and learning together through our
                art kits.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center">Get in Touch</h2>
            <div className="text-center space-y-3">
              <p className="text-lg">
                <strong>Email:</strong> hello@thekaladhaara.com
              </p>
              <p className="text-lg">
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p className="text-lg">
                <strong>Address:</strong> Mumbai, Maharashtra, India
              </p>
            </div>
            <div className="mt-6 text-center">
              <p className="text-yellow-200">
                We'd love to hear from you! Reach out with questions, feedback, or just to say hello.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
