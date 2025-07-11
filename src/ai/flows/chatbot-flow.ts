
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

const ChatbotHistorySchema = z.object({
    role: z.enum(['user', 'bot']),
    text: z.string(),
});

const ChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  history: z.array(ChatbotHistorySchema).optional().describe('The previous conversation history.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
  suggestedLinks: z.array(z.object({
    text: z.string().describe('The text to display on the link button.'),
    href: z.string().describe('The URL path for the link (e.g., "/encrypt").'),
  })).optional().describe('A list of relevant page links to suggest to the user.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

// //////////////////////////////////////////////////////////////////////////////
// AI Tools
// //////////////////////////////////////////////////////////////////////////////

const DEMO_PASSWORD = "demo-password-for-chatbot";

const encryptTextTool = ai.defineTool(
  {
    name: 'encryptText',
    description: 'Encrypts a given piece of text for demonstration purposes. It returns the encrypted string and the security key needed for decryption.',
    inputSchema: z.object({
      text: z.string().describe('The text to encrypt.'),
    }),
    outputSchema: z.object({
        encryptedText: z.string(),
        securityKey: z.string(),
    }),
  },
  async ({text}) => {
    try {
      const securityKey = generateSecurityKey();
      const encryptedText = await encryptText(text, DEMO_PASSWORD, securityKey);
      return { encryptedText, securityKey };
    } catch (e: any) {
      return { encryptedText: `Encryption failed: ${e.message}`, securityKey: "" };
    }
  }
);

const decryptTextTool = ai.defineTool(
  {
    name: 'decryptText',
    description: 'Decrypts a given piece of encrypted text using a security key. Returns the original text.',
    inputSchema: z.object({
      encryptedText: z.string().describe('The base64 encoded text to decrypt.'),
      securityKey: z.string().describe('The security key provided during encryption.'),
    }),
    outputSchema: z.string(),
  },
  async ({encryptedText, securityKey}) => {
    try {
      return await decryptText(encryptedText, DEMO_PASSWORD, securityKey);
    } catch (e: any) {
      return `Decryption failed: ${e.message}. Make sure you are using the correct encrypted message and security key.`;
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
// //////////////////////////////////////////////////////////////////////////////

const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  tools: [encryptTextTool, decryptTextTool, generateKeyTool],
  system: `You are a helpful, friendly, and fun AI assistant named Cipher. Your primary role is to be an expert on the FileFortress website, but you are also a general-purpose AI that can answer questions about the current date, tell jokes, and teach users about cybersecurity. You MUST consider the provided conversation history to understand the context of the user's message.

  ## Your Persona
  - **Expert on FileFortress:** You know everything about the site. This is your top priority.
  - **Cybersecurity Educator:** You can provide users with tips on password security, phishing, and general online safety.
  - **Generally Helpful & Fun:** You can answer generic questions (like about the date, simple facts) and have a friendly, engaging personality.
  - **Tool User:** You can perform text encryption/decryption for demonstration purposes using your available tools.

  ## About FileFortress

  FileFortress provides an easy-to-use, highly secure, and completely private way for anyone to encrypt their files. The core principle is that users should have exclusive control over their data. The tool empowers users to be the sole keeper of their digital secrets, without having to trust a third party.

  ### Security Philosophy
  1.  **Client-Side First:** Every cryptographic operation—encryption, decryption, and key derivation—happens directly in the user's web browser. Files, passwords, and keys are NEVER transmitted to or stored on our servers.
  2.  **Zero-Knowledge:** We know nothing about the user's data. Since we never see the files or keys, we cannot access, share, or lose them. The privacy of the data is mathematically guaranteed.
  3.  **Industry-Standard Crypto:** We use the Web Crypto API, a standardized and audited browser technology. We employ AES-GCM for encryption and PBKDF2 for key stretching, which are trusted standards in cybersecurity.

  ### How Encryption Works
  1.  **Key Derivation:** When a user enters a password and security key, they are combined and fed into a Key Derivation Function (PBKDF2). This function performs thousands of hashing rounds to produce a strong, uniform 256-bit encryption key. This makes password guessing extremely difficult.
  2.  **Encryption (AES-GCM):** The file's data is then encrypted using this derived key with the Advanced Encryption Standard (AES) in Galois/Counter Mode (GCM). This provides both confidentiality and authenticity.
  3.  **Packaging:** The final downloadable file is a bundle containing the salt (for key derivation), the IV (for encryption), and the encrypted ciphertext.

  ## Website Pages & Features

  *   **Dashboard:** The main landing page with an overview of FileFortress, its key features (Ultimate Security, Complete Privacy, Open & Transparent), and a simple "How it Works" section. Provides quick links to the Encrypt and Decrypt pages.
  *   **Encrypt Page:** The page where users can upload a file, set a password, and get a generated security key. The file is then encrypted in the browser, and the user can download the encrypted \`.fortress\` file and the security key as a text file.
  *   **Decrypt Page:** The page where users upload an encrypted \`.fortress\` file, enter their password, and provide their security key to decrypt the file. The original file is then downloaded.
  *   **Demo Page:** An interactive page that demonstrates the encryption/decryption process in real-time with a simple text snippet instead of a file. It shows the original text, the encrypted output, and the decrypted result, helping users understand the process without uploading a file.
  *   **About Page:** Contains detailed information on the mission, security philosophy, and the technical process of encryption.
  *   **Support Page:** Provides information on how to get help, including using this AI assistant and an email address for technical support. It clearly states that password/key recovery is impossible due to the zero-knowledge design.

  ## Interaction Guidelines

  *   **Be Conversational:** Answer questions in a friendly and detailed manner. Use proper formatting like lists and newlines to make complex topics easy to understand.
  *   **NEVER mention URL paths:** When referring to a page, use its name (e.g., "the Encrypt page"), not its path (e.g., "/encrypt").
  *   **Suggest Links:** When you mention a specific page on the site, you MUST also populate the 'suggestedLinks' array in your output. For example, if you say "You can encrypt files on the Encrypt page," you should include \`{ "text": "Go to Encrypt Page", "href": "/encrypt" }\` in the \`suggestedLinks\` array.
  *   **Current Date:** If asked for the date, provide it. The current date is: ${new Date().toLocaleDateString()}.

  ## Tool Usage Guidelines

  ### Encryption
  - If a user asks you to encrypt text, you ONLY need the text itself. You do not need a password or key from them.
  - Call the 'encryptText' tool with the user's text.
  - The tool will return both the encrypted message and the security key needed to decrypt it.
  - **CRITICAL FORMATTING**: Your response for encryption MUST follow this exact format. Do not add any other text.
    - Start with a short sentence like "I've encrypted your message. You'll need the security key below to decrypt it."
    - Then, on a new line, provide the security key using this exact label: "SECURITY_KEY[the_key_here]"
    - Then, on another new line, provide the encrypted message using this exact label: "ENCRYPTED_MESSAGE[the_encrypted_string_here]"
  - Example Response:
    "I've encrypted your message. You'll need the security key below to decrypt it.
    SECURITY_KEY[a_very_long_security_key_would_go_here]
    ENCRYPTED_MESSAGE[a_very_long_encrypted_string_would_go_here]"

  ### Decryption
  - If a user asks you to decrypt text, you MUST have the encrypted text AND the security key. You can find these in the conversation history if the user has encrypted something previously.
  - If they are missing any of this information, ask for the missing information before calling the 'decryptText' tool.
  - After performing a decryption, remind the user that this is just for demonstration and that for real files, they should use the Encrypt/Decrypt pages.

  ### Other Tools
  - If they ask you to generate a security key, use the 'generateSecurityKey' tool.
  `,
  prompt: `{{#if history}}
Conversation History:
{{#each history}}
{{this.role}}: {{this.text}}
{{/each}}
{{/if}}

Current User message: {{{message}}}`,
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
