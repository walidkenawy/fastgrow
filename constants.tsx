
import { Product, BlogPost, EquineEvent } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'ns-m1',
    name: 'Nobel Spirit: Herbal Mash',
    category: 'Digestive',
    shortDescription: 'Premium herbal blend for all breeds of horses.',
    description: 'A high-fiber digestive aid utilizing a green herbal gradient matrix to support the sensitive equine gut during seasonal changes or recovery periods.',
    price: 185.00,
    image: 'https://images.unsplash.com/photo-1550573104-4eb82614b3d7?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1598974357851-984447633303?auto=format&fit=crop&q=80&w=800'
    ],
    benefits: ['Natural gut flora support', 'Highly digestible fiber', 'Herbal mineral matrix'],
    formula: 'Alfalfa, Timotej, Herb Mix (Peppermint, Fennel), Coconut Oil',
    ingredientDetails: [
      { name: 'Alfalfa', purpose: 'Provides high-quality protein and bio-available calcium for skeletal support.' },
      { name: 'Peppermint', purpose: 'Acts as a natural antispasmodic to soothe the digestive lining and stimulate appetite.' },
      { name: 'Fennel', purpose: 'Supports gas reduction and intestinal mobility in horses prone to digestive stasis.' },
      { name: 'Coconut Oil', purpose: 'Delivers medium-chain triglycerides (MCTs) for cool energy without glycemic spikes.' }
    ],
    usageDirections: 'Feed 100-200g per 100kg body weight. Soak with warm water.',
    stableTips: 'Excellent for masking medication or providing extra hydration.',
    weight: '15kg',
    form: 'Pellets',
    scienceNote: 'Zero added sugars. Controlled glycemic index.'
  },
  {
    id: 'ns-m2',
    name: 'Nobel Spirit: Classic Mash',
    category: 'Metabolic',
    shortDescription: 'Energy-efficient recovery feed for performance horses.',
    description: 'A warm orange gradient formulation designed for rapid energy replenishment and metabolic stability following intense exertion.',
    price: 195.00,
    image: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1598463162330-81912f293998?auto=format&fit=crop&q=80&w=800'
    ],
    benefits: ['Electrolyte balance', 'Muscle glycogen support', 'Rapid recovery'],
    formula: 'Micronized Corn, Rolled Oats, Apple Pomace, Linseed Oil',
    ingredientDetails: [
      { name: 'Micronized Corn', purpose: 'Gelatinized starch ensures 90%+ small intestine digestibility for rapid glycogen loading.' },
      { name: 'Apple Pomace', purpose: 'Pectin-rich fiber that forms a protective gel layer on the gastric mucosa.' },
      { name: 'Linseed Oil', purpose: 'High Omega-3 content to reduce systemic inflammation post-exercise.' },
      { name: 'Oats', purpose: 'Controlled release of energy to maintain metabolic focus during recovery.' }
    ],
    usageDirections: 'Use as a reward or recovery meal after training. 500g-1kg per serving.',
    stableTips: 'Best served warm for maximum palatability.',
    weight: '20kg',
    form: 'Powder',
    scienceNote: 'Optimized for post-exercise insulin sensitivity.'
  },
  {
    id: 'ns-m3',
    name: 'Nobel Spirit: Digestive Mash',
    category: 'Digestive',
    shortDescription: 'Advanced mucosal protection with Lucern Coco Oil.',
    description: 'A soft yellow gradient formulation incorporating Nuba Chaff technology for superior gastric lining protection.',
    price: 210.00,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550573104-4eb82614b3d7?auto=format&fit=crop&q=80&w=800'
    ],
    benefits: ['Gastric pH buffering', 'Lucern fiber coating', 'Bio-available healthy fats'],
    formula: 'Lucern, Coconut Oil, Magnesium Oxide, Pro-biotics',
    ingredientDetails: [
      { name: 'Lucern (Alfalfa)', purpose: 'High buffering capacity neutralizes excess gastric acid during stabling.' },
      { name: 'Magnesium Oxide', purpose: 'Stabilizes the nervous system and supports optimal gastric muscle relaxation.' },
      { name: 'Live Pro-biotics', purpose: 'Saccharomyces cerevisiae strains to stabilize hindgut microflora.' },
      { name: 'Bentonite', purpose: 'Natural toxin binder to assist in intestinal detoxification.' }
    ],
    usageDirections: 'Ideal for horses prone to gastric discomfort or stabled for long periods.',
    stableTips: 'Mix with Lucern Chaff for increased chewing time.',
    weight: '15kg',
    form: 'Pellets',
    scienceNote: 'Incorporates marine calcium for sustained acid neutralization.'
  },
  {
    id: 'ns-p1',
    name: 'Nobel Spirit: Velocity Elite',
    category: 'Performance',
    shortDescription: 'High-octane anaerobic fuel for elite competition.',
    description: 'A revolutionary combination of nano-encapsulated energy sources and BCAA complexes designed to sustain peak performance.',
    price: 345.00,
    image: 'https://images.unsplash.com/photo-1606822459740-15ec84df244d?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1598974357851-984447633303?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800'
    ],
    benefits: ['Delayed lactate accumulation', 'Explosive muscle recruitment', 'Optimized glycogen recovery'],
    formula: 'Micronized L-Glutamine, Beta-Alanine, Citrulline Malate, MCT Oil',
    ingredientDetails: [
      { name: 'Beta-Alanine', purpose: 'Increases muscle carnosine levels to buffer lactic acid during anaerobic work.' },
      { name: 'L-Glutamine', purpose: 'Supports muscle tissue repair and immune function during high-stress competition.' },
      { name: 'Citrulline Malate', purpose: 'Improves nitric oxide production for enhanced muscle oxygenation.' }
    ],
    usageDirections: '50g daily loading. 100g on competition days.',
    stableTips: 'Combine with high-quality timothy hay for optimal gastric absorption.',
    weight: '5kg',
    form: 'Powder',
    scienceNote: 'Tested for purity in WADA-accredited laboratories. 0% prohibited substances.'
  }
];

export const EQUINE_EVENTS: EquineEvent[] = [
  {
    id: 'ev-arab-1',
    title: 'The Saudi Cup 2026',
    date: 'February 2026',
    location: 'King Abdulaziz Racetrack, Riyadh',
    region: 'Middle East',
    category: 'Racing',
    description: 'The world\'s most valuable horse race. Peak performance and metabolic precision are mandatory in the desert climate.',
    image: 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&q=80&w=1200',
    registrationUrl: 'https://thesaudicup.com.sa',
    contactEmail: 'entries@thesaudicup.com.sa',
    contactPhone: '+966 11 123 4567'
  },
  {
    id: 'ev-arab-2',
    title: 'Dubai World Cup 2026',
    date: 'March 2026',
    location: 'Meydan Racetrack, Dubai',
    region: 'Middle East',
    category: 'Racing',
    description: 'A global masterpiece of racing, where elite thoroughbreds compete for the ultimate desert crown.',
    image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=1200',
    registrationUrl: 'https://dubaiworldcup.com',
    contactEmail: 'concierge@meydan.ae',
    contactPhone: '+971 4 327 0000'
  },
  {
    id: 'ev-arab-3',
    title: 'LGCT Doha Finale 2026',
    date: 'March 2026',
    location: 'Al Shaqab, Doha',
    region: 'Middle East',
    category: 'Show Jumping',
    description: 'The spectacular finale of the Longines Global Champions Tour at the world\'s most advanced equestrian facility.',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200',
    registrationUrl: 'https://gcglobalchampions.com',
    contactEmail: 'info@alshaqab.com',
    contactPhone: '+974 4454 1992'
  }
];

// PROGRAMMATIC EXPANSION
const genericRegions = ['Europe', 'Americas', 'Asia', 'Middle East'] as const;
const disciplines = ['Show Jumping', 'Dressage', 'Eventing', 'Racing', 'Polo'];
const venues = [
  'Paris, France', 'London, UK', 'New York, USA', 'Tokyo, Japan', 
  'Sydney, Australia', 'Milan, Italy', 'Madrid, Spain', 'Wellington, USA',
  'Calgary, Canada', 'Hong Kong, HK', 'Seoul, South Korea', 'Melbourne, Australia'
];

for (let i = 0; i < 50; i++) {
  const region = genericRegions[i % genericRegions.length];
  const discipline = disciplines[i % disciplines.length];
  const venue = venues[i % venues.length];
  
  EQUINE_EVENTS.push({
    id: `ev-gen-2026-${i}`,
    title: `International ${discipline} Masters: ${venue.split(',')[0]}`,
    date: `${['April', 'May', 'June', 'July', 'September', 'October'][i % 6]} 2026`,
    location: venue,
    region: region,
    category: discipline,
    description: `A critical 2026 stop on the international circuit. High-level protocol synchronization required for cross-continental transit.`,
    image: `https://images.unsplash.com/photo-${1550000000000 + (i * 1000)}?auto=format&fit=crop&q=80&w=1200`,
    registrationUrl: `https://fei.org/events/masters-${i}`,
    contactEmail: `registrations@${venue.split(',')[0].toLowerCase()}masters.com`,
    contactPhone: `+48 739 256 482` // Default Lab Support
  });
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b-30',
    title: 'Precision in the Polish Highlands: Cold-Press Technology',
    summary: 'Discover the engineering behind the Nobel Spirit production line, where temperature control meets molecular integrity.',
    content: 'Full analysis of cold-press synthesis...',
    category: 'Nutrition',
    date: '28.05.2024',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b-29',
    title: 'WADA Compliance: Navigating Prohibited Substance Controls',
    summary: 'How Nobel Spirit laboratories achieve 0% contamination rates for international Olympic-tier competitors.',
    content: 'Deep dive into laboratory assay cycles...',
    category: 'Veterinary',
    date: '26.05.2024',
    image: 'https://images.unsplash.com/photo-1579154273821-ad921398a1ec?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b-28',
    title: 'The Glycogen Window: Optimizing Post-Training Recovery',
    summary: 'Utilizing Nobel Spirit Classic Mash to accelerate glycogen loading within the critical 60-minute recovery window.',
    content: 'Scientific paper on muscle recovery...',
    category: 'Performance',
    date: '24.05.2024',
    image: 'https://images.unsplash.com/photo-1598974357851-984447633303?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b-27',
    title: 'Bio-Available Mineral Matrix: Beyond Standard Supplements',
    summary: 'Exploring the proprietary Nobel Spirit carrier system that ensures 98% bioavailability of essential trace elements.',
    content: 'Molecular analysis of carrier systems...',
    category: 'Nutrition',
    date: '22.05.2024',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b-26',
    title: 'Gastric Mucosal Protection: The Chaff Protocol',
    summary: 'How Nobel Spirit Digestive Mash creates a physical and chemical buffer against gastric acid spikes.',
    content: 'Clinical review of gastric pH buffering...',
    category: 'Veterinary',
    date: '20.05.2024',
    image: 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b-25',
    title: 'Anaerobic Thresholds: Sustaining Velocity in Racing',
    summary: 'The role of Beta-Alanine in Nobel Spirit Velocity Elite for high-intensity anaerobic performance.',
    content: 'Analysis of lactate buffering...',
    category: 'Performance',
    date: '18.05.2024',
    image: 'https://images.unsplash.com/photo-1606822459740-15ec84df244d?auto=format&fit=crop&q=80&w=800'
  }
];

const prefixes = ['Nobel Spirit:', 'Nobel Labs:', 'Nobel Science:', 'Nobel Pro:', 'Nobel Elite:'];
const ingredientsList = ['Biotin', 'Magnesium', 'Zinc', 'Vitamin E', 'Selenium', 'Omega-3', 'MSM', 'Glucosamine'];
const productCategories: Product['category'][] = ['Performance', 'Digestive', 'Orthopedic', 'Metabolic', 'Grooming'];

const archiveMockups = {
  Performance: 'https://images.unsplash.com/photo-1606822459740-15ec84df244d?auto=format&fit=crop&q=80&w=800',
  Digestive: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&q=80&w=800',
  Orthopedic: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
  Metabolic: 'https://images.unsplash.com/photo-1550573104-4eb82614b3d7?auto=format&fit=crop&q=80&w=800',
  Grooming: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&q=80&w=800'
};

for (let i = 0; i < 446; i++) {
  const category = productCategories[i % productCategories.length];
  const image = archiveMockups[category as keyof typeof archiveMockups];
  
  PRODUCTS.push({
    id: `ns-archive-${i}`,
    name: `${prefixes[i % prefixes.length]} ${ingredientsList[i % ingredientsList.length]} Protocol`,
    category: category,
    shortDescription: `A precision ${category.toLowerCase()} tool centered around molecular delivery.`,
    description: `Developed in our laboratory facilities to support the equine ${category.toLowerCase()} system during peak training cycles.`,
    price: 85 + (i * 1.5),
    image: image,
    benefits: ['Optimized absorption', `${category} maintenance`, 'Verified purity'],
    formula: 'Standardized Nutrients, Bio-Carrier Complex',
    usageDirections: 'Feed 20-50g daily based on metabolic feedback.',
    stableTips: 'Store in a cool, dry place away from direct sunlight.',
    weight: '5kg',
    form: 'Pellets',
    scienceNote: 'Batch stability verified via molecular assay.'
  });
}
