
import { Product, BlogPost, EquineEvent } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'ns-m1',
    sku: 'NS-882-M1',
    name: 'Nobel Spirit: Herbal Mash',
    category: 'Digestive',
    shortDescription: 'Premium herbal blend for all breeds of horses.',
    description: 'A high-fiber digestive aid utilizing a green herbal gradient matrix to support the sensitive equine gut during seasonal changes or recovery periods.',
    price: 185.00,
    image: 'https://images.unsplash.com/photo-1611080631319-3532726359e1?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?auto=format&fit=crop&q=80&w=800'
    ],
    benefits: ['Natural gut flora support', 'Highly digestible fiber', 'Herbal mineral matrix'],
    formula: 'Alfalfa, Timotej, Herb Mix (Peppermint, Fennel), Coconut Oil',
    ingredientDetails: [
      { name: 'Alfalfa', purpose: 'Provides high-quality protein and bio-available calcium for skeletal support.' },
      { name: 'Peppermint', purpose: 'Acts as a natural antispasmodic to soothe the digestive lining and stimulate appetite.' }
    ],
    usageDirections: 'Feed 100-200g per 100kg body weight. Soak with warm water.',
    stableTips: 'Excellent for masking medication or providing extra hydration.',
    weight: '15kg',
    form: 'Pellets',
    scienceNote: 'Zero added sugars. Controlled glycemic index.'
  },
  {
    id: 'ns-m2',
    sku: 'NS-941-M2',
    name: 'Nobel Spirit: Classic Mash',
    category: 'Metabolic',
    shortDescription: 'Energy-efficient recovery feed for performance horses.',
    description: 'A warm orange gradient formulation designed for rapid energy replenishment and metabolic stability following intense exertion.',
    price: 195.00,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800'
    ],
    benefits: ['Electrolyte balance', 'Muscle glycogen support', 'Rapid recovery'],
    formula: 'Micronized Corn, Rolled Oats, Apple Pomace, Linseed Oil',
    ingredientDetails: [
      { name: 'Micronized Corn', purpose: 'Gelatinized starch ensures 90%+ small intestine digestibility for rapid glycogen loading.' }
    ],
    usageDirections: 'Use as a reward or recovery meal after training.',
    stableTips: 'Best served warm for maximum palatability.',
    weight: '20kg',
    form: 'Powder',
    scienceNote: 'Optimized for post-exercise insulin sensitivity.'
  }
];

export const EQUINE_EVENTS: EquineEvent[] = [];
export const BLOG_POSTS: BlogPost[] = [];

// Populate Global Events (100+ items)
const eventRegions: EquineEvent['region'][] = ['Europe', 'Middle East', 'Americas', 'Asia'];
const eventCategories = ['Group 1 Racing', 'CSIO5* Show Jumping', 'World Cup Dressage', 'Polo Gold Cup'];
const eventLocations = ['Riyadh', 'Dubai', 'Chantilly', 'Lexington', 'Aachen'];

for (let i = 0; i < 105; i++) {
  const region = eventRegions[i % eventRegions.length];
  const category = eventCategories[i % eventCategories.length];
  const location = eventLocations[i % eventLocations.length];
  EQUINE_EVENTS.push({
    id: `ev-ext-${i}`,
    title: `Nobel Spirit ${category}: ${location} Protocol`,
    date: `2025-2026`,
    location: `${location} International Hub`,
    region: region,
    category: category,
    description: `An elite gathering focused on ${category.toLowerCase()} excellence.`,
    image: `https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&q=80&w=1200`,
    contactEmail: `concierge@nobelspirit.pl`,
    contactPhone: `+48 739 256 482`
  });
}

// Populate Research Blog
for (let i = 0; i < 110; i++) {
  BLOG_POSTS.push({
    id: `b-ext-${i}`,
    title: `Molecular Protocol Archive ${i + 1}`,
    summary: `Exploring the critical role of performance nutrition in elite equestrian sports.`,
    content: `Detailed laboratory analysis regarding the molecular influence of targeted nutrition...`,
    category: 'Nutrition',
    date: `2024`,
    image: `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800`
  });
}

const productCategories: Product['category'][] = ['Performance', 'Digestive', 'Orthopedic', 'Metabolic', 'Grooming'];
const archiveMockups = {
  Performance: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
  Digestive: 'https://images.unsplash.com/photo-1611080631319-3532726359e1?auto=format&fit=crop&q=80&w=800',
  Orthopedic: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=800',
  Metabolic: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
  Grooming: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&q=80&w=800'
};

for (let i = 0; i < 446; i++) {
  const category = productCategories[i % productCategories.length];
  const image = archiveMockups[category as keyof typeof archiveMockups];
  
  PRODUCTS.push({
    id: `ns-archive-${i}`,
    sku: `NS-ARC-${i.toString().padStart(3, '0')}`,
    name: `Nobel Spirit: Archive Protocol ${i + 1}`,
    category: category,
    shortDescription: `A precision ${category.toLowerCase()} tool centered around molecular delivery.`,
    description: `Developed in our laboratory facilities to support the equine ${category.toLowerCase()} system.`,
    price: 85 + (i * 1.5),
    image: image,
    benefits: ['Optimized absorption', `${category} maintenance`],
    formula: 'Standardized Nutrients, Bio-Carrier Complex',
    usageDirections: 'Feed based on metabolic feedback.',
    stableTips: 'Store in a cool, dry place.',
    weight: '5kg',
    form: 'Pellets',
    scienceNote: 'Batch stability verified via molecular assay.'
  });
}
