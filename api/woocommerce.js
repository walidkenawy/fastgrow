
// api/woocommerce.js
// Secure proxy for WooCommerce REST API v3
// Keys are read from environment variables (never exposed to browser)

import fetch from 'node-fetch';

const WP_SITE_URL = 'https://www.nubaequi.pl';

const getAuthHeader = () => {
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;

  if (!key || !secret) {
    console.error('[SECURITY FATAL] WooCommerce API keys missing in environment');
    return null;
  }

  return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64');
};

/**
 * Modern WooCommerce REST API usually resides at /wp-json/wc/v3/.
 * Using this standard path is generally more reliable than index.php?rest_route=
 */
const getWooCommerceUrl = (resource) => {
  return `${WP_SITE_URL}/wp-json/wc/v3/${resource}`;
};

const getSafeSearchParams = (reqUrl) => {
  try {
    if (!reqUrl) return new URLSearchParams();
    const url = new URL(reqUrl, 'http://localhost');
    return url.searchParams;
  } catch (e) {
    return new URLSearchParams();
  }
};

export async function GET(req) {
  const auth = getAuthHeader();
  if (!auth) return new Response(JSON.stringify({ error: 'Auth Fault' }), { status: 500 });

  try {
    const wcUrl = new URL(getWooCommerceUrl('products'));
    const searchParams = getSafeSearchParams(req.url);
    
    wcUrl.searchParams.append('per_page', searchParams.get('per_page') || '100');
    if (searchParams.has('category')) wcUrl.searchParams.append('category', searchParams.get('category'));

    const response = await fetch(wcUrl.toString(), {
      method: 'GET',
      headers: {
        Authorization: auth,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[UPSTREAM ERROR] WooCommerce responded with ${response.status} for ${wcUrl.toString()}`);
      return new Response(JSON.stringify({ error: `Upstream error: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
      },
    });
  } catch (error) {
    console.error('[PROXY EXCEPTION] GET Products:', error);
    return new Response(JSON.stringify({ error: 'Gateway Exception' }), { status: 502 });
  }
}

export async function POST(req) {
  const auth = getAuthHeader();
  if (!auth) return new Response(JSON.stringify({ error: 'Auth Fault' }), { status: 500 });

  try {
    const body = await req.json();
    const url = getWooCommerceUrl('orders');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Request Malformed' }), { status: 400 });
  }
}
