
// @google/genai Gemini Service for Nobel Spirit® Labs
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = 5, backoff = 3000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error?.message?.toLowerCase() || "";
    
    // Check specifically for Daily Quota Exceeded
    if (errorMsg.includes('resource_exhausted') || errorMsg.includes('quota exceeded') || errorMsg.includes('429')) {
      if (errorMsg.includes('per_day')) {
        throw new Error("DAILY_QUOTA_REACHED: Your Gemini API daily limit has been reached. Please try again tomorrow or upgrade your plan.");
      }
      
      if (retries > 0) {
        console.warn(`Rate limit hit. Retrying in ${backoff}ms... (${retries} attempts left)`);
        await delay(backoff);
        return withRetry(fn, retries - 1, backoff * 3); // Exponentially increasing backoff
      }
    }
    throw error;
  }
}

/**
 * CORE VISUAL ENGINE: Generates high-end clinical mockups.
 * REFINED: Enforces a strict "Elite Pharmaceutical" aesthetic.
 */
export const generateAssetMockup = async (
  title: string, 
  category: string, 
  type: 'product' | 'blog' | 'event' = 'product',
  subType?: string,
  baseImage?: string
) => {
  return withRetry(async () => {
    const ai = getAI();
    const colorMapping: Record<string, string> = {
      Performance: 'Deep Royal Blue, Gold and White',
      Digestive: 'Sage Green, Earthy Brown and White',
      Orthopedic: 'Amethyst Violet, Platinum and White',
      Metabolic: 'Solar Orange, Amber and White',
      Grooming: 'Pearl White and Rose Gold'
    };
    const colorScheme = colorMapping[category] || 'Minimalist Gold and White';
    
    let prompt = "";
    if (type === 'product') {
      prompt = `TASK: Ultra-high fidelity professional 3D product mockup for "Nobel Spirit®". 
      SUBJECT: ${title} Equine Performance Protocol. 
      AESTHETIC: High-end clinical laboratory packaging, minimalist pharmaceutical design. 
      PACKAGING: Sleek heavy-duty supplement bag with metallic gold foil accents and technical typography. 
      PALETTE: ${colorScheme}. 
      BACKGROUND: Clinical white studio environment with sharp focus and subtle shadows. 
      VERIFICATION: Include a "Laboratory Verified" holographic seal.`;
    } else if (type === 'blog') {
      prompt = `Cinematic clinical photography, scientific research journal cover for "${title}". 
      Focus: Molecular horse anatomy or elite stable lab equipment. 
      Accents: ${colorScheme}. 
      STYLING: Sharp, clean, monochromatic with gold accents.`;
    } else {
      prompt = `Architectural visualization of the Nobel Spirit Pavilion at "${title}". 
      STYLING: Luxury glass and white steel construction, elite equestrian hospitality. 
      Lighting: Soft natural daylight. 
      Palette: ${colorScheme}.`;
    }

    const parts: any[] = [{ text: prompt }];
    if (baseImage && baseImage.startsWith('data:')) {
      const mimeType = baseImage.split(';')[0].split(':')[1];
      const data = baseImage.split(',')[1];
      parts.unshift({ inlineData: { mimeType, data } });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
      config: { imageConfig: { aspectRatio: type === 'product' ? "1:1" : "16:9" } }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return '';
  });
};

export const generateProductMockup = (name: string, cat: string, subType?: string, baseImage?: string) => generateAssetMockup(name, cat, 'product', subType, baseImage);
export const generateEventVisual = (title: string, loc: string, cat: string) => generateAssetMockup(`${title} @ ${loc}`, cat, 'event');
export const generateBlogVisual = (title: string, sum: string, cat: string) => generateAssetMockup(title, cat, 'blog');

/**
 * RESEARCH TOOLS: Gemini 3 Pro reasoning for massive data lists.
 */
export const searchExhibitors = async (continent: string, country: string, industry: string, event?: string) => {
  return withRetry(async () => {
    const ai = getAI();
    const query = `DEEP EXHAUSTIVE RESEARCH TASK: Find and list EXACTLY 50 publicly listed exhibitors, sponsors, or business entities in the equine industry for the region: ${continent}/${country}.
    FOCUS: ${industry} ${event ? 'associated with ' + event : 'general industry'}.
    Return exactly 50 entries as a JSON array of objects.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: query,
      config: { 
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              country: { type: Type.STRING },
              city: { type: Type.STRING },
              phone: { type: Type.STRING },
              email: { type: Type.STRING },
              website: { type: Type.STRING },
              industryType: { type: Type.STRING },
              eventAffiliation: { type: Type.STRING }
            },
            required: ['name', 'country', 'city', 'phone', 'email', 'website', 'industryType', 'eventAffiliation']
          }
        }
      },
    });

    const results = JSON.parse(response.text || '[]');
    return results.map((res: any, idx: number) => ({
      ...res,
      id: `exh-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      continent
    }));
  });
};

export const searchB2BPartners = async (country: string, type: string, city?: string) => {
  return withRetry(async () => {
    const ai = getAI();
    const query = `DEEP INDUSTRIAL INTELLIGENCE: Identify EXACTLY 50 elite-level equine business entities in ${country}${city ? ' in ' + city : ''}. 
    Return as a JSON array of 50 objects.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: query,
      config: { 
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              city: { type: Type.STRING },
              website: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              type: { type: Type.STRING },
              estimatedProfit: { type: Type.STRING },
              marketStanding: { type: Type.STRING },
              scale: { type: Type.INTEGER },
              contactMethods: {
                type: Type.OBJECT,
                properties: {
                  email: { type: Type.BOOLEAN },
                  form: { type: Type.BOOLEAN },
                  phone: { type: Type.BOOLEAN }
                }
              }
            },
            required: ['name', 'city', 'type', 'estimatedProfit', 'marketStanding', 'scale', 'contactMethods']
          }
        }
      },
    });

    const results = JSON.parse(response.text || '[]');
    return results.map((res: any, idx: number) => ({
      ...res,
      id: `partner-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      location: country,
      website: res.website || "https://google.com/search?q=" + encodeURIComponent(res.name),
      linkedin: res.linkedin || "",
      uri: res.website || "https://google.com/search?q=" + encodeURIComponent(res.name),
      analysis: {
        estimatedProfit: res.estimatedProfit,
        marketStanding: res.marketStanding,
        scale: res.scale
      }
    }));
  });
};

export const getDeepIntelligence = async (topic: string, context: string, category: string) => {
  return withRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Strategic dossier: ${topic}. Context: ${context}. ANALYZE: Performance impact. FORMAT: JSON {abstract, analysis, implications[], seo: {metaDescription, keywords[], h1Header}}`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  });
};

// Fix: Added getDietaryAdvice for AIDietConsultant component
export const getDietaryAdvice = async (userInput: string) => {
  return withRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a molecular nutritional analysis for an equine athlete based on this condition: "${userInput}". Identify performance gaps and recommend Nobel Spirit® protocols (IDs follow pattern ns-p-1 to ns-p-450).`,
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING },
            nutritionalGoals: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedProductIds: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["advice", "nutritionalGoals", "recommendedProductIds"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

// Fix: Added getProductIntelligence for ProductDetail component
export const getProductIntelligence = async (product: any) => {
  return withRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Strategic Dossier Request for Product: ${product.name}. 
      Category: ${product.category}. 
      Formula: ${product.formula}. 
      Perform deep molecular analysis of benefits and performance impact.`,
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            abstract: { type: Type.STRING },
            analysis: { type: Type.STRING },
            implications: { type: Type.ARRAY, items: { type: Type.STRING } },
            registrationRoadmap: { type: Type.STRING },
            seo: {
              type: Type.OBJECT,
              properties: {
                metaDescription: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                h1Header: { type: Type.STRING }
              },
              required: ["metaDescription", "keywords", "h1Header"]
            }
          },
          required: ["abstract", "analysis", "implications", "seo"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const getExchangeRates = async () => {
  return withRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Exchange rates relative to 1 PLN: USD, EUR, GBP, SAR, AED. JSON format.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const searchNearbyEquineFacilities = async (query: string, lat?: number, lng?: number) => {
  return withRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query + (lat && lng ? ` near ${lat}, ${lng}` : ""),
      config: { tools: [{ googleSearch: {} }] },
    });

    return {
      text: response.text,
      places: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || "Search Result",
        uri: chunk.web?.uri || "#"
      })).filter(p => p.uri !== "#") || []
    };
  });
};
