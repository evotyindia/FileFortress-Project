import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: 'FileFortress - Secure Client-Side File Encryption',
    template: '%s | FileFortress',
  },
  description: 'Encrypt and decrypt your files securely in your browser. FileFortress uses client-side encryption, ensuring your files and keys never leave your device.',
  openGraph: {
    title: 'FileFortress - Secure Client-Side File Encryption',
    description: 'Securely encrypt and decrypt files on the client-side with no server storage.',
    type: 'website',
    locale: 'en_US',
    url: 'https://filefortress.app', // Replace with actual domain
    siteName: 'FileFortress',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
