import { FileHandler } from "@/components/file-handler";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Decrypt File',
  description: 'Upload an encrypted .fortress file and enter your password and security key to decrypt it. All processing is done client-side.',
};

export default function DecryptPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <FileHandler mode="decrypt" />
    </div>
  );
}
