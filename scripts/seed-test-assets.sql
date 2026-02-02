-- Seed Test Assets for StocksOcean Marketplace
-- This script creates sample assets for testing the website
-- Run this in your Supabase SQL Editor

-- First, ensure you have a test user (replace with your actual user ID or create one)
-- You can get a user ID from auth.users table

-- Example: Insert test assets
-- Replace 'YOUR_USER_ID_HERE' with an actual user ID from auth.users

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
-- Image Assets
(
  (SELECT id FROM auth.users LIMIT 1), -- Use first user or replace with specific ID
  'Abstract Blue Gradient Background',
  'A beautiful abstract gradient background in shades of blue, perfect for modern web designs and presentations.',
  'image',
  'contributors/test/abstract-blue-gradient.jpg',
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
  9.99,
  'standard',
  'approved',
  ARRAY['abstract', 'gradient', 'blue', 'background', 'modern'],
  125,
  23,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Minimalist Office Workspace',
  'Clean and professional office workspace photo, ideal for business websites and presentations.',
  'image',
  'contributors/test/minimalist-office.jpg',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  12.99,
  'standard',
  'approved',
  ARRAY['office', 'workspace', 'minimalist', 'business', 'professional'],
  89,
  15,
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '4 days'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Mountain Landscape at Sunset',
  'Stunning mountain landscape photograph taken at golden hour, perfect for nature-themed projects.',
  'image',
  'contributors/test/mountain-sunset.jpg',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  15.99,
  'standard',
  'approved',
  ARRAY['mountain', 'landscape', 'sunset', 'nature', 'outdoor'],
  203,
  42,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Modern UI Design Mockup',
  'Professional UI design mockup showcasing a modern dashboard interface.',
  'image',
  'contributors/test/ui-mockup.jpg',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  19.99,
  'standard',
  'approved',
  ARRAY['ui', 'design', 'mockup', 'dashboard', 'interface'],
  156,
  28,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'City Skyline at Night',
  'Beautiful city skyline photograph taken at night with city lights, perfect for urban-themed designs.',
  'image',
  'contributors/test/city-night.jpg',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800',
  14.99,
  'standard',
  'approved',
  ARRAY['city', 'skyline', 'night', 'urban', 'lights'],
  178,
  31,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),
-- Video Assets
(
  (SELECT id FROM auth.users LIMIT 1),
  'Abstract Motion Graphics',
  'Smooth abstract motion graphics animation, perfect for video backgrounds and presentations.',
  'video',
  'contributors/test/abstract-motion.mp4',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
  24.99,
  'standard',
  'approved',
  ARRAY['video', 'animation', 'abstract', 'motion', 'graphics'],
  67,
  12,
  NOW() - INTERVAL '6 days',
  NOW() - INTERVAL '6 days'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Nature Time-lapse Video',
  'Beautiful time-lapse video of nature scenes including clouds, trees, and landscapes.',
  'video',
  'contributors/test/nature-timelapse.mp4',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
  29.99,
  'standard',
  'approved',
  ARRAY['video', 'timelapse', 'nature', 'landscape', 'outdoor'],
  94,
  18,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
),
-- 3D Assets
(
  (SELECT id FROM auth.users LIMIT 1),
  'Modern Chair 3D Model',
  'High-quality 3D model of a modern minimalist chair, ready for use in architectural visualizations.',
  '3d',
  'contributors/test/modern-chair.glb',
  'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
  34.99,
  'standard',
  'approved',
  ARRAY['3d', 'chair', 'furniture', 'model', 'interior'],
  45,
  8,
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Abstract Geometric Shape',
  'Stylish abstract geometric 3D shape perfect for modern design projects and visualizations.',
  '3d',
  'contributors/test/geometric-shape.glb',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
  27.99,
  'standard',
  'approved',
  ARRAY['3d', 'geometric', 'abstract', 'shape', 'modern'],
  52,
  9,
  NOW() - INTERVAL '9 days',
  NOW() - INTERVAL '9 days'
),
-- More images for variety
(
  (SELECT id FROM auth.users LIMIT 1),
  'Coffee Cup on Wooden Table',
  'Professional product photography of a coffee cup on a wooden table, perfect for e-commerce and food blogs.',
  'image',
  'contributors/test/coffee-cup.jpg',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
  8.99,
  'standard',
  'approved',
  ARRAY['coffee', 'product', 'photography', 'food', 'lifestyle'],
  142,
  25,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Tropical Beach Paradise',
  'Stunning tropical beach photograph with crystal clear water and palm trees.',
  'image',
  'contributors/test/tropical-beach.jpg',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  16.99,
  'standard',
  'approved',
  ARRAY['beach', 'tropical', 'vacation', 'ocean', 'paradise'],
  267,
  51,
  NOW() - INTERVAL '11 days',
  NOW() - INTERVAL '11 days'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Tech Startup Office',
  'Modern tech startup office space with collaborative work areas and modern design.',
  'image',
  'contributors/test/tech-office.jpg',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
  13.99,
  'standard',
  'approved',
  ARRAY['office', 'tech', 'startup', 'workspace', 'modern'],
  98,
  17,
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '12 days'
);

-- Note: The preview_path URLs use Unsplash placeholder images
-- In production, you would upload actual files to Supabase Storage
-- and use the public URLs from your storage bucket

