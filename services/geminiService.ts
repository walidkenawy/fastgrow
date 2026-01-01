
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * THE NOBEL SPIRIT MASTER DESIGNER - RENDER PROTOCOL 9.0
 * Generates ultra-realistic 3D product mockups following the "NubaEqui" aesthetic.
 * Automatically saves and uses the current image as a base for refinements.
 */
export const generateAssetMockup = async (
  title: string, 
  category: string, 
  type: 'product' | 'blog' | 'event' = 'product',
  subType?: string,
  baseImage?: string
) => {
  const ai = getAI();
  
  const colorMapping: Record<string, string> = {
    Performance: 'Deep Royal Blue and Gold gradient',
    Digestive: 'Green herbal gradient matrix with White',
    Orthopedic: 'Deep Violet and Platinum metallic accents',
    Metabolic: 'Warm Amber and Charcoal gradient',
    Grooming: 'Soft Satin Rose and Pearl',
    Nutrition: 'Clinical Teal and White',
    Veterinary: 'Deep Navy and Surgical Steel'
  };

  const colorScheme = colorMapping[category] || 'Minimalist Monochrome';
  
  let prompt = "";
  if (type === 'product') {
    prompt = `
      COMMAND: Create a realistic 3D product mockup of a standing equine/horse feed supplement bag.
      STYLE: Professional luxury packaging photography, studio lighting, front view only.
      ENVIRONMENT: Plain white background (#FFFFFF) with a subtle, sophisticated drop shadow.
      OBJECT: A tall rectangular sealed plastic or paper sack with a premium zip-top or folded top finish.
      DOMINANT COLOR SCHEME: ${colorScheme}.
      BRANDING: 
      - Elegant script logo at the top: "Nobel Spirit" with a stylized, minimalist horse head silhouette.
      - Main Bold Label Text: "NOBEL ELITE: ${title.toUpperCase()} PROTOCOL".
      GRAPHICS: Include subtle running horse silhouettes in the background of the bag design and benefit icons (e.g., joints, hoof, or muscle icons).
      BOTTOM TEXT: "Net Weight 20 kg" or "15 kg" in clean sans-serif typography.
      AESTHETICS: High detail, photorealistic 8k render, pharmaceutical-grade.
    `;
    
    // If a base image is provided, instruct Gemini to refine the EXISTING branded asset
    if (baseImage && baseImage.startsWith('data:image')) {
       prompt += `\nREFINEMENT PROTOCOL: Use the attached image as the PRECISE base image. Do not change the layout. Enhance the material texture, lighting depth, and typographical clarity. Maintain the existing branding but make it look more high-end and physical.`;
    }
  } else if (type === 'blog') {
    prompt = `
      COMMAND: Generate a cinematic studio photograph of an elite equine scientific journal.
      TITLE ON COVER: "${title}".
      ENVIRONMENT: A high-end research facility background with soft-focus laboratory glassware.
      STYLE: Modern clinical science, 8k, luxury palette of ${colorScheme}.
    `;
  } else {
    prompt = `
      COMMAND: Generate a cinematic architectural render of a world-class equestrian pavilion.
      TEXT ON ENTRANCE: "NOBEL SPIRIT: ${title}".
      ENVIRONMENT: Modern, sleek international competition hub at sunset.
      STYLE: Luxury architectural photography, palette of ${colorScheme}.
    `;
  }

  try {
    const parts: any[] = [{ text: prompt }];
    
    // Multi-part input: Pass the base image if it's already a generated mockup (data URL)
    if (baseImage && baseImage.startsWith('data:')) {
      const mimeType = baseImage.split(';')[0].split(':')[1];
      const data = baseImage.split(',')[1];
      parts.unshift({
        inlineData: {
          mimeType: mimeType,
          data: data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
      config: { 
        imageConfig: { 
          aspectRatio: type === 'product' ? "1:1" : "16:9" 
        } 
      }
    });

    if (!response.candidates?.[0]?.content?.parts) throw new Error("Synthesis failed.");

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return '';
  } catch (error) {
    console.error("Synthesis Error:", error);
    return '';
  }
};

export const generateProductMockup = (name: string, cat: string, subType?: string, baseImage?: string) => 
  generateAssetMockup(name, cat, 'product', subType, baseImage);

export const generateEventVisual = (title: string, loc: string, cat: string) => 
  generateAssetMockup(`${title} @ ${loc}`, cat, 'event');

export const generateBlogVisual = (title: string, sum: string, cat: string) => 
  generateAssetMockup(title, cat, 'blog');

// Analysis and intelligence functions
export const getProductIntelligence = async (product: any) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Product: ${product.name}. Generate technical dossier JSON: abstract, analysis, implications, seo.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) { return {}; }
};

export const getDeepIntelligence = async (topic: string, context: string, category: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Topic: ${topic}. JSON: abstract, analysis, implications, seo.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) { return {}; }
};

export const getDietaryAdvice = async (horseData: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Assess: ${horseData}. Return JSON with advice, nutritionalGoals, recommendedProductIds.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) { throw err; }
};

export const translateContentBatch = async (items: any[], targetLang: string, type: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: JSON.stringify(items),
      config: { systemInstruction: `Translate to ${targetLang}. JSON only.`, responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (err) { return items; }
};

export const getExchangeRates = async () => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Exchange rates for USD, EUR, GBP, SAR, AED vs 1 PLN. JSON only.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) { return { USD: 0.25, EUR: 0.23, PLN: 1 }; }
};
