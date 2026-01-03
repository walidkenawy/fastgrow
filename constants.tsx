
import { Product, BlogPost, EquineEvent } from './types';

// ELITE PROTOCOL IMAGE ARCHIVE
const PROTOCOL_IMAGES = [
  'input_file_0.png', 'input_file_1.png', 'input_file_2.png', 'input_file_3.png', 'input_file_4.png',
  'input_file_5.png', 'input_file_6.png', 'input_file_7.png', 'input_file_8.png', 'input_file_9.png',
];

const generateProductArchive = (): Product[] => {
  const products: Product[] = [];
  const categories: Product['category'][] = ['Performance', 'Digestive', 'Orthopedic', 'Metabolic', 'Grooming'];
  const forms: Product['form'][] = ['Pellets', 'Powder', 'Liquid', 'Spray'];
  const prefixes = ['Nobel Spirit', 'Nobel Pro', 'Molecular', 'Performance', 'Bio-Active', 'Synergy', 'Precision', 'Advanced'];
  const baseNames = ['Omega-3', 'Vitamin E', 'Glucosamine', 'Zinc', 'Magnesium', 'MSM', 'Selenium', 'Amino-Acid'];
  const suffixes = ['Protocol', 'Matrix', 'Complex', 'Synthesizer', 'Integrator', 'Optimizer', 'Accelerator', 'Stabilizer'];
  const benefitsPool = ['Bio-available Mineral Support', 'Mitochondrial Efficiency', 'Rapid Glycogen Restoration', 'Lactic Acid Mitigation', 'Gut Microbiome Stability', 'Collagen Synthesis Support', 'Cognitive Focus Enhancement', 'Anti-Inflammatory Matrix', 'Electrolyte Balance'];

  for (let i = 1; i <= 450; i++) {
    const category = categories[i % categories.length];
    const name = `${prefixes[i % prefixes.length]} ${baseNames[i % baseNames.length]} ${suffixes[i % suffixes.length]} ${i > 10 ? i : ''}`.trim();
    const image = i <= PROTOCOL_IMAGES.length ? PROTOCOL_IMAGES[i - 1] : PROTOCOL_IMAGES[i % PROTOCOL_IMAGES.length];
    products.push({
      id: `ns-p-${i}`,
      sku: `NS-${100 + i}-${category.substring(0, 2).toUpperCase()}`,
      name,
      category,
      shortDescription: `Advanced ${category.toLowerCase()} protocol designed for elite equestrian athletes.`,
      description: `The ${name} formulation addresses complex metabolic requirements of professional sport horses.`,
      price: 150 + (i % 350),
      image,
      gallery: [image],
      benefits: [benefitsPool[i % benefitsPool.length], benefitsPool[(i + 1) % benefitsPool.length], 'Laboratory Verified Stability'],
      formula: `Molecular Synthesis ${i}: Complexed Trace Elements and Proprietary ${category} Gradient.`,
      usageDirections: `Administer ${100 + (i % 100)}g per 100kg of body weight daily.`,
      stableTips: 'Store in climate-controlled stable conditions.',
      weight: i % 2 === 0 ? '18.14 KG' : '15 KG',
      form: forms[i % forms.length],
      scienceNote: `Batch confirms 98% bio-availability.`
    });
  }
  return products;
};

const RAW_EVENTS = [
  // --- SAUDI ARABIA ---
  { title: "The Saudi Cup", location: "King Abdulaziz Racecourse, Riyadh, KSA", region: "Middle East", discipline: "Flat Racing (World's Richest)", cost: "From 150 SAR", website: "https://thesaudicup.com.sa", linkedin: "https://www.linkedin.com/company/the-saudi-cup/", email: "tickets@thesaudicup.com.sa", phone: "+966 11 477 7755" },
  { title: "AlUla Desert Blaze (Fursan AlUla)", location: "AlUla, Saudi Arabia", region: "Middle East", discipline: "Endurance (CEI3*)", cost: "From 100 SAR", website: "https://www.experiencealula.com", linkedin: "https://www.linkedin.com/company/royal-commission-for-alula/", email: "info@experiencealula.com", phone: "+966 9200 25852" },
  { title: "Diriyah Equestrian Festival", location: "Al Duhami Farm, KSA", region: "Middle East", discipline: "Show Jumping (CSI5*)", cost: "From 200 SAR", website: "https://www.diriyah.sa", linkedin: "https://www.linkedin.com/company/diriyah-gate-development-authority/", email: "events@diriyah.sa", phone: "+966 11 482 0000" },
  { title: "Riyadh Season Cup", location: "Riyadh, KSA", region: "Middle East", discipline: "Exhibition Polo", cost: "From 100 SAR", website: "https://riyadhseason.sa", linkedin: "https://www.linkedin.com/company/gea-saudi/", email: "support@riyadhseason.sa", phone: "+966 11 200 0000" },
  
  // --- UAE ---
  { title: "Dubai World Cup", location: "Meydan Racecourse, Dubai, UAE", region: "Middle East", discipline: "Flat Racing", cost: "From 50 AED", website: "https://www.dubairacingclub.com", linkedin: "https://www.linkedin.com/company/dubai-racing-club/", email: "info@dubairacingclub.com", phone: "+971 4 327 0000" },
  { title: "Abu Dhabi International Arabian Horse Championship", location: "Abu Dhabi, UAE", region: "Middle East", discipline: "Arabian Show", cost: "Free Entry", website: "https://www.eahs.org", linkedin: "https://www.linkedin.com/company/emirates-arabian-horse-society/", email: "info@eahs.org", phone: "+971 2 444 0444" },
  { title: "Sharjah International Show Jumping", location: "Sharjah, UAE", region: "Middle East", discipline: "Show Jumping", cost: "From 30 AED", website: "https://serc.ae", linkedin: "https://www.linkedin.com/company/sharjah-equestrian-racing-club/", email: "info@serc.ae", phone: "+971 6 531 1155" },
  
  // --- QATAR ---
  { title: "CHI Al Shaqab", location: "Al Shaqab Arena, Doha, Qatar", region: "Middle East", discipline: "Dressage & Jumping", cost: "From 35 QAR", website: "https://alshaqab.com", linkedin: "https://www.linkedin.com/company/al-shaqab/", email: "alshaqab@qf.org.qa", phone: "+974 4454 1992" },
  { title: "Katara International Arabian Horse Festival", location: "Doha, Qatar", region: "Middle East", discipline: "Arabian Show", cost: "From 20 QAR", website: "https://www.katara.net", linkedin: "https://www.linkedin.com/company/katara-cultural-village/", email: "info@katara.net", phone: "+974 4408 0000" },
  
  // --- KUWAIT & OMAN ---
  { title: "Kuwait Arabian Horse Festival", location: "Bait Al Arab, Kuwait", region: "Middle East", discipline: "Arabian Show", cost: "Free", website: "https://www.baitalarab.org.kw", linkedin: "https://www.linkedin.com/company/bait-al-arab/", email: "info@baitalarab.org.kw", phone: "+965 2474 1332" },
  { title: "Muscat Show Jumping", location: "Muscat, Oman", region: "Middle East", discipline: "Show Jumping", cost: "Free", website: "https://www.oman-equestrian.org", linkedin: "https://www.linkedin.com/company/oman-equestrian-federation/", email: "info@oef.om", phone: "+968 244 00000" },

  // --- EGYPT & MOROCCO ---
  { title: "El Zahraa Arabian Horse Festival", location: "Cairo, Egypt", region: "Middle East", discipline: "Arabian Show", cost: "From 50 EGP", website: "https://www.elzahraastud.com", linkedin: "https://www.linkedin.com/company/el-zahraa-stud/", email: "info@elzahraastud.com", phone: "+20 2 2274 1234" },
  { title: "Salon du Cheval d'El Jadida", location: "El Jadida, Morocco", region: "Middle East", discipline: "Multi-Discipline", cost: "From 50 MAD", website: "https://www.salonducheval.ma", linkedin: "https://www.linkedin.com/company/association-du-salon-du-cheval/", email: "contact@salonducheval.ma", phone: "+212 523 34 33 00" },

  // --- GLOBAL (Real World) ---
  { title: "Dublin Horse Show", location: "Dublin, Ireland", region: "Europe", discipline: "Show Jumping", cost: "From €35", website: "https://www.dublinhorseshow.com", linkedin: "https://www.linkedin.com/company/dublin-horse-show/", email: "info@rds.ie", phone: "+353 1 668 0866" },
  { title: "Aachen CHIO", location: "Aachen, Germany", region: "Europe", discipline: "Multi-Discipline", cost: "From €40", website: "https://www.chioaachen.de", linkedin: "https://www.linkedin.com/company/chio-aachen/", email: "info@chioaachen.de", phone: "+49 241 91710" },
  { title: "Royal Windsor Horse Show", location: "Windsor, UK", region: "Europe", discipline: "Multi-Discipline", cost: "From £30", website: "https://www.rwhs.co.uk", linkedin: "https://www.linkedin.com/company/royal-windsor-horse-show/", email: "info@rwhs.co.uk", phone: "+44 1753 860633" }
];

const generateEventArchive = (): EquineEvent[] => {
  return RAW_EVENTS.map((e, i) => ({
    id: `ev-real-${i}`,
    title: e.title,
    date: `2026-${(i % 12 + 1).toString().padStart(2, '0')}-${(i % 28 + 1).toString().padStart(2, '0')}`,
    location: e.location,
    region: e.region as any,
    category: e.discipline,
    discipline: e.discipline,
    description: `The ${e.title} is a premier destination in the global equestrian circuit. Nobel Spirit® Performance Labs provides advanced nutritional protocols and logistical diagnostics for elite competitors.`,
    image: `https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&q=80&w=1200`,
    registrationUrl: e.website,
    website: e.website,
    linkedin: e.linkedin,
    contactEmail: e.email || `logistics@nobelspiritlabs.store`,
    contactPhone: e.phone || `+48 739 256 482`,
    partner: "Nobel Spirit Performance Labs®",
    cost: e.cost,
    bookingInfo: `Official ticketing and performance protocol registration is handled directly through the ${e.title} digital portal.`
  }));
};

export const PRODUCTS: Product[] = generateProductArchive();
export const EQUINE_EVENTS: EquineEvent[] = generateEventArchive();
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b-1',
    title: 'Precision Recovery in High-Heat Arid Circuits',
    summary: 'A technical exploration into molecular hydration and electrolyte stability for elite Middle Eastern performance.',
    content: 'Full laboratory analysis regarding the molecular influence of targeted nutrition on elite performance in extreme climates...',
    category: 'Performance',
    date: '2026',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  }
];
