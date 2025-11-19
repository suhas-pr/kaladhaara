/*
  # E-commerce Schema for Kaladhaara

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `category` (text) - story theme (Ramayana, Mahabharata, Bhagavatham)
      - `age_recommendation` (text)
      - `whats_included` (text)
      - `stock` (integer)
      - `featured` (boolean)
      - `created_at` (timestamptz)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `created_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `total_amount` (numeric)
      - `status` (text)
      - `shipping_address` (jsonb)
      - `created_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `price` (numeric)
      - `created_at` (timestamptz)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `content` (text)
      - `rating` (integer)
      - `customer_name` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own cart and orders
    - Products and reviews are publicly readable
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  category text NOT NULL,
  age_recommendation text NOT NULL,
  whats_included text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending',
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  content text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  customer_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view order items for their orders"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can create own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

INSERT INTO products (name, description, price, image_url, category, age_recommendation, whats_included, stock, featured) VALUES
('Hanuman DIY Art Kit', 'Bring the mighty Hanuman to life with this creative DIY kit! Learn about his devotion and strength while crafting colorful art.', 499, 'https://images.pexels.com/photos/3661193/pexels-photo-3661193.jpeg?auto=compress&cs=tinysrgb&w=800', 'Ramayana', '6-10 years', 'Pre-cut pieces, paints, brushes, story booklet, glue', 50, true),
('Krishna Flute Art Set', 'Create beautiful art inspired by Lord Krishna playing his flute. Perfect for budding artists to explore colors and stories.', 599, 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800', 'Bhagavatham', '7-12 years', 'Canvas, acrylic paints, brushes, Krishna story guide, stencils', 40, true),
('Arjuna Archery Craft Kit', 'Discover the legendary archer Arjuna through this engaging DIY kit. Build, paint, and learn!', 549, 'https://images.pexels.com/photos/6045187/pexels-photo-6045187.jpeg?auto=compress&cs=tinysrgb&w=800', 'Mahabharata', '8-13 years', 'Wooden pieces, paints, assembly guide, Mahabharata excerpt', 45, true),
('Rama-Sita Wedding Scene Kit', 'Recreate the divine wedding of Rama and Sita with this beautiful craft set featuring traditional designs.', 649, 'https://images.pexels.com/photos/4466208/pexels-photo-4466208.jpeg?auto=compress&cs=tinysrgb&w=800', 'Ramayana', '6-11 years', 'Paper dolls, decorative materials, glitter, story cards, frame', 35, false),
('Draupadi Rangoli Art Kit', 'Learn about Draupadi while creating stunning rangoli patterns inspired by ancient Indian art.', 449, 'https://images.pexels.com/photos/6045197/pexels-photo-6045197.jpeg?auto=compress&cs=tinysrgb&w=800', 'Mahabharata', '7-12 years', 'Colored sand, stencils, story booklet, practice sheets', 60, false),
('Ganesha Wisdom Kit', 'Craft your own Ganesha idol and learn about the remover of obstacles through stories and activities.', 529, 'https://images.pexels.com/photos/6045242/pexels-photo-6045242.jpeg?auto=compress&cs=tinysrgb&w=800', 'Bhagavatham', '5-10 years', 'Clay, tools, paints, instruction manual, story scroll', 55, true);