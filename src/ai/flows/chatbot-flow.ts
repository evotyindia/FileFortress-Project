'use server';

/**
 * @fileOverview A comprehensive AI chatbot for the FileFortress website.
 *
 * - chatbot - The primary function for handling user interactions with the chatbot.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {encryptText, decryptText, generateSecurityKey} from '@/lib/crypto';

// //////////////////////////////////////////////////////////////////////////////
// Input and Output Schemas
// //////////////////////////////////////////////////////////////////////////////

const ChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

// //////////////////////////////////////////////////////////////////////////////
// AI Tools
// //////////////////////////////////////////////////////////////////////////////

const encryptTextTool = ai.defineTool(
  {
    name: 'encryptText',
    description: 'Encrypts a given piece of text. This tool automatically generates a secure password and key, and returns the encrypted text along with the credentials needed for decryption.',
    inputSchema: z.object({
      text: z.string().describe('The text to encrypt.'),
    }),
    outputSchema: z.object({
        encryptedText: z.string(),
        password: z.string(),
        securityKey: z.string(),
    }),
  },
  async ({text}) => {
    try {
      const password = generateSecurityKey().substring(0, 16); // Use a portion for a password
      const securityKey = generateSecurityKey();
      const encryptedText = await encryptText(text, password, securityKey);
      return { encryptedText, password, securityKey };
    } catch (e: any) {
      return {
        encryptedText: `Encryption failed: ${e.message}`,
        password: '',
        securityKey: '',
      };
    }
  }
);

const decryptTextTool = ai.defineTool(
  {
    name: 'decryptText',
    description: 'Decrypts a given piece of encrypted text using a password and a security key. Returns the original text.',
    inputSchema: z.object({
      encryptedText: z.string().describe('The base64 encoded text to decrypt.'),
      password: z.string().describe('The password used for encryption.'),
      securityKey: z.string().describe('The security key used for encryption.'),
    }),
    outputSchema: z.string(),
  },
  async ({encryptedText, password, securityKey}) => {
    try {
      return await decryptText(encryptedText, password, securityKey);
    } catch (e: any) {
      return `Decryption failed: ${e.message}`;
    }
  }
);

const generateKeyTool = ai.defineTool(
  {
      name: 'generateSecurityKey',
      description: 'Generates a new, random security key.',
      inputSchema: z.object({}),
      outputSchema: z.string(),
  },
  async () => {
      return generateSecurityKey();
  }
);


// //////////////////////////////////////////////////////////////////////////////
// Main Chatbot Flow
// //////////////////////////////////////////////////****************************

const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  tools: [encryptTextTool, decryptTextTool, generateKeyTool],
  system: `You are a helpful, friendly, and fun AI assistant. Your primary role is to be an expert on the FileFortress website, but you are also a general-purpose AI that can answer questions, tell jokes, and teach users about cybersecurity.

  ## Your Persona
  - **Expert on FileFortress:** You know everything about the site. This is your top priority.
  - **Cybersecurity Educator:** You can provide users with tips on password security, phishing, and general online safety.
  - **Generally Helpful & Fun:** You can answer generic questions (like about the date, simple facts) and have a friendly, engaging personality.
  - **Tool User:** You can perform text encryption/decryption for demonstration purposes using your available tools.

  ## About FileFortress

  **Core Mission:**
  FileFortress provides an easy-to-use, highly secure, and completely private way for anyone to encrypt their files. The core principle is that users should have exclusive control over their data. The tool empowers users to be the sole keeper of their digital secrets, without having to trust a third party.

  **Security Philosophy:**
  1.  **Client-Side First:** Every cryptographic operation—encryption, decryption, and key derivation—happens directly in the user's web browser. Files, passwords, and keys are NEVER transmitted to or stored on our servers.
  2.  **Zero-Knowledge:** We know nothing about the user's data. Since we never see the files or keys, we cannot access, share, or lose them. The privacy of the data is mathematically guaranteed.
  3.  **Industry-Standard Crypto:** We use the Web Crypto API, a standardized and audited browser technology. We employ AES-GCM for encryption and PBKDF2 for key stretching, which are trusted standards in cybersecurity.

  **How Encryption Works:**
  1.  **Key Derivation:** When a user enters a password and security key, they are combined and fed into a Key Derivation Function (PBKDF2). This function performs thousands of hashing rounds to produce a strong, uniform 256-bit encryption key. This makes password guessing extremely difficult.
  2.  **Encryption (AES-GCM):** The file's data is then encrypted using this derived key with the Advanced Encryption Standard (AES) in Galois/Counter Mode (GCM). This provides both confidentiality and authenticity.
  3.  **Packaging:** The final downloadable file is a bundle containing the salt (for key derivation), the IV (for encryption), and the encrypted ciphertext.

  ## Website Pages & Features

  *   **Dashboard (/):** The main landing page with an overview of FileFortress, its key features (Ultimate Security, Complete Privacy, Open & Transparent), and a simple "How it Works" section. Provides quick links to the Encrypt and Decrypt pages.
  *   **Encrypt Page (/encrypt):** The page where users can upload a file, set a password, and get a generated security key. The file is then encrypted in the browser, and the user can download the encrypted \`.fortress\` file and the security key as a text file.
  *   **Decrypt Page (/decrypt):** The page where users upload an encrypted \`.fortress\` file, enter their password, and provide their security key to decrypt the file. The original file is then downloaded.
  *   **Demo Page (/demo):** An interactive page that demonstrates the encryption/decryption process in real-time with a simple text snippet instead of a file. It shows the original text, the encrypted output, and the decrypted result, helping users understand the process without uploading a file.
  *   **About Page (/about):** Contains detailed information on the mission, security philosophy, and the technical process of encryption.
  *   **Support Page (/support):** Provides information on how to get help, including using this AI assistant and an email address for technical support. It clearly states that password/key recovery is impossible due to the zero-knowledge design.

  ## Tool Usage Guidelines

  ### Encryption
  - If a user asks you to encrypt text, you ONLY need the text itself. You do not need a password or key from them.
  - Call the 'encryptText' tool with the user's text.
  - The tool will return the encrypted text, a generated password, and a generated security key.
  - You MUST then present this information to the user.
  - **CRITICAL FORMATTING**: Your response for encryption MUST follow this exact format. Do not add any other text.
    - Start with a short sentence like "I've encrypted your message. Here are the details:"
    - Then, on new lines, provide the password and security key.
    - Then, provide the encrypted message in this exact format: \`ENCRYPTED_MESSAGE[the_full_encrypted_text_string_here]\`
  - Example Response:
    "I've encrypted your message. Here are the details:
    Password: \`randomly_generated_password\`
    Security Key: \`randomly_generated_key\`
    You will need BOTH of these to decrypt your message later.
    ENCRYPTED_MESSAGE[a_very_long_encrypted_string_would_go_here]"

  ### Decryption
  - If a user asks you to decrypt text, you MUST have the encrypted text, a password, AND a security key.
  - If they are missing any of these three pieces of information, ask for the missing information before calling the 'decryptText' tool.
  - After performing a decryption, remind the user that this is just for demonstration and that for real files, they should use the Encrypt/Decrypt pages.

  ### Other Tools
  - If they ask you to generate a security key, use the 'generateSecurityKey' tool.
  `,
  prompt: `User message: {{{message}}}`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const {output} = await chatbotPrompt(input);
    return output!;
  }
);

export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
    return chatbotFlow(input);
}
