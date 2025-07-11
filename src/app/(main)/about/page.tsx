import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ServerOff, Cpu } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About FileFortress',
  description: 'Learn about the mission and technology behind FileFortress, a client-side file encryption tool.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <section className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-headline">About FileFortress</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Your personal digital vault, built on privacy and trust.
          </p>
        </section>

        <section className="mt-20 space-y-10">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-lg">
              <p>
                In an era where data privacy is increasingly under threat, FileFortress was created with a simple yet powerful mission: to provide an easy-to-use, highly secure, and completely private way for anyone to encrypt their files. We believe that you should have exclusive control over your data. Our tool empowers you to be the sole keeper of your digital secrets, without having to trust a third party with your sensitive information.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-4xl font-bold font-headline text-center pt-8">Our Security Philosophy</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="p-5 bg-primary/10 rounded-full mb-5">
                <Cpu className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-semibold">Client-Side First</h3>
              <p className="text-muted-foreground mt-2 text-lg">
                Every cryptographic operation—encryption, decryption, and key derivation—happens directly in your web browser. Your files and keys are never transmitted to, or stored on, our servers.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-5 bg-primary/10 rounded-full mb-5">
                <ServerOff className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-semibold">Zero-Knowledge</h3>
              <p className="text-muted-foreground mt-2 text-lg">
                We know nothing about your data. Since we never see your files or your keys, we cannot access, share, or lose them. The privacy of your data is mathematically guaranteed.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-5 bg-primary/10 rounded-full mb-5">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-semibold">Industry-Standard Crypto</h3>
              <p className="text-muted-foreground mt-2 text-lg">
                We use the Web Crypto API, a standardized and audited browser technology, to perform all operations. We employ AES-GCM for encryption and PBKDF2 for key stretching, trusted standards in cybersecurity.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">How Encryption Works</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-lg">
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Key Derivation:</strong> When you enter a password and security key, we don't use them directly. Instead, we combine them and feed them into a Key Derivation Function (PBKDF2). This function performs thousands of hashing rounds to produce a strong, uniform 256-bit encryption key. This process makes password guessing extremely difficult and time-consuming for an attacker.
                </li>
                <li>
                  <strong>Encryption (AES-GCM):</strong> Your file's data is then encrypted using this derived key with the Advanced Encryption Standard (AES) in Galois/Counter Mode (GCM). AES is the standard for data encryption used by governments and organizations worldwide. The GCM mode provides both confidentiality and authenticity, meaning it not only encrypts the data but also ensures it hasn't been tampered with.
                </li>
                <li>
                  <strong>Packaging:</strong> The final downloadable file is a bundle containing the salt (a random value used in key derivation), the IV (an initialization vector for encryption), and the encrypted ciphertext. When you decrypt, the app unpacks these components to reverse the process.
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
