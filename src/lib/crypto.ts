// This module contains client-side cryptographic functions and must be used in client components.

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16; // bytes
const IV_LENGTH = 12; // bytes
const ALGORITHM = "AES-GCM";

export type FileMetadata = {
  name: string;
  type: string;
};

// Derives a key from a password and security key using PBKDF2.
export async function deriveKey(password: string, securityKey: string, salt: Uint8Array): Promise<CryptoKey> {
  const combinedPassword = new TextEncoder().encode(password + securityKey);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    combinedPassword,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// Generates a random security key.
export function generateSecurityKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Encrypts a file. Prepends salt, IV, and metadata to the ciphertext.
export async function encryptFile(file: File, password: string, securityKey: string): Promise<{ blob: Blob }> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, securityKey, salt);

  const metadata: FileMetadata = { name: file.name, type: file.type || 'application/octet-stream' };
  const metadataString = JSON.stringify(metadata);
  const metadataBytes = new TextEncoder().encode(metadataString);
  const metadataLengthBytes = new Uint16Array([metadataBytes.length]);

  const fileBuffer = await file.arrayBuffer();
  const encryptedContent = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    fileBuffer
  );

  const combined = new Blob([
    salt,
    iv,
    new Uint8Array(metadataLengthBytes.buffer),
    metadataBytes,
    new Uint8Array(encryptedContent)
  ]);

  return { blob: combined };
}

// Decrypts a file. Extracts salt, IV, and metadata from the start of the file.
export async function decryptFile(encryptedFile: File, password: string, securityKey: string): Promise<{ blob: Blob, metadata: FileMetadata }> {
  const fileBuffer = await encryptedFile.arrayBuffer();
  
  if (fileBuffer.byteLength < SALT_LENGTH + IV_LENGTH + 2) {
    throw new Error("Invalid or corrupt encrypted file.");
  }

  let offset = 0;
  const salt = fileBuffer.slice(offset, offset + SALT_LENGTH);
  offset += SALT_LENGTH;

  const iv = fileBuffer.slice(offset, offset + IV_LENGTH);
  offset += IV_LENGTH;
  
  const metadataLength = new Uint16Array(fileBuffer.slice(offset, offset + 2))[0];
  offset += 2;

  if (fileBuffer.byteLength < offset + metadataLength) {
    throw new Error("Invalid or corrupt encrypted file metadata.");
  }

  const metadataBytes = fileBuffer.slice(offset, offset + metadataLength);
  offset += metadataLength;

  const encryptedContent = fileBuffer.slice(offset);

  const metadataString = new TextDecoder().decode(metadataBytes);
  const metadata: FileMetadata = JSON.parse(metadataString);
  
  const key = await deriveKey(password, securityKey, salt);

  try {
    const decryptedContent = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encryptedContent
    );
    
    const originalBlob = new Blob([decryptedContent], { type: metadata.type });
    return { blob: originalBlob, metadata: metadata };

  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed. Please check your password and security key.");
  }
}

// Encrypts text for the demo page. Returns a base64 string.
export async function encryptText(text: string, password: string, securityKey: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const key = await deriveKey(password, securityKey, salt);
    
    const encodedText = new TextEncoder().encode(text);
    const encryptedContent = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encodedText);

    const combined = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedContent), salt.length + iv.length);
    
    // Convert Uint8Array to a binary string, then to base64
    const binaryString = Array.from(combined).map(byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
}

// Decrypts base64 text for the demo page.
export async function decryptText(encryptedTextBase64: string, password: string, securityKey: string): Promise<string> {
    // Convert base64 to a binary string, then to Uint8Array
    const binaryString = atob(encryptedTextBase64);
    const encryptedBytes = new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i));
    
    if (encryptedBytes.length < SALT_LENGTH + IV_LENGTH) {
      throw new Error("Invalid encrypted text.");
    }
    
    const salt = encryptedBytes.slice(0, SALT_LENGTH);
    const iv = encryptedBytes.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encryptedContent = encryptedBytes.slice(SALT_LENGTH + IV_LENGTH);

    const key = await deriveKey(password, securityKey, salt);

    try {
      const decryptedContent = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, encryptedContent);
      return new TextDecoder().decode(decryptedContent);
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Decryption failed. Please check your password and security key.");
    }
}
