
/**
 * NOBEL SPIRIT COMMUNICATIONS GATEWAY
 * Service ID: service_s4vyk29
 * Public Key: rtKxSHs8VO77vzy6g
 */

const SERVICE_ID = 'service_s4vyk29';
const PUBLIC_KEY = 'rtKxSHs8VO77vzy6g'; 

/** 
 * TEMPLATE CONFIGURATION
 * Verified from screenshot: template_xe3sik8
 */
const TEMPLATE_ID_INQUIRY = 'template_xe3sik8'; 
const TEMPLATE_ID_CONTACT = 'template_xe3sik8'; 

export interface EmailParams {
  [key: string]: string | number | undefined;
}

/**
 * Sends an email using the EmailJS REST API.
 * This handles the direct transmission of performance protocols and inquiries.
 */
export const sendEmail = async (params: EmailParams, type: 'inquiry' | 'contact' = 'contact'): Promise<boolean> => {
  const templateId = type === 'inquiry' ? TEMPLATE_ID_INQUIRY : TEMPLATE_ID_CONTACT;
  const mainEmail = 'info@nobelspiritlabs.store';
  
  const payload = {
    service_id: SERVICE_ID,
    template_id: templateId,
    user_id: PUBLIC_KEY,
    template_params: {
      ...params,
      // Standardize variables for EmailJS templates
      from_name: params.client_name || params.from_name || 'Guest',
      from_email: params.client_email || params.from_email || mainEmail,
      reply_to: params.client_email || params.from_email || mainEmail,
      message: params.message,
      product_name: params.product_name || 'General Protocol',
      product_sku: params.product_sku || 'N/A',
      sent_at: new Date().toLocaleString(),
    },
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[EmailJS] Transmission Fault: ${errorText}`);
      
      // Detailed logging for common configuration errors
      if (errorText.toLowerCase().includes('template id not found')) {
        console.error(`[EmailJS] Config mismatch: Template "${templateId}" was not found for Service "${SERVICE_ID}". Verify both exist in the same account.`);
      }
      return false;
    }

    console.log(`[EmailJS] Protocol successfully transmitted via ${templateId}.`);
    return true;
  } catch (error) {
    console.error('[EmailJS] Network or Protocol exception:', error);
    return false;
  }
};
