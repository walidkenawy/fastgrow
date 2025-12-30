
import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates deep scientific intelligence for a specific product.
 */
export const getProductIntelligence = async (product: any) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    You are an Elite Equine Molecular Biologist and SEO Strategist for Nobel Spirit®. 
    Analyze the provided equine supplement/feed product and generate a "Molecular Technical Dossier".
    
    The output must be high-end, clinical, and scientifically dense.
    Incorporate the product's specific ingredients and benefits into the analysis.
    
    Structure your response as a JSON object with:
    - "abstract": A professional 2-sentence executive summary of the protocol.
    - "analysis": A detailed 3-paragraph scientific breakdown of how the ingredients (like ${product.formula}) interact with equine physiology.
    - "implications": 4 bullet points on competitive advantages and performance outcomes.
    - "seo": {
        "metaDescription": "A 160-character SEO meta description optimized for horse performance keywords.",
        "keywords": ["List", "of", "high-value", "niche", "keywords"],
        "h1Header": "An SEO-optimized scientific title for the product."
      }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Product Name: ${product.name}\nCategory: ${product.category}\nBenefits: ${product.benefits.join(', ')}\nFormula: ${product.formula}\nIngredients: ${JSON.stringify(product.ingredientDetails)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            abstract: { type: Type.STRING },
            analysis: { type: Type.STRING },
            implications: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Product Intelligence Error:", error);
    throw error;
  }
};

/**
 * Translates an array of objects while preserving their keys.
 */
export const translateContentBatch = async (items: any[], targetLang: string, type: 'product' | 'blog' | 'event') => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    You are an expert translator for Nobel Spirit®, a luxury equine performance brand.
    Translate the provided JSON array of ${type}s into ${targetLang}.
    
    CRITICAL RULES:
    1. DO NOT translate keys.
    2. Maintain the same array length.
    3. Use a high-end, professional, and scientific tone.
    4. Translate ALL user-facing strings (names, descriptions, benefits, categories, summaries).
    5. Return ONLY the valid JSON array. No markdown, no explanations.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: JSON.stringify(items),
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const translated = JSON.parse(response.text);
    return translated;
  } catch (error) {
    console.error(`Translation error for ${type}:`, error);
    return items; 
  }
};

export const translateUISet = async (labels: Record<string, string>, targetLang: string) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    Translate the following UI labels into ${targetLang}. 
    Maintain a luxury brand tone. 
    Return ONLY a JSON object with the exact same keys.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: JSON.stringify(labels),
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return labels;
  }
};

export const getDeepIntelligence = async (topic: string, context: string, category: string) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    You are an Elite Equine Research Strategist for Nobel Spirit®. 
    Your task is to generate a comprehensive "Deep Intelligence Dossier" for a performance topic or international event.
    
    The output must be high-end, scientific, and SEO-optimized.
    Structure your response as a JSON object with:
    - "abstract": A professional 2-sentence summary.
    - "analysis": A detailed 3-paragraph scientific or strategic breakdown.
    - "implications": 3-4 bullet points on how this affects high-stakes equine performance.
    - "registrationRoadmap": (FOR EVENTS ONLY) A 2-sentence guide on how elite stables should approach registration and logistics for this event.
    - "seo": {
        "metaDescription": "A 160-character SEO meta description.",
        "keywords": ["List", "of", "high-value", "keywords"],
        "h1Header": "An SEO-optimized h1 title."
      }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Topic: ${topic}\nContext: ${context}\nCategory: ${category}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            abstract: { type: Type.STRING },
            analysis: { type: Type.STRING },
            implications: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Deep Intelligence Error:", error);
    throw error;
  }
};

export const getDietaryAdvice = async (horseData: string) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are an expert Equine Nutritionist for Nobel Spirit, a premium horse performance company.
    Based on the user's description of their horse, provide a professional dietary recommendation.
    
    Available products in our catalog:
    ${PRODUCTS.map(p => `- ${p.name}: ${p.description}`).join('\n')}

    Your response must be in JSON format with the following structure:
    {
      "advice": "General summary and reasoning for the diet.",
      "nutritionalGoals": ["Goal 1", "Goal 2"],
      "recommendedProductIds": ["id1", "id2"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Horse Details: ${horseData}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING },
            nutritionalGoals: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["advice", "nutritionalGoals", "recommendedProductIds"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const getExchangeRates = async () => {
  const ai = getAI();
  const prompt = `Provide the current approximate exchange rates for the following currencies relative to 1 Polish Zloty (PLN): USD, EUR, GBP, SAR, AED.
  Return only a JSON object where keys are currency codes and values are the conversion factors.
  Example: {"USD": 0.25, "EUR": 0.23}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            USD: { type: Type.NUMBER },
            EUR: { type: Type.NUMBER },
            GBP: { type: Type.NUMBER },
            SAR: { type: Type.NUMBER },
            AED: { type: Type.NUMBER },
            PLN: { type: Type.NUMBER }
          }
        }
      }
    });
    const rates = JSON.parse(response.text);
    return { ...rates, PLN: 1 };
  } catch (error) {
    return { USD: 0.25, EUR: 0.23, GBP: 0.20, SAR: 0.94, AED: 0.92, PLN: 1 };
  }
};

export const generateProductMockup = async (
  productName: string, 
  category: string, 
  variation: 'full' | 'horse' | 'background' = 'full',
  base64Image?: string,
  specifics?: string
) => {
  const ai = getAI();
  
  const productColors = {
    'Herbal Mash': 'Green herbal gradient',
    'Classic Mash': 'Warm orange gradient',
    'Digestive Mash': 'Soft yellow gradient',
    'Performance': 'Metallic gold and black',
    'Digestive': 'Vibrant lime green',
    'Orthopedic': 'Deep royal blue',
    'Metabolic': 'Bright orange-copper',
    'Grooming': 'Soft lavender-pink'
  };

  const accentColor = productColors[productName as keyof typeof productColors] || 
                      productColors[category as keyof typeof productColors] || 
                      'Metallic gold';

  const prompt = `
    STRICT PRODUCT PACKAGING MOCKUP RULES:
    - TASK: Create/Edit a REALISTIC PRODUCT PACKAGING MOCKUP. 
    - SUBJECT: A tall, standing equine feed bag photographed in a professional studio.
    - ENVIRONMENT: Pure white background with a soft shadow.
    - BRANDING: "Nobel Spirit" logo clearly printed.
    - PRODUCT NAME: "Nobel Spirit ${productName}" prominently displayed.
    - ACCENT: ${accentColor} theme.
  `;

  const contents: any = { parts: [{ text: prompt }] };

  if (base64Image && base64Image.startsWith('data:image')) {
    contents.parts.unshift({
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: 'image/png'
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents,
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

export const generateEventVisual = async (eventTitle: string, location: string, category: string) => {
  const ai = getAI();
  const prompt = `
    Cinematic promotional poster for an elite equestrian event: ${eventTitle} in ${location}. 
    Category: ${category}. 
    Style: Ultra-luxury photography, "old money" aesthetic, majestic performance horse in a high-tech arena or historic venue. 
    Mood: Prestige, high-stakes competition, cinematic lighting.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image returned");
  } catch (error) {
    console.error("Event Image Error:", error);
    throw error;
  }
};

export const generateBlogVisual = async (title: string, summary: string, category: string) => {
  const ai = getAI();
  const prompt = `
    High-fidelity scientific/artistic photograph for an elite research publication about: ${title}. 
    Summary focus: ${summary}. 
    Style: Premium, clinical, advanced bio-science. 
    Visuals: Molecular structures, high-tech equine laboratories, or abstract performance bio-data visualization.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No blog image returned");
  } catch (error) {
    console.error("Blog Image Error:", error);
    throw error;
  }
};
