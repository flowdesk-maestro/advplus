const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

/**
 * Decrypts a string encrypted with the frontend encryption utility.
 */
function decrypt(encryptedData) {
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

module.exports = { decrypt };
