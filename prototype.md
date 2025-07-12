# FileFortress - Comprehensive Project Specifications & Architecture

This document provides a highly detailed specification for the FileFortress project, covering brand identity, user architecture, core feature processing, and data models. It serves as the primary blueprint for development and understanding the application's functionality.

---

## 1. Brand Identity & Design System

The brand identity is engineered to be trustworthy, modern, and secure, reflecting its privacy-centric mission.

### 1.1. Typography System

The font selection creates a clear visual hierarchy, enhancing readability and user experience.

-   **Heading & Brand Font:** `Poppins`
    -   **Usage:** Main page titles, navigation branding, and major section headers.
    -   **Weights:** Bold for H1/H2 titles.
    -   **Rationale:** Poppins was chosen for its clean, geometric, and friendly letterforms, which convey a sense of modern authority and approachability.

-   **Body Content Font:** `PT Sans`
    -   **Usage:** All body text, including paragraphs, descriptions, and form inputs.
    -   **Weight:** Regular.
    -   **Rationale:** PT Sans is a highly readable sans-serif font that pairs well with Poppins, ensuring clarity for detailed explanations and instructions.

### 1.2. Color Palette & Theming

The color scheme is managed via CSS custom properties (variables) in `src/app/globals.css`, allowing for seamless light/dark mode switching.

-   **Primary Color:**
    -   `#6246EA` (Deep Purple): The foundational color used for primary actions, links, and highlights. It conveys a sense of security, trust, and sophistication.

-   **Accent Color:**
    -   `#2DD4FF` (Teal): A bright, contrasting color used for secondary highlights and interactive elements to draw the user's attention.

-   **Background Color:**
    -   `#F5F5F5` (Very Light Gray): Used for the main background in light mode to ensure readability and provide a clean, neutral canvas for the content.

-   **Thematic Application (Light Mode):**
    -   **Background (`--background`):** `#F5F5F5`
    -   **Text (`--foreground`):** Dark Gray/Black for high contrast.
    -   **Primary UI (`--primary`):** `#6246EA`
    -   **Accent (`--accent`):** `#2DD4FF`

-   **Thematic Application (Dark Mode):**
    -   **Background (`--background`):** A dark charcoal or deep blue to complement the primary purple.
    -   **Text (`--foreground`):** A soft off-white to reduce glare.
    -   **Primary UI (`--primary`):** `#6246EA` (can be slightly brightened for better contrast).
    -   **Accent (`--accent`):** `#2DD4FF`

---

## 2. Page Architecture

The application's pages are designed to guide the user through the core encryption and decryption flows logically.

-   **Dashboard (`/`):** The main landing page. It provides a high-level overview of FileFortress, highlights key features (e.g., Ultimate Security, Complete Privacy), and includes a simple "How it Works" section with prominent calls-to-action to the Encrypt and Decrypt pages. The Gemini AI assistant is also featured here.

-   **Encryption Page (`/encrypt`):** This page contains the primary file encryption interface. It includes a file upload area (drag-and-drop and browse), a password input field with strength indicators, a read-only field for the generated security key, and a clear security warning about the importance of saving both the password and the key.

-   **Decryption Page (`/decrypt`):** This page mirrors the encryption page's layout for consistency. It features a file upload area for the `.fortress` file, and input fields for the user's password and security key. It also includes the same security warning.

-   **About Page (`/about`):** Provides detailed information about the mission of FileFortress, its client-side security philosophy (Zero-Knowledge), and a step-by-step overview of the underlying cryptographic process (AES-GCM, PBKDF2).

-   **Support Page (`/support`):** A simple page offering help. It directs users to the AI assistant for common questions and provides a contact email for technical support, while clearly stating that password and key recovery is impossible due to the app's design.

-   **Demo Page (`/demo`):** An interactive tool that allows users to see the encryption/decryption process in action with a simple text snippet instead of a file. This helps build trust and understanding by demonstrating the technology transparently.

---

## 3. Core Features: Processing & Data Flow

This section details the end-to-end process for the application's core features.

### 3.1. File Encryption

-   **Objective:** To securely encrypt a user's file entirely within their browser.
-   **Processing & Data Flow (Client-Side):**
    1.  **Input:** The user uploads a `File`, enters a `password`, and is shown a newly `generatedSecurityKey`.
    2.  **Key Derivation:** The `password` and `securityKey` are combined and fed into a Key Derivation Function (PBKDF2) along with a newly generated random `salt`. This process performs thousands of hashing rounds to produce a strong, uniform 256-bit encryption key.
    3.  **Encryption:** The file's data is read into an `ArrayBuffer` and encrypted using the derived key with the Advanced Encryption Standard in Galois/Counter Mode (AES-GCM), along with a newly generated random `iv` (Initialization Vector).
    4.  **Packaging:** The final downloadable `.fortress` file is a `Blob` constructed by concatenating the `salt`, `iv`, file metadata (name and type), and the encrypted file content.
    5.  **Output:** The user is prompted to download the encrypted `.fortress` file and a separate `.txt` file containing their security key.

### 3.2. File Decryption

-   **Objective:** To securely decrypt a `.fortress` file using the user's password and security key.
-   **Processing & Data Flow (Client-Side):**
    1.  **Input:** The user uploads the encrypted `.fortress` file, enters their `password`, and provides their `securityKey`.
    2.  **Unpackaging:** The application reads the `.fortress` file into an `ArrayBuffer` and extracts the `salt`, `iv`, file metadata, and encrypted content in the reverse order they were packaged.
    3.  **Key Derivation:** The `password` and `securityKey` are used with the extracted `salt` to re-derive the exact same 256-bit encryption key via PBKDF2.
    4.  **Decryption:** The derived key and extracted `iv` are used with AES-GCM to decrypt the file's content. If the password or key is incorrect, this step will fail, throwing an error.
    5.  **Output:** If successful, the decrypted file content is turned back into a `Blob` with its original file type, and the user's browser prompts them to download the original file.

### 3.3. Gemini AI Assistant

-   **Objective:** To provide a helpful AI chatbot that can answer questions about the website, explain cybersecurity concepts, and demonstrate the encryption/decryption process.
-   **Processing & Data Flow:**
    1.  **Initialization:** The `ChatbotWidget` component is rendered on the dashboard.
    2.  **User Interaction:** The user sends a message.
    3.  **API Call (Client to Genkit Flow):** The `chatbot` function is called, passing the user's message and the conversation history to the `chatbotFlow` on the server.
    4.  **Backend Processing (Genkit Flow):**
        -   The flow's prompt instructs the AI on its persona (Cipher, a friendly security expert) and its capabilities.
        -   The prompt is populated with details about FileFortress pages, its security model, and the current date.
        -   The AI has access to `Tools` for `encryptText`, `decryptText`, and `generateSecurityKey` to perform live demonstrations.
    5.  **AI Generation (Gemini):** Gemini processes the user's question within the context of the system prompt and conversation history. If the user's request involves a demonstration (e.g., "Encrypt 'hello world'"), the AI will decide to use the appropriate tool.
    6.  **Response (Server to Client):** The structured JSON output (`ChatbotOutputSchema`), containing the text response and any suggested page links, is returned to the client.
    7.  **Rendering (Client-Side):** The chat widget updates with the AI's response. If the response includes encrypted text, a special `EncryptedMessage` component is used to format it with "Copy" and "Show/Hide" buttons.

---

## 4. UI Component Guidelines & Implementation

The UI is built with **ShadCN UI**, leveraging its composition-first approach for consistency and accessibility.

-   **`Card`:** The foundational UI element. Used as the primary container for the main file handlers, feature descriptions on the dashboard, and information sections on the About and Support pages.
-   **`Input` / `Textarea`:** Core components for all user input, including passwords, security keys, and text for the demo.
-   **`Button`:** Used for all primary actions like "Encrypt File," "Decrypt File," and "Generate Key." Variants (`primary`, `secondary`, `ghost`) are used to create a clear visual hierarchy of actions.
-   **`Alert`:** Used to display critical security warnings on the Encrypt and Decrypt pages, using the `destructive` variant to ensure users pay close attention.
-   **`ScrollArea`:** Implemented in the `ChatbotWidget` to ensure the conversation history is scrollable.
-   **`Sheet`:** Used for the mobile navigation menu to provide a clean, off-canvas experience on smaller screens.