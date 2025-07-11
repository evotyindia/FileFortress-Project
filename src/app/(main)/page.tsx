import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lock, Unlock, ShieldCheck, Wallet, Atom } from "lucide-react";
import { ChatbotWidget } from "@/components/chatbot-widget";

export default function DashboardPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 md:py-24">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight text-primary">
            FileFortress
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Secure your files with robust, client-side encryption. Your data is encrypted and decrypted directly in your browser. Nothing is ever sent to our servers.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/encrypt">Encrypt a File <Lock className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/decrypt">Decrypt a File <Unlock className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-24">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex-row items-center gap-4">
                 <div className="bg-primary/10 p-4 rounded-full">
                    <ShieldCheck className="w-8 h-8 text-primary"/>
                 </div>
                 <CardTitle className="font-headline text-xl">Ultimate Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Using the Web Crypto API with AES-GCM encryption, your files are secured with industry-standard algorithms before they ever leave your machine.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex-row items-center gap-4">
                 <div className="bg-primary/10 p-4 rounded-full">
                    <Wallet className="w-8 h-8 text-primary" />
                 </div>
                <CardTitle className="font-headline text-xl">Complete Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We are a zero-knowledge service. We don't store your files, passwords, or keys. Your privacy is paramount and guaranteed.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex-row items-center gap-4">
                 <div className="bg-primary/10 p-4 rounded-full">
                    <Atom className="w-8 h-8 text-primary" />
                 </div>
                <CardTitle className="font-headline text-xl">Open & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  FileFortress is built on open web standards. The entire process is transparent and can be verified. See how it works on our Demo page.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

         {/* How it works */}
        <section className="mt-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold font-headline">Simple, Secure, Serverless</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Follow three easy steps to protect your data.
            </p>
          </div>
          <div className="relative mt-16 grid md:grid-cols-3 gap-8 items-start">
            <div className="absolute w-full h-1 bg-border/50 top-8 left-0 hidden md:block" />
            <div className="relative bg-background p-2 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold font-headline mb-6 z-10">1</div>
                <h3 className="font-headline font-semibold text-xl">Upload & Secure</h3>
                <p className="text-muted-foreground text-base mt-2">Choose a file and create a strong password and security key.</p>
            </div>
            <div className="relative bg-background p-2 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold font-headline mb-6 z-10">2</div>
                <h3 className="font-headline font-semibold text-xl">Encrypt In-Browser</h3>
                <p className="text-muted-foreground text-base mt-2">Your file is instantly encrypted on your device. No uploads needed.</p>
            </div>
            <div className="relative bg-background p-2 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold font-headline mb-6 z-10">3</div>
                <h3 className="font-headline font-semibold text-xl">Download & Save</h3>
                <p className="text-muted-foreground text-base mt-2">Download the encrypted file. Only you can unlock it with your keys.</p>
            </div>
          </div>
        </section>
      </div>
      <ChatbotWidget />
    </>
  );
}
