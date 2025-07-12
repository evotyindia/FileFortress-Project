# 🛡️ FileFortress: Secure Client-Side File Encryption

![FileFortress Banner](https://placehold.co/1200x600.png?text=FileFortress)
<p align="center">
  <em>Secure your files with robust, client-side encryption. Your data is encrypted and decrypted directly in your browser. Nothing is ever sent to our servers.</em>
</p>

---

## Table of Contents

- [Introduction](#introduction)
- [Core Philosophy](#core-philosophy)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Architectural Overview](#architectural-overview)
  - [Client-Side Cryptography](#client-side-cryptography)
  - [AI Integration with Genkit](#ai-integration-with-genkit)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Introduction

FileFortress is a modern, privacy-first web application designed for secure file encryption and decryption. It leverages the power of the Web Crypto API, a standard built into modern browsers, to perform all cryptographic operations directly on the client-side. This means your files, passwords, and security keys are **never** uploaded, stored, or processed on any server, providing a true zero-knowledge security model.

This project was built to empower individuals to take control of their own data privacy without needing to trust a third-party service with their most sensitive information.

## Core Philosophy

Our design and architecture are guided by three fundamental principles:

1.  **Client-Side First:** Every cryptographic operation happens in your browser. This is the cornerstone of our privacy guarantee. We can't lose, access, or misuse data we never have.
2.  **Zero-Knowledge:** We, the creators of FileFortress, know nothing about your data. The encryption and decryption process is mathematically secure and relies solely on the password and security key that only you possess.
3.  **Transparency and Trust:** By using standardized web technologies (Web Crypto API) and providing an interactive demo, we aim to be completely transparent about how our system works.

## Key Features

-   **Secure File Encryption:** Upload any file and secure it with a strong, user-defined password and a cryptographically random security key.
-   **Reliable File Decryption:** Decrypt your `.fortress` files using the same password and security key.
-   **Client-Side Processing:** All operations are performed locally. No files or keys are ever transmitted over the network.
-   **AI-Powered Filename Suggestions:** Get creative and secure-sounding filenames for your encrypted files, powered by Genkit.
-   **Interactive Demo:** Understand the encryption/decryption process in real-time with a simple text-based demo, showing you exactly how your data is transformed.
-   **AI Assistant ("Cipher"):** A helpful chatbot that can answer questions about the site, explain cybersecurity concepts, and even perform text encryption/decryption for demonstration.
-   **Responsive Design:** A clean, modern, and fully responsive user interface that works on any device.
-   **Light/Dark Mode:** A comfortable viewing experience in any lighting condition.

## Technology Stack

FileFortress is built with a modern, robust, and type-safe technology stack:

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **UI Library:** [React](https://react.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
-   **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) (for Gemini)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Deployment:** Firebase App Hosting

## Getting Started

Follow these instructions to set up and run the project locally for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 20.x or higher recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)
-   A Google Cloud project with the AI Platform API enabled to use Genkit with Gemini.

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/evotyindia/FileFortress-Project.git
    cd filefortress
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example:
    ```bash
    cp .env.example .env
    ```
    Populate the `.env` file with your Google Cloud project credentials for Genkit.

4.  **Run the development server:**
    The application requires two separate processes to run concurrently: the Next.js frontend and the Genkit AI server.

    -   **In your first terminal, run the Next.js app:**
        ```bash
        npm run dev
        ```
        This will start the frontend on `http://localhost:9002`.

    -   **In a second terminal, run the Genkit development server:**
        ```bash
        npm run genkit:dev
        ```
        This starts the Genkit process, which the Next.js app will call for AI-related tasks.

5.  **Open the application:**
    Navigate to `http://localhost:9002` in your browser to see the application running.

## Project Structure

The project follows a standard Next.js App Router structure with some key directories:

```
.
├── src/
│   ├── app/
│   │   ├── (main)/               # Main application pages with shared layout
│   │   │   ├── about/
│   │   │   ├── decrypt/
│   │   │   ├── demo/
│   │   │   ├── encrypt/
│   │   │   ├── support/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx          # Dashboard page
│   │   ├── globals.css           # Global styles and ShadCN theme variables
│   │   └── layout.tsx            # Root layout
│   ├── ai/
│   │   ├── flows/                # Genkit flows for AI functionality
│   │   └── genkit.ts             # Genkit configuration
│   ├── components/
│   │   ├── ui/                   # ShadCN UI components
│   │   ├── layout/               # Layout components (Navbar, Footer)
│   │   ├── chatbot-widget.tsx
│   │   ├── demo-handler.tsx
│   │   ├── file-handler.tsx
│   │   └── icons.tsx
│   ├── lib/
│   │   ├── crypto.ts             # Core client-side cryptographic functions
│   │   └── utils.ts              # Utility functions (e.g., cn for classnames)
│   └── hooks/
│       ├── use-toast.ts
│       └── use-mobile.ts
├── public/                       # Static assets
└── prototype.md                  # Detailed project specifications
```

## Architectural Overview

### Client-Side Cryptography

The security of FileFortress hinges on the fact that all sensitive operations occur in the user's browser.

-   **Key Derivation:** We use **PBKDF2** with **SHA-256** and **100,000 iterations**. The user's password and the generated security key are combined and stretched to create a robust 256-bit encryption key. This makes brute-force attacks extremely difficult.
-   **Encryption:** We use **AES-GCM (Galois/Counter Mode)** for authenticated encryption. This not only encrypts the data but also provides integrity checks, ensuring the data has not been tampered with upon decryption.
-   **File Packaging:** The final downloadable `.fortress` file is a `Blob` containing the cryptographic `salt`, the `iv` (Initialization Vector), file metadata (original name and type), and the encrypted content.

### AI Integration with Genkit

We use Google's Genkit to orchestrate our interactions with the Gemini AI model.

-   **Flows:** Each distinct AI task (e.g., generating a filename, handling chatbot conversations) is defined as a `flow` in the `src/ai/flows/` directory.
-   **Schemas:** We use Zod schemas to define the exact input and output structure for each flow. This ensures type safety and predictable, structured JSON responses from the AI, which prevents runtime errors.
-   **Tool Use:** The chatbot flow (`chatbot-flow.ts`) demonstrates advanced AI agent capabilities by giving Gemini access to "tools" (e.g., `encryptText`, `decryptText`). The AI can decide when and how to use these tools based on the conversation, allowing it to perform actions for the user.

## Deployment

This application is configured for deployment on **Firebase App Hosting**. To deploy a production build, you can use the Firebase CLI.

1.  **Build the project:**
    ```bash
    npm run build
    ```

2.  **Deploy to Firebase:**
    Ensure you have the Firebase CLI installed and are logged in.
    ```bash
    firebase deploy --only apphosting
    ```

## Contributing

N/A