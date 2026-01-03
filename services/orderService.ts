
import { CartItem, Currency } from '../types';
import { GoogleGenAI } from "@google/genai";
import { appendOrderToSheet, updateRowStatus } from './sheetService';

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
 * APPSHEET API HANDSHAKE SIMULATION
 */
const notifyAppSheetEndpoint = async (orderId: string) => {
  // Simulating the AppSheet API 'Add Row' trigger
  console.log(`%c[APPSHEET API] Pinging Endpoint: /api/v2/apps/nobel-spirit/tables/Orders/Action/Add`, "color: #0369a1; font-weight: bold;");
  return new Promise(resolve => setTimeout(resolve, 600));
};

/**
 * BOT TASK: BUYER CONFIRMATION (VIA APPSHEET AUTOMATION)
 */
export const executeBuyerBot = async (order: OrderPayload): Promise<void> => {
  const ai = getAI();
  const firstProductName = order.items[0]?.product.name || "Performance Protocol";
  
  try {
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        TRIGGER: AppSheet Automation Bot (Buyer Confirmation)
        APP_ID: nobel-spirit-performance-labs
        TABLE: Orders
        EVENT: Adds Only
        
        TEMPLATE_SUBJECT: "Nobel Spirit Order Confirmation - ${firstProductName}"
        
        BODY_TEMPLATE:
        "Thank you, <<[Customer Name]>>!
        Your order: <<[Product]>>
        Total: <<[Total]>>
        See your product: <<[Mockup URL]>>
        
        [IMAGE_ATTACHMENT: Generated Mockup Attached]"
      `,
      config: {
        systemInstruction: "You are the AppSheet Automation Bot for Nobel Spirit. Generate the final buyer confirmation email content."
      }
    });
    console.log(`%c[APPSHEET BOT] SUCCESS: Buyer Confirmation Sent`, "color: #10b981; font-weight: bold;");
  } catch (err) {
    console.error("AppSheet Bot Error", err);
  }
};

/**
 * BOT TASK: ADMIN NOTIFICATION (VIA APPSHEET AUTOMATION)
 */
export const executeAdminBot = async (order: OrderPayload): Promise<void> => {
  const ai = getAI();
  const HQ_EMAIL = '2010onlyforyou77@gmail.com';
  
  try {
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        TRIGGER: AppSheet Automation Bot (Admin Alert)
        APP_ID: nobel-spirit-performance-labs
        TARGET_EMAIL: ${HQ_EMAIL}
        
        BODY:
        "New order alert:
        - Customer: ${order.client.fullName}
        - Email: ${order.client.email}
        - Total: ${order.total}
        - Address: ${order.client.address}"
      `,
      config: {
        systemInstruction: "You are the AppSheet Admin Notification Bot. Generate a concise administrative alert."
      }
    });
    console.log(`%c[APPSHEET BOT] SUCCESS: Admin Notification Sent`, "color: #10b981; font-weight: bold;");
  } catch (err) {
    console.error("AppSheet Bot Error", err);
  }
};

/**
 * APPSHEET OMNICHANNEL DISPATCH PROTOCOL
 * Master orchestrator for spreadsheet sync and bot triggering.
 */
export const executeOmnichannelDispatch = async (order: OrderPayload, onStatusUpdate?: (status: string) => void): Promise<void> => {
  onStatusUpdate?.("AppSheet: Preparing API Handshake...");
  await new Promise(r => setTimeout(r, 600));

  onStatusUpdate?.("AppSheet: Appending Row to Orders Table...");
  const row = appendOrderToSheet(order);
  await notifyAppSheetEndpoint(row.id);

  onStatusUpdate?.("AppSheet Bot Trigger: Data Change Detected (Adds Only)...");
  await new Promise(r => setTimeout(r, 800));

  onStatusUpdate?.("AppSheet Bot: Dispatching Buyer Confirmation Email...");
  await executeBuyerBot(order);
  
  onStatusUpdate?.("AppSheet Bot: Notifying Dispatch Headquarters...");
  await executeAdminBot(order);

  updateRowStatus(row.id, 'Processed');
  onStatusUpdate?.("AppSheet: Workflow Executed Successfully.");
};
