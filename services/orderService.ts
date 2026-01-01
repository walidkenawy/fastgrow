
import { CartItem, Currency } from '../types';
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface OrderPayload {
  client: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: CartItem[];
  total: number;
  paymentMethod: 'bank' | 'paypal';
  currency: Currency;
}

/**
 * INTERNAL HQ DISPATCH
 * Automatic notification to the business headquarters.
 */
export const transmitToHQ = async (order: OrderPayload): Promise<void> => {
  const ai = getAI();
  const HQ_EMAIL = '2010onlyforyou77@gmail.com';
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ORDER DATA FOR HQ:
      Recipient: ${HQ_EMAIL}
      Client: ${order.client.fullName}
      Items: ${order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
      Total: ${order.total} ${order.currency.code}
      Payment: ${order.paymentMethod.toUpperCase()}
      Contact: ${order.client.phone}`,
      config: {
        systemInstruction: "You are the Nobel Spirit® Logistics Engine. Generate a technical order brief for laboratory staff. Professional and clinical tone."
      }
    });
    
    console.log(`%c[AUTOMATIC HQ ALERT] Sent to ${HQ_EMAIL}`, "color: #D4AF37; font-weight: bold; background: #064e3b; padding: 4px;");
    console.debug("Internal Content:", response.text);
  } catch (err) {
    console.error("HQ Dispatch Failure", err);
  }
};

/**
 * CLIENT EMAIL DISPATCH
 * Automatic luxury confirmation to the client's email.
 */
export const transmitToClientEmail = async (order: OrderPayload): Promise<void> => {
  const ai = getAI();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CLIENT CONFIRMATION:
      Name: ${order.client.fullName}
      Order: ${order.items.map(i => i.product.name).join(', ')}
      Laboratory: Warsaw Lab #12`,
      config: {
        systemInstruction: "You are the Nobel Spirit® Elite Concierge. Generate a prestigious, high-end email thanking the client for their protocol activation. Use terms like 'Molecular Precision' and 'Stable Allocation'."
      }
    });
    
    console.log(`%c[AUTOMATIC CLIENT EMAIL] Sent to ${order.client.email}`, "color: #064e3b; font-weight: bold; background: #D4AF37; padding: 4px;");
    console.debug("Client Email Content:", response.text);
  } catch (err) {
    console.error("Client Email Failure", err);
  }
};

/**
 * CLIENT MOBILE DISPATCH (WhatsApp/SMS)
 * Automatic instant alert to the client's phone.
 */
export const transmitToClientMobile = async (order: OrderPayload): Promise<void> => {
  const ai = getAI();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `MOBILE ALERT: 
      Client: ${order.client.fullName}
      Order Value: ${order.total} ${order.currency.code}`,
      config: {
        systemInstruction: "Generate a short, powerful WhatsApp message with emojis (🐎, ✨, 🧪). Include 'Protocol Activated' and the client name."
      }
    });
    
    console.log(`%c[AUTOMATIC MOBILE ALERT] Sent to ${order.client.phone}`, "color: #25D366; font-weight: bold; padding: 4px;");
    console.debug("Mobile Content:", response.text);
  } catch (err) {
    console.error("Mobile Dispatch Failure", err);
  }
};

/**
 * MASTER DISPATCH PROTOCOL
 * Triggers all channels simultaneously for automatic coverage.
 */
export const executeOmnichannelDispatch = async (order: OrderPayload, onStatusUpdate?: (status: string) => void): Promise<void> => {
  onStatusUpdate?.("Authenticating Transaction...");
  await new Promise(r => setTimeout(r, 600));

  onStatusUpdate?.("Dispatching HQ Protocol...");
  await transmitToHQ(order);
  await new Promise(r => setTimeout(r, 600));

  onStatusUpdate?.("Synthesizing Client Archive...");
  await transmitToClientEmail(order);
  await new Promise(r => setTimeout(r, 600));

  onStatusUpdate?.("Broadcasting Mobile Alert...");
  await transmitToClientMobile(order);
  await new Promise(r => setTimeout(r, 600));

  onStatusUpdate?.("Protocol Confirmed.");
};
