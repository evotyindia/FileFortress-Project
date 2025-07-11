"use client"

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { encryptText, decryptText, generateSecurityKey } from "@/lib/crypto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Loader2, Key, Copy, Lock, Unlock } from "lucide-react";

export function DemoHandler() {
  const [originalText, setOriginalText] = useState("This is a secret message.");
  const [password, setPassword] = useState("password123");
  const [securityKey, setSecurityKey] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleGenerateKey = () => {
    const newKey = generateSecurityKey();
    setSecurityKey(newKey);
  };

  const handleCopyKey = (text: string, name: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: `${name} copied to clipboard.` });
  };

  const handleEncrypt = async () => {
    if (!originalText || !password || !securityKey) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide text, a password, and a security key.",
      });
      return;
    }
    setIsProcessing(true);
    setDecryptedText("");
    try {
      const result = await encryptText(originalText, password, securityKey);
      setEncryptedText(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Encryption Failed", description: "An error occurred during encryption." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedText || !password || !securityKey) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please encrypt text first, and provide a password and security key.",
      });
      return;
    }
    setIsProcessing(true);
    try {
      const result = await decryptText(encryptedText, password, securityKey);
      setDecryptedText(result);
    } catch (error) => {
      toast({ variant: "destructive", title: "Decryption Failed", description: "Check your password/key or re-encrypt the text." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      {/* Input Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">1. Your Data</CardTitle>
          <CardDescription>Enter the text and keys for the demo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original-text" className="text-base">Original Text</Label>
            <Textarea
              id="original-text"
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Enter text to encrypt"
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-base"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="security-key" className="text-base">Security Key</Label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-grow">
                    <Input
                      id="security-key"
                      type="text"
                      placeholder="Generate or enter a key"
                      value={securityKey}
                      onChange={(e) => setSecurityKey(e.target.value)}
                      className="text-base pr-10"
                      autoComplete="off"
                    />
                     <Button type="button" variant="ghost" onClick={() => handleCopyKey(securityKey, 'Security key')} size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 text-muted-foreground" disabled={!securityKey}>
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>
                <Button type="button" variant="secondary" onClick={handleGenerateKey} className="px-3">
                    <Key className="w-4 h-4 mr-2" />
                    Generate
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions and Results */}
      <div className="w-full space-y-8 flex flex-col items-center">
        <div className="flex flex-col items-center w-full">
            <Button onClick={handleEncrypt} disabled={isProcessing} className="w-full text-base py-6">
            {isProcessing ? <Loader2 className="animate-spin" /> : 'Encrypt'}
            <Lock className="w-4 h-4 ml-2" />
            </Button>
            <ArrowRight className="w-10 h-10 my-6 text-muted-foreground transform -rotate-90 md:rotate-0" />
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">2. Encrypted</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea 
                    readOnly 
                    value={encryptedText} 
                    className="font-code min-h-[140px] text-sm"
                    placeholder="Encrypted output will appear here..."
                    />
                    <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-base" onClick={() => handleCopyKey(encryptedText, 'Encrypted text')}>Copy</Button>
                </CardContent>
            </Card>
        </div>

        <div className="flex flex-col items-center w-full mt-8">
            <Button onClick={handleDecrypt} disabled={isProcessing || !encryptedText} className="w-full text-base py-6">
                {isProcessing ? <Loader2 className="animate-spin" /> : 'Decrypt'}
                <Unlock className="w-4 h-4 ml-2" />
            </Button>
            <ArrowRight className="w-10 h-10 my-6 text-muted-foreground transform -rotate-90 md:rotate-0" />
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">3. Decrypted</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea 
                    readOnly 
                    value={decryptedText} 
                    className="min-h-[140px] text-base" 
                    placeholder="Decrypted text will appear here..."
                    />
                </CardContent>
            </Card>
        </div>
      </div>
      
      {/* Explanation Card */}
      <Card className="w-full md:col-start-3 md:row-start-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base text-muted-foreground">
          <p>This demo shows the end-to-end encryption process that happens entirely in your browser.</p>
          <ol className="list-decimal list-inside space-y-3">
            <li><strong>Input:</strong> Your text, password, and security key are combined.</li>
            <li><strong>Key Derivation:</strong> A strong encryption key is derived from your inputs using a process called PBKDF2. This makes it hard to guess the password.</li>
            <li><strong>Encryption:</strong> The derived key is used with the AES-GCM algorithm to encrypt your text into an unreadable format.</li>
            <li><strong>Decryption:</strong> The process is reversed. The same password and key must be provided to derive the exact same key and unlock the data.</li>
          </ol>
          <p className="font-bold text-foreground">Nothing you enter here is sent to any server. It's all done on your device.</p>
        </CardContent>
      </Card>

    </div>
  );
}
