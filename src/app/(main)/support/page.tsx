import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LifeBuoy, Mail, Bot } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help and support for FileFortress. Contact us or talk to our AI assistant.',
};

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-2xl mx-auto">
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Support Center</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We're here to help. Find the answers you need below.
          </p>
        </section>

        <section className="mt-16 grid sm:grid-cols-1 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline">AI Assistant</CardTitle>
                <CardDescription>For questions about encryption, passwords, and how to use the app.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI-powered chatbot (available on the dashboard) can instantly answer most common questions. It's the fastest way to get help with general topics. Please note the AI cannot help you recover lost passwords or keys.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline">Email Support</CardTitle>
                <CardDescription>For technical issues, feedback, or other inquiries.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you encounter a technical bug or have other questions, you can reach out to our support team via email.
              </p>
              <a href="mailto:support@filefortress.app" className="font-semibold text-primary hover:underline">
                support@filefortress.app
              </a>
              <div className="text-sm text-amber-600 dark:text-amber-400 p-4 bg-amber-500/10 rounded-md border border-amber-500/20">
                <p className="font-bold flex items-center gap-2"><LifeBuoy className="w-4 h-4"/> Please Note:</p>
                <p>For your security, we have no access to your files, passwords, or security keys. <strong>We cannot help you recover lost passwords or decrypt files.</strong> Please ensure you have backed up your keys before contacting support.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
