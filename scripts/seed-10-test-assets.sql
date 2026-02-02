-- Seed 10 Test Assets for StocksOcean Marketplace
-- This script creates 10 sample assets with real Unsplash image URLs for testing
-- Run this in your Supabase SQL Editor

-- First, get a user ID (replace with your actual user ID or use the first user)
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Get the first user from auth.users, or use a specific user ID
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  -- If no user exists, you'll need to create one first or replace with a specific UUID
  IF test_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please create a user first or replace test_user_id with a specific UUID.';
  END IF;

  -- Insert 10 test assets with Unsplash placeholder images
  INSERT INTO assets (
    contributor_id,
    title,
    description,
    type,
    storage_path,
    preview_path,
    price,
    license,
    status,
    tags,
    views,
    downloads,
    created_at,
    updated_at
  ) VALUES
  -- Image Assets (1-7)
  (
    test_user_id,
    'Abstract Blue Gradient Background',
    'A beautiful abstract gradient background in shades of blue, perfect for modern web designs, presentations, and digital art projects. High resolution and ready to use.',
    'image',
    'contributors/test/abstract-blue-gradient.jpg',
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80',
    9.99,
    'standard',
    'approved',
    ARRAY['abstract', 'gradient', 'blue', 'background', 'modern', 'design'],
    125,
    23,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  ),
  (
    test_user_id,
    'Minimalist Office Workspace',
    'Clean and professional office workspace photo with modern furniture and natural lighting. Ideal for business websites, presentations, and corporate materials.',
    'image',
    'contributors/test/minimalist-office.jpg',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    12.99,
    'standard',
    'approved',
    ARRAY['office', 'workspace', 'minimalist', 'business', 'professional', 'modern'],
    89,
    15,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
  ),
  (
    test_user_id,
    'Mountain Landscape at Sunset',
    'Stunning mountain landscape photograph taken at golden hour with dramatic sky. Perfect for nature-themed projects, travel blogs, and outdoor advertising.',
    'image',
    'contributors/test/mountain-sunset.jpg',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    15.99,
    'standard',
    'approved',
    ARRAY['mountain', 'landscape', 'sunset', 'nature', 'outdoor', 'travel'],
    203,
    42,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    test_user_id,
    'Modern UI Design Mockup',
    'Professional UI design mockup showcasing a modern dashboard interface with clean lines and contemporary design elements. Perfect for tech presentations.',
    'image',
    'contributors/test/ui-mockup.jpg',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    19.99,
    'standard',
    'approved',
    ARRAY['ui', 'design', 'mockup', 'dashboard', 'interface', 'tech'],
    156,
    28,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    test_user_id,
    'City Skyline at Night',
    'Beautiful city skyline photograph taken at night with city lights and urban atmosphere. Perfect for urban-themed designs, travel content, and city branding.',
    'image',
    'contributors/test/city-night.jpg',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
    14.99,
    'standard',
    'approved',
    ARRAY['city', 'skyline', 'night', 'urban', 'lights', 'architecture'],
    178,
    31,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    test_user_id,
    'Coffee Cup on Wooden Table',
    'Professional product photography of a coffee cup on a wooden table with soft lighting. Perfect for e-commerce, food blogs, and lifestyle content.',
    'image',
    'contributors/test/coffee-cup.jpg',
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
    8.99,
    'standard',
    'approved',
    ARRAY['coffee', 'product', 'photography', 'food', 'lifestyle', 'minimalist'],
    142,
    25,
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '6 days'
  ),
  (
    test_user_id,
    'Tropical Beach Paradise',
    'Stunning tropical beach photograph with crystal clear water, white sand, and palm trees. Ideal for travel websites, vacation promotions, and tropical themes.',
    'image',
    'contributors/test/tropical-beach.jpg',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    16.99,
    'standard',
    'approved',
    ARRAY['beach', 'tropical', 'vacation', 'ocean', 'paradise', 'travel'],
    267,
    51,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days'
  ),
  -- Video Assets (8-9)
  (
    test_user_id,
    'Abstract Motion Graphics Animation',
    'Smooth abstract motion graphics animation with flowing colors and shapes. Perfect for video backgrounds, presentations, and digital art projects. 4K quality.',
    'video',
    'contributors/test/abstract-motion.mp4',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    24.99,
    'standard',
    'approved',
    ARRAY['video', 'animation', 'abstract', 'motion', 'graphics', '4k'],
    67,
    12,
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '8 days'
  ),
  (
    test_user_id,
    'Nature Time-lapse Video',
    'Beautiful time-lapse video of nature scenes including clouds, trees, and landscapes. Perfect for documentaries, nature content, and background videos.',
    'video',
    'contributors/test/nature-timelapse.mp4',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    29.99,
    'standard',
    'approved',
    ARRAY['video', 'timelapse', 'nature', 'landscape', 'outdoor', 'cinematic'],
    94,
    18,
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '9 days'
  ),
  -- 3D Asset (10)
  (
    test_user_id,
    'Modern Chair 3D Model',
    'High-quality 3D model of a modern minimalist chair with clean lines. Ready for use in architectural visualizations, interior design projects, and 3D renders.',
    '3d',
    'contributors/test/modern-chair.glb',
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    34.99,
    'standard',
    'approved',
    ARRAY['3d', 'chair', 'furniture', 'model', 'interior', 'architecture'],
    45,
    8,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Successfully inserted 10 test assets for user: %', test_user_id;
END $$;

-- Verify the assets were created
SELECT 
  id,
  title,
  type,
  price,
  status,
  views,
  downloads,
  created_at
FROM assets
ORDER BY created_at DESC
LIMIT 10;

