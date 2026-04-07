import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from './config/env';
import { Category } from './models/Category';
import { Product } from './models/Product';
import { User } from './models/User';

const categories = [
  { name: 'Sunglasses', slug: 'sunglasses' },
  { name: 'Prescription Frames', slug: 'prescription' },
  { name: 'Blue Light Glasses', slug: 'blue-light' },
  { name: 'Reading Glasses', slug: 'reading' },
  { name: 'Men', slug: 'men' },
  { name: 'Women', slug: 'women' },
  { name: 'Unisex', slug: 'unisex' },
  { name: 'Kids', slug: 'kids' },
];

const seed = async () => {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Category.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing data');

  // Create admin user
  await User.create({
    name: 'Admin',
    email: 'admin@optichub.com',
    password: 'admin123456',
    role: 'admin',
  });
  console.log('Created admin user: admin@optichub.com / admin123456');

  // Insert categories
  const createdCategories = await Category.insertMany(categories);
  console.log(`Created ${createdCategories.length} categories`);

  const getCatId = (slug: string) =>
    createdCategories.find((c) => c.slug === slug)?._id;

  // Sample products
  const products = [
    {
      name: 'AeroFrame Classic Aviator',
      slug: 'aeroframe-classic-aviator',
      description:
        'Timeless aviator silhouette with ultra-light metal frame. Polarized lenses block 99.9% of UV rays — perfect for driving and outdoor use. Adjustable nose pads for a custom fit.',
      price: 49.99,
      comparePrice: 89.99,
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80',
      ],
      featured: true,
      brand: 'AeroFrame',
      frameType: 'full-rim',
      frameMaterial: 'metal',
      frameColor: ['gold', 'black'],
      lensType: 'polarized',
      lensMaterial: 'polycarbonate',
      gender: 'unisex',
      shape: 'aviator',
      size: { lensWidth: 58, bridgeWidth: 14, templeLength: 135, label: 'M' },
      weight: 22,
      prescriptionSupported: false,
      blueLightFilter: false,
      antiGlare: true,
      uvProtection: true,
      styleTags: ['classic', 'outdoor', 'sporty'],
      faceShapeRecommendation: ['oval', 'heart', 'square'],
      category: getCatId('sunglasses'),
      stock: 50,
      supplierName: 'mock',
      supplierProductId: 'MOCK-001',
      supplierPrice: 12.0,
      supplierLink: '',
      estimatedShippingTime: '7-14 business days',
    },
    {
      name: 'VisionPro Round Blue Light',
      slug: 'visionpro-round-blue-light',
      description:
        'Protect your eyes from screen fatigue with these stylish round frames. Built-in blue light filter reduces eye strain during long work sessions. Lightweight TR90 frame.',
      price: 34.99,
      comparePrice: 59.99,
      images: [
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80',
      ],
      featured: true,
      brand: 'VisionPro',
      frameType: 'full-rim',
      frameMaterial: 'tr90',
      frameColor: ['black', 'tortoise'],
      lensType: 'clear',
      lensMaterial: 'polycarbonate',
      gender: 'unisex',
      shape: 'round',
      size: { lensWidth: 48, bridgeWidth: 18, templeLength: 140, label: 'S' },
      weight: 18,
      prescriptionSupported: true,
      blueLightFilter: true,
      antiGlare: true,
      uvProtection: false,
      styleTags: ['minimalist', 'office', 'trendy'],
      faceShapeRecommendation: ['square', 'rectangle', 'oval'],
      category: getCatId('blue-light'),
      stock: 80,
      supplierName: 'mock',
      supplierProductId: 'MOCK-002',
      supplierPrice: 8.0,
      supplierLink: '',
      estimatedShippingTime: '5-10 business days',
    },
    {
      name: 'LuxeView Cat-Eye Rose',
      slug: 'luxeview-cat-eye-rose',
      description:
        'Elegant cat-eye acetate frames with a modern feminine touch. Premium Italian acetate with spring hinges for all-day comfort. Available in rich rose and classic tortoise.',
      price: 64.99,
      comparePrice: 110.0,
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
        'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80',
      ],
      featured: true,
      brand: 'LuxeView',
      frameType: 'full-rim',
      frameMaterial: 'acetate',
      frameColor: ['rose', 'tortoise'],
      lensType: 'clear',
      lensMaterial: 'cr39',
      gender: 'women',
      shape: 'cat-eye',
      size: { lensWidth: 52, bridgeWidth: 17, templeLength: 140, label: 'M' },
      weight: 25,
      prescriptionSupported: true,
      blueLightFilter: false,
      antiGlare: true,
      uvProtection: false,
      styleTags: ['elegant', 'feminine', 'vintage'],
      faceShapeRecommendation: ['round', 'oval', 'heart'],
      category: getCatId('prescription'),
      stock: 35,
      supplierName: 'mock',
      supplierProductId: 'MOCK-003',
      supplierPrice: 15.0,
      supplierLink: '',
      estimatedShippingTime: '7-14 business days',
    },
    {
      name: 'UrbanEdge Square Titanium',
      slug: 'urbanedge-square-titanium',
      description:
        'Premium titanium frames with a bold square silhouette. Ultra-lightweight yet incredibly durable. Anti-reflective coating for sharp, clear vision in all conditions.',
      price: 89.99,
      comparePrice: 149.99,
      images: [
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
        'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&q=80',
      ],
      featured: true,
      brand: 'UrbanEdge',
      frameType: 'full-rim',
      frameMaterial: 'titanium',
      frameColor: ['silver', 'gunmetal'],
      lensType: 'clear',
      lensMaterial: 'trivex',
      gender: 'men',
      shape: 'square',
      size: { lensWidth: 54, bridgeWidth: 16, templeLength: 145, label: 'L' },
      weight: 15,
      prescriptionSupported: true,
      blueLightFilter: true,
      antiGlare: true,
      uvProtection: false,
      styleTags: ['professional', 'minimal', 'premium'],
      faceShapeRecommendation: ['oval', 'round', 'heart'],
      category: getCatId('prescription'),
      stock: 25,
      supplierName: 'mock',
      supplierProductId: 'MOCK-004',
      supplierPrice: 22.0,
      supplierLink: '',
      estimatedShippingTime: '7-14 business days',
    },
    {
      name: 'SunShield Wayfarer Black',
      slug: 'sunshield-wayfarer-black',
      description:
        'Iconic wayfarer style with polarized UV400 lenses. Thick acetate frame built to last. The perfect everyday sunglass for any occasion.',
      price: 44.99,
      comparePrice: 79.99,
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80',
      ],
      featured: false,
      brand: 'SunShield',
      frameType: 'full-rim',
      frameMaterial: 'acetate',
      frameColor: ['black'],
      lensType: 'polarized',
      lensMaterial: 'polycarbonate',
      gender: 'unisex',
      shape: 'wayfarer',
      size: { lensWidth: 54, bridgeWidth: 18, templeLength: 145, label: 'M' },
      weight: 28,
      prescriptionSupported: false,
      blueLightFilter: false,
      antiGlare: false,
      uvProtection: true,
      styleTags: ['classic', 'bold', 'casual'],
      faceShapeRecommendation: ['oval', 'square', 'heart'],
      category: getCatId('sunglasses'),
      stock: 100,
      supplierName: 'mock',
      supplierProductId: 'MOCK-005',
      supplierPrice: 10.0,
      supplierLink: '',
      estimatedShippingTime: '5-10 business days',
    },
    {
      name: 'ClearSight Reading +2.0',
      slug: 'clearsight-reading-2',
      description:
        'Lightweight reading glasses with a slim rectangular frame. Anti-scratch, anti-reflective lenses for sharp, comfortable reading. Available in multiple strengths.',
      price: 24.99,
      comparePrice: 39.99,
      images: [
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80',
        'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80',
      ],
      featured: false,
      brand: 'ClearSight',
      frameType: 'half-rim',
      frameMaterial: 'metal',
      frameColor: ['silver', 'rose-gold'],
      lensType: 'clear',
      lensMaterial: 'polycarbonate',
      gender: 'unisex',
      shape: 'rectangle',
      size: { lensWidth: 50, bridgeWidth: 17, templeLength: 138, label: 'M' },
      weight: 16,
      prescriptionSupported: true,
      blueLightFilter: false,
      antiGlare: true,
      uvProtection: false,
      styleTags: ['functional', 'lightweight', 'everyday'],
      faceShapeRecommendation: ['round', 'oval', 'square'],
      category: getCatId('reading'),
      stock: 120,
      supplierName: 'mock',
      supplierProductId: 'MOCK-006',
      supplierPrice: 6.0,
      supplierLink: '',
      estimatedShippingTime: '5-7 business days',
    },
    {
      name: 'KidZone Flex Round Blue',
      slug: 'kidzone-flex-round-blue',
      description:
        'Durable flexible TR90 frames designed for active kids. Soft silicone nose pads and temple tips for a secure, comfortable fit. Blue light filter protects young eyes from screens.',
      price: 29.99,
      comparePrice: 49.99,
      images: [
        'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=800&q=80',
      ],
      featured: false,
      brand: 'KidZone',
      frameType: 'full-rim',
      frameMaterial: 'tr90',
      frameColor: ['blue', 'red', 'green'],
      lensType: 'clear',
      lensMaterial: 'polycarbonate',
      gender: 'kids',
      shape: 'round',
      size: { lensWidth: 44, bridgeWidth: 15, templeLength: 125, label: 'XS' },
      weight: 14,
      prescriptionSupported: true,
      blueLightFilter: true,
      antiGlare: true,
      uvProtection: false,
      styleTags: ['kids', 'flexible', 'colorful'],
      faceShapeRecommendation: ['oval', 'round', 'square'],
      category: getCatId('kids'),
      stock: 60,
      supplierName: 'mock',
      supplierProductId: 'MOCK-007',
      supplierPrice: 7.0,
      supplierLink: '',
      estimatedShippingTime: '5-10 business days',
    },
    {
      name: 'OptiGlam Oval Wood',
      slug: 'optiglam-oval-wood',
      description:
        'Handcrafted bamboo wood frames for an eco-conscious, one-of-a-kind look. Each pair is unique with natural wood grain patterns. Feather-light at just 18g.',
      price: 74.99,
      comparePrice: 119.99,
      images: [
        'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80',
      ],
      featured: true,
      brand: 'OptiGlam',
      frameType: 'full-rim',
      frameMaterial: 'wood',
      frameColor: ['natural-wood', 'dark-wood'],
      lensType: 'clear',
      lensMaterial: 'cr39',
      gender: 'unisex',
      shape: 'oval',
      size: { lensWidth: 50, bridgeWidth: 18, templeLength: 142, label: 'M' },
      weight: 18,
      prescriptionSupported: true,
      blueLightFilter: false,
      antiGlare: true,
      uvProtection: false,
      styleTags: ['eco', 'unique', 'handcrafted'],
      faceShapeRecommendation: ['square', 'rectangle', 'heart'],
      category: getCatId('prescription'),
      stock: 20,
      supplierName: 'mock',
      supplierProductId: 'MOCK-008',
      supplierPrice: 18.0,
      supplierLink: '',
      estimatedShippingTime: '10-14 business days',
    },
  ];

  await Product.insertMany(products);
  console.log(`Created ${products.length} products`);
  console.log('Seed complete!');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
