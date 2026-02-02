/**
 * Quick Script to Seed 10 Test Assets
 * 
 * This script can be run in the browser console on your Supabase dashboard
 * or adapted to run via Supabase client
 * 
 * Instructions:
 * 1. Go to Supabase Dashboard → SQL Editor
 * 2. Copy and paste the SQL from scripts/seed-10-test-assets.sql
 * 3. Run the SQL script
 * 
 * OR use this Node.js script (requires Supabase client setup):
 */

// This is a reference script - the SQL version is recommended
// To use this, you would need to set up Supabase client with service role key

const testAssets = [
  {
    title: 'Abstract Blue Gradient Background',
    description: 'A beautiful abstract gradient background in shades of blue, perfect for modern web designs, presentations, and digital art projects.',
    type: 'image',
    preview_path: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80',
    price: 9.99,
    tags: ['abstract', 'gradient', 'blue', 'background', 'modern', 'design'],
  },
  {
    title: 'Minimalist Office Workspace',
    description: 'Clean and professional office workspace photo with modern furniture and natural lighting.',
    type: 'image',
    preview_path: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    price: 12.99,
    tags: ['office', 'workspace', 'minimalist', 'business', 'professional'],
  },
  {
    title: 'Mountain Landscape at Sunset',
    description: 'Stunning mountain landscape photograph taken at golden hour with dramatic sky.',
    type: 'image',
    preview_path: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    price: 15.99,
    tags: ['mountain', 'landscape', 'sunset', 'nature', 'outdoor'],
  },
  {
    title: 'Modern UI Design Mockup',
    description: 'Professional UI design mockup showcasing a modern dashboard interface.',
    type: 'image',
    preview_path: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    price: 19.99,
    tags: ['ui', 'design', 'mockup', 'dashboard', 'interface'],
  },
  {
    title: 'City Skyline at Night',
    description: 'Beautiful city skyline photograph taken at night with city lights.',
    type: 'image',
    preview_path: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
    price: 14.99,
    tags: ['city', 'skyline', 'night', 'urban', 'lights'],
  },
  {
    title: 'Coffee Cup on Wooden Table',
    description: 'Professional product photography of a coffee cup on a wooden table.',
    type: 'image',
    preview_path: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
    price: 8.99,
    tags: ['coffee', 'product', 'photography', 'food', 'lifestyle'],
  },
  {
    title: 'Tropical Beach Paradise',
    description: 'Stunning tropical beach photograph with crystal clear water and white sand.',
    type: 'image',
    preview_path: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    price: 16.99,
    tags: ['beach', 'tropical', 'vacation', 'ocean', 'paradise'],
  },
  {
    title: 'Abstract Motion Graphics Animation',
    description: 'Smooth abstract motion graphics animation with flowing colors and shapes.',
    type: 'video',
    preview_path: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    price: 24.99,
    tags: ['video', 'animation', 'abstract', 'motion', 'graphics'],
  },
  {
    title: 'Nature Time-lapse Video',
    description: 'Beautiful time-lapse video of nature scenes including clouds and landscapes.',
    type: 'video',
    preview_path: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    price: 29.99,
    tags: ['video', 'timelapse', 'nature', 'landscape', 'outdoor'],
  },
  {
    title: 'Modern Chair 3D Model',
    description: 'High-quality 3D model of a modern minimalist chair with clean lines.',
    type: '3d',
    preview_path: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    price: 34.99,
    tags: ['3d', 'chair', 'furniture', 'model', 'interior'],
  },
]

console.log('Test assets data prepared. Use the SQL script for best results.')

