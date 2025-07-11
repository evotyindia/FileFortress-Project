import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lock, Unlock, ArrowRight, ShieldCheck, Wallet, Atom } from "lucide-react";
import { ChatbotWidget } from "@/components/chatbot-widget";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary">
            FileFortress
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Secure your files with robust, client-side encryption. Your data is encrypted and decrypted directly in your browser. Nothing is ever sent to our servers.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/encrypt">Encrypt a File <Lock className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/decrypt">Decrypt a File <Unlock className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-24">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex-row items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                    <ShieldCheck className="w-8 h-8 text-primary"/>
                 </div>
                 <CardTitle className="font-headline">Ultimate Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Using the Web Crypto API with AES-GCM encryption, your files are secured with industry-standard algorithms before they ever leave your machine.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex-row items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                    <Wallet className="w-8 h-8 text-primary" />
                 </div>
                <CardTitle className="font-headline">Complete Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We are a zero-knowledge service. We don't store your files, passwords, or keys. Your privacy is paramount and guaranteed.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex-row items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                    <Atom className="w-8 h-8 text-primary" />
                 </div>
                <CardTitle className="font-headline">Open & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  FileFortress is built on open web standards. The entire process is transparent and can be verified. See how it works on our Demo page.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

         {/* How it works */}
        <section className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-headline">Simple, Secure, Serverless</h2>
            <p className="mt-2 max-w-xl mx-auto text-muted-foreground">
              Follow three easy steps to protect your data.
            </p>
          </div>
          <div className="relative mt-12 grid md:grid-cols-3 gap-8 items-center">
            <div className="absolute w-full h-1 bg-border/50 top-1/2 -translate-y-1/2 hidden md:block" />
            <div className="relative bg-background p-2 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold font-headline mb-4">1</div>
                <h3 className="font-headline font-semibold text-lg">Upload & Secure</h3>
                <p className="text-muted-foreground text-sm">Choose a file and create a strong password and security key.</p>
            </div>
            <div className="relative bg-background p-2 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold font-headline mb-4">2</div>
                <h3 className="font-headline font-semibold text-lg">Encrypt In-Browser</h3>
                <p className="text-muted-foreground text-sm">Your file is instantly encrypted on your device. No uploads needed.</p>
            </div>
            <div className="relative bg-background p-2 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold font-headline mb-4">3</div>
                <h3 className="font-headline font-semibold text-lg">Download & Save</h3>
                <p className="text-muted-foreground text-sm">Download the encrypted file. Only you can unlock it with your keys.</p>
            </div>
          </div>
        </section>
      </div>
      <ChatbotWidget />
    </>
  );
}
