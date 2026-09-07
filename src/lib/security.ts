// Security & Cryptographic Utilities for Python Class LMS
// Implemented using standard Web Crypto API (supported across Cloudflare Workers, Node 18+, and modern browsers)

export interface SessionPayload {
  sub: string;           // Internal user ID
  role: 'student' | 'teacher';
  regNo?: string;        // Register Number for student
  name: string;
  classId?: 'C1-112' | 'C2-147' | 'C3-091';
  mustChangePin?: boolean;
  iat: number;
  exp: number;
}

const DEFAULT_SECRET = "python-class-lms-super-secret-key-change-in-production";

/**
 * Generate a random cryptographic salt
 */
export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a student PIN or password with a unique salt using SHA-256
 */
export async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + ":" + salt);
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback simple hash for environments without Web Crypto subtle
  let hash = 0;
  const str = pin + ":" + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "fallback_" + Math.abs(hash).toString(16);
}

/**
 * Verify a PIN against a stored hash
 */
export async function verifyPin(pin: string, storedHash: string, salt: string): Promise<boolean> {
  const computed = await hashPin(pin, salt);
  return computed === storedHash;
}

/**
 * Create a simple base64url HMAC-signed JWT token
 */
export async function createSessionToken(payload: Omit<SessionPayload, 'iat' | 'exp'>, expiresInSeconds = 86400 * 7): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;
  const fullPayload: SessionPayload = { ...payload, iat, exp };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(fullPayload)))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const secret = (typeof process !== 'undefined' && process.env && process.env.SESSION_SECRET) || DEFAULT_SECRET;
  const signature = await generateHmacSignature(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode an HMAC-signed session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signature] = parts;
    const secret = (typeof process !== 'undefined' && process.env && process.env.SESSION_SECRET) || DEFAULT_SECRET;
    
    // Verify signature
    const expectedSignature = await generateHmacSignature(`${headerB64}.${payloadB64}`, secret);
    if (signature !== expectedSignature) {
      console.warn("Invalid session token signature");
      return null;
    }

    // Decode payload
    const jsonString = decodeURIComponent(escape(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))));
    const payload: SessionPayload = JSON.parse(jsonString);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn("Session token expired");
      return null;
    }

    return payload;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

async function generateHmacSignature(data: string, secret: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
      const sigArray = Array.from(new Uint8Array(signatureBuffer));
      const base64 = btoa(String.fromCharCode(...sigArray));
      return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    } catch {
      // Fallback
    }
  }

  // Fallback hash representation
  let hash = 0;
  const combined = data + secret;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  return "sig_" + Math.abs(hash).toString(16);
}

// In-memory rate limiting store (for edge function / browser use)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxAttempts - entry.count };
}

export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}
