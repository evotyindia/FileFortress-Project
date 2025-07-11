import { DemoHandler } from "@/components/demo-handler";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Demo',
  description: 'See how client-side encryption works in real-time. Encrypt and decrypt a text snippet to understand the process.',
};

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
       <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Encryption in Action
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          This interactive demo shows you exactly how FileFortress protects your data, all within your browser.
        </p>
      </div>
      <DemoHandler />
    </div>
  );
}
