import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * The output is a hex string in the format: iv:authTag:encryptedData
 */
export function encrypt(text: string): string {
  const keyHex = process.env.MASTER_ENCRYPTION_KEY;
  if (!keyHex) throw new Error('MASTER_ENCRYPTION_KEY is not defined');
  
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) throw new Error('MASTER_ENCRYPTION_KEY must be 32 bytes (64 hex characters)');

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a string encrypted with the `encrypt` function.
 */
export function decrypt(encryptedData: string): string {
  const keyHex = process.env.MASTER_ENCRYPTION_KEY;
  if (!keyHex) throw new Error('MASTER_ENCRYPTION_KEY is not defined');
  
  const key = Buffer.from(keyHex, 'hex');
  
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    // Fallback if data is not encrypted (e.g. legacy plain text)
    return encryptedData;
  }
  
  const [ivHex, authTagHex, encryptedText] = parts;
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
