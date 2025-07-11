import { FileHandler } from "@/components/file-handler";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Encrypt File',
  description: 'Upload a file to securely encrypt it with a password and security key. All processing is done client-side.',
};

export default function EncryptPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <FileHandler mode="encrypt" />
    </div>
  );
}
