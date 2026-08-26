import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Returns the encryption key from environment variable as a Buffer.
 * Must be exactly 32 bytes (64 hex characters).
 */
function getEncryptionKey(): Buffer {
  const keyString = process.env.PASSWORD_ENCRYPTION_KEY;
  if (!keyString) {
    throw new Error('PASSWORD_ENCRYPTION_KEY environment variable is missing.');
  }
  
  const key = Buffer.from(keyString, 'hex');
  if (key.length !== 32) {
    throw new Error('PASSWORD_ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters).');
  }
  
  return key;
}

/**
 * Encrypts a plaintext password using AES-256-GCM.
 * Format: "v1:iv:authTag:ciphertext" (hex encoded parts)
 */
export function encryptPassword(plaintext: string): string {
  if (!plaintext) return '';
  
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `v1:${iv.toString('hex')}:${authTag}:${ciphertext}`;
}

/**
 * Decrypts an encrypted password string.
 */
export function decryptPassword(encryptedData: string): string {
  if (!encryptedData) return '';
  
  const parts = encryptedData.split(':');
  if (parts.length !== 4 || parts[0] !== 'v1') {
    throw new Error('Invalid encrypted password format.');
  }
  
  const [, ivHex, authTagHex, ciphertextHex] = parts;
  
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let plaintext = decipher.update(ciphertextHex, 'hex', 'utf8');
  plaintext += decipher.final('utf8');
  
  return plaintext;
}
