
export interface Product {
  id: string;
  name: string;
  category: 'Performance' | 'Digestive' | 'Orthopedic' | 'Metabolic' | 'Grooming';
  shortDescription: string;
  description: string;
  price: number;
  image: string;
  gallery?: string[];
  benefits: string[];
  formula: string;
  ingredientDetails?: { name: string; purpose: string }[];
  usageDirections: string;
  stableTips: string;
  weight: string;
  form: 'Pellets' | 'Powder' | 'Liquid' | 'Spray';
  scienceNote: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Nutrition' | 'Performance' | 'Veterinary';
  date: string;
  image: string;
}

export interface EquineEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  region: 'Europe' | 'Middle East' | 'Americas' | 'Asia';
  category: string;
  description: string;
  image: string;
  registrationUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export type CurrencyCode = 'PLN' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  label: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}
