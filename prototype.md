# FileFortress - Ultra-Detailed Project Specifications & Architecture

This document provides a highly detailed specification for the FileFortress project, covering brand identity, user architecture, core feature processing, and data models. It serves as the primary blueprint for development and understanding the application's functionality.

---

## 1. Brand Identity & Design System

The brand identity is engineered to be trustworthy, modern, and secure, reflecting its privacy-centric mission. The design system is implemented via Tailwind CSS and CSS variables in `src/app/globals.css`.

### 1.1. Typography System

The font selection creates a clear visual hierarchy, enhancing readability and user experience. This is configured in `src/app/layout.tsx` and applied via utility classes in `tailwind.config.ts`.

-   **Heading & Brand Font:** `Poppins` (via `--font-poppins` variable)
    -   **Usage:** Applied with the `font-headline` utility class. Used for the site logo, main page titles (H1), and major section headers (H2).
    -   **Typographic Scale:**
        -   **H1 (`text-5xl`, `md:text-6xl`):** For main page titles (e.g., "About FileFortress").
        -   **H2 (`text-4xl`):** For major section titles (e.g., "Our Security Philosophy").
        -   **Card Titles (`text-2xl`, `text-3xl`):** For `CardTitle` components.
    -   **Weights:** Bold (`font-bold`) for titles, Semi-Bold (`font-semibold`) for subtitles.
    -   **Rationale:** Poppins provides a modern authority that builds trust in the brand's security promises. Its geometric forms are clean and scalable.

-   **Body Content Font:** `PT Sans` (via `--font-pt-sans` variable)
    -   **Usage:** Applied with the `font-body` utility class as the default body font. Used for all paragraphs, descriptions, `CardDescription`, `AlertDescription`, and form inputs.
    -   **Typographic Scale:**
        -   **Large Paragraphs (`text-lg`, `md:text-xl`):** For hero section descriptions.
        -   **Standard Body (`text-lg`):** For main content and descriptions for optimal readability.
        -   **Form Inputs (`text-base`, `text-lg`):** To ensure clarity and legibility when entering data.
    -   **Weight:** Regular (`font-normal`).
    -   **Rationale:** PT Sans is a highly readable sans-serif that pairs well with Poppins, ensuring clarity for detailed explanations and instructions without causing user fatigue.

-   **Monospaced Font:** `monospace`
    -   **Usage:** Applied with the `font-mono` utility class. Used exclusively for displaying the Security Key and encrypted text outputs to visually distinguish them as machine-generated data.

### 1.2. Color Palette & Theming

The color scheme is managed via HSL CSS custom properties in `src/app/globals.css`, enabling seamless light/dark mode switching.

-   **Primary Color (`--primary`):** `hsl(250 80% 63%)` - `#6246EA` (Deep Purple)
    -   **Usage:** The foundational color for primary actions (`Button` default variant), links, icons, and highlights.
    -   **Rationale:** Conveys a sense of security, trust, and sophistication.

-   **Accent Color (`--accent`):** `hsl(190 100% 59%)` - `#2DD4FF` (Teal)
    -   **Usage:** A bright, contrasting color used for secondary highlights, hover states on some components (`Button` outline variant), and to draw attention.

-   **Background Color (`--background`):**
    -   **Light Mode:** `hsl(0 0% 96.1%)` - `#F5F5F5` (Very Light Gray)
    -   **Dark Mode:** `hsl(240 10% 3.9%)`
    -   **Rationale:** Provides a clean, neutral canvas. The dark mode color is a deep charcoal, not pure black, to reduce eye strain.

-   **Destructive Color (`--destructive`):** `hsl(0 84.2% 60.2%)`
    -   **Usage:** For critical warnings (`Alert` with `destructive` variant) and error states. High contrast ensures it's unmissable.

-   **UI State Implementation:**
    -   **Hover:** Buttons and interactive elements use a slightly darker shade of their base color (`bg-primary/90`) or the accent color (`hover:bg-accent`) for feedback.
    -   **Focus:** Input fields and buttons use a ring outline (`focus-visible:ring-2 focus-visible:ring-ring`) with the `--ring` variable set to the primary color.
    -   **Disabled:** Elements use `disabled:opacity-50` and `disabled:pointer-events-none` for a clear, non-interactive state.

---

## 2. Page Architecture

The application's pages guide the user through the core encryption and decryption flows logically.

-   **Dashboard (`/`):**
    -   **User Goal:** Understand the app's value proposition and navigate to core tasks.
    -   **Primary Components:** `Button`, `Card`, `Lock`, `Unlock` icons.
    -   **Key UI Elements:** Features prominent "Encrypt" and "Decrypt" `Button`s. Uses `Card`s to highlight key features. A step-by-step "How it Works" section visually guides the user. The `ChatbotWidget` is available globally from this page.

-   **Encryption Page (`/encrypt`):**
    -   **User Goal:** Securely encrypt a file.
    -   **Primary Components:** `FileHandler` (in "encrypt" mode).
    -   **Key UI Elements:** A drag-and-drop file input area, password fields with strength indicators and show/hide toggles, a read-only field for the generated security key, and an `Alert` with `variant="destructive"` to warn about saving credentials.

-   **Decryption Page (`/decrypt`):**
    -   **User Goal:** Securely decrypt a `.fortress` file.
    -   **Primary Components:** `FileHandler` (in "decrypt" mode).
    -   **Key UI Elements:** Mirrors the encryption page for consistency. Features a file upload area for the `.fortress` file, and input fields for the user's password and security key.

-   **About Page (`/about`):**
    -   **User Goal:** Understand the company's mission and the technology behind the service.
    -   **Primary Components:** `Card`.
    -   **Key UI Elements:** Uses `Card` components to structure information logically. Features icons like `Cpu`, `ServerOff`, and `ShieldCheck` to visually reinforce concepts like client-side processing and zero-knowledge.

-   **Support Page (`/support`):**
    -   **User Goal:** Find help for common questions or contact support for technical issues.
    -   **Primary Components:** `Card`, `Alert`.
    -   **Key UI Elements:** Directs users to the AI assistant for common questions. Provides a contact email while using a prominent `Alert` to state that password/key recovery is impossible.

-   **Demo Page (`/demo`):**
    -   **User Goal:** Understand the encryption process interactively without uploading a real file.
    -   **Primary Components:** `DemoHandler`.
    -   **Key UI Elements:** Features `Textarea` for input and output, `Input` for password/key, and `Button`s to trigger encryption/decryption. The layout visually flows from left to right, showing the transformation of data.

---

## 3. Core Features: Processing & Data Flow

This section details the end-to-end technical process for the application's core features.

### 3.1. File Encryption

-   **Objective:** To securely encrypt a user's file entirely within their browser.
-   **Technical Implementation (`/lib/crypto.ts`):**
    1.  **Input:** User provides a `File` object and a `password` string. The `generateSecurityKey()` function creates a cryptographically random 32-byte key.
    2.  **Key Derivation (`deriveKey` function):**
        -   A new random `salt` (16 bytes, `Uint8Array`) is generated using `crypto.getRandomValues`.
        -   The `password` and `securityKey` are concatenated and encoded into a `Uint8Array`.
        -   `crypto.subtle.importKey` creates a raw key material from the combined password.
        -   `crypto.subtle.deriveKey` uses **PBKDF2** with **SHA-256**, the `salt`, and **100,000 iterations** to produce a strong, uniform 256-bit AES-GCM `CryptoKey`.
    3.  **Encryption (`encryptFile` function):**
        -   A new random `iv` (Initialization Vector, 12 bytes) is generated.
        -   The file's data is read into an `ArrayBuffer`.
        -   `crypto.subtle.encrypt` is called with the `"AES-GCM"` algorithm, the derived `CryptoKey`, and the `iv`.
    4.  **Packaging (File Structure):** The final downloadable `.fortress` file is a `Blob` constructed by concatenating the following `Uint8Array`s in order:
        -   `Salt` (16 bytes)
        -   `IV` (12 bytes)
        -   `Metadata Length` (2 bytes, as `Uint16Array`)
        -   `File Metadata` (variable bytes, JSON string of `{ name, type }`)
        -   `Encrypted File Content` (remaining bytes)
    5.  **Output:** The user is prompted to download the encrypted `.fortress` `Blob` and a separate `.txt` file containing their security key.

### 3.2. File Decryption

-   **Objective:** To securely decrypt a `.fortress` file using the user's password and security key.
-   **Technical Implementation (`/lib/crypto.ts`):**
    1.  **Input:** The user uploads the encrypted `.fortress` file and provides their `password` and `securityKey`.
    2.  **Unpackaging (`decryptFile` function):** The app reads the file into an `ArrayBuffer` and uses `ArrayBuffer.slice()` to extract the components in reverse order based on their known byte lengths:
        -   `salt` is read from bytes 0-16.
        -   `iv` is read from bytes 16-28.
        -   `metadataLength` is read from bytes 28-30.
        -   `metadataBytes` are read from byte 30 for `metadataLength` bytes.
        -   The remaining buffer is the `encryptedContent`.
    3.  **Key Derivation (`deriveKey` function):** The `password`, `securityKey`, and extracted `salt` are used to re-derive the exact same 256-bit `CryptoKey` via the same PBKDF2 process.
    4.  **Decryption (`decryptFile` function):** `crypto.subtle.decrypt` is called with the derived key and extracted `iv`. This step will fail and throw an error if the password or key is incorrect, which is caught in a `try...catch` block.
    5.  **Output:** If successful, the decrypted `ArrayBuffer` is turned back into a `Blob` with its original file type, and the user's browser prompts them to download the original file.

### 3.3. Gemini AI Assistant

-   **Objective:** To provide a helpful AI chatbot that can answer questions about the website, explain cybersecurity concepts, and demonstrate the encryption/decryption process.
-   **Technical Implementation (`/ai/flows/chatbot-flow.ts`):**
    1.  **Client Interaction:** The `ChatbotWidget` component manages the UI state, including the message history (`messages`).
    2.  **API Call:** On send, the `chatbot` function is called, passing `message` and `history`.
    3.  **Backend Processing (`chatbotFlow`):**
        -   The flow's `system` prompt defines the AI's persona ("Cipher") and its knowledge base (pages, security model, current date).
        -   The prompt explicitly defines the response format using `ChatbotOutputSchema` and provides instructions for tool use.
    4.  **AI Tool Use:**
        -   The AI has access to `Tools` for `encryptText`, `decryptText`, and `generateSecurityKey`, which wrap the functions from `lib/crypto`.
        -   If a user asks "encrypt 'hello world'", the AI decides to call the `encryptText` tool. The result is returned to the AI, which then formats it according to the strict "CRITICAL FORMATTING" rules in the prompt (e.g., `SECURITY_KEY[...]`).
    5.  **AI Generation (Gemini):** Gemini processes the user's question, history, and tool outputs to generate a response that matches `ChatbotOutputSchema`.
    6.  **Response & Rendering:** The structured JSON is returned. The `ChatbotWidget` uses a special `EncryptedMessage` component to parse and render the formatted encrypted text with "Copy" and "Show/Hide" buttons. Suggested page links are rendered as `Button`s.

---

## 4. UI Component Guidelines & Implementation

The UI is built with **ShadCN UI**, leveraging its composition-first approach for consistency and accessibility.

-   **`Card`:** The foundational UI container. Used in `FileHandler` for the main form, `DashboardPage` for feature callouts, and `AboutPage` for information sections. Provides consistent padding, border, and shadow.

-   **`Input` / `Textarea`:** Core components for all user input. Used in `FileHandler` and `DemoHandler`. `FileHandler` uses two `Input`s of `type="password"` for password confirmation, with state managed to toggle visibility.

-   **`Button`:** Used for all primary actions.
    -   **Default Variant:** Used for primary CTAs like "Encrypt File."
    -   **Secondary Variant:** Used for less critical actions like "Download Security Key" or "Generate Key."
    -   **Link Variant:** Used for non-disruptive actions like "Remove file" or "Encrypt Another File."
    -   **Ghost Variant:** Used for icon-only buttons like the password visibility toggle.

-   **`Alert`:** Used in `FileHandler` with `variant="destructive"` to display the critical security warning. The `AlertTriangle` icon is included for immediate visual emphasis.

-   **`Label`:** Used consistently for all form fields to ensure accessibility by linking the label's `htmlFor` attribute to the input's `id`.

-   **`Sheet`:** Used for the mobile navigation menu in `Navbar`. It provides a clean, off-canvas experience on smaller screens, triggered by a `Button` with the `Menu` icon.

-   **`ScrollArea`:** Implemented in the `ChatbotWidget` to ensure the conversation history is scrollable while the header and footer remain fixed.

    