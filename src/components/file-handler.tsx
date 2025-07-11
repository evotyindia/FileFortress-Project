"use client"

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { encryptFile, decryptFile, generateSecurityKey } from "@/lib/crypto";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, UploadCloud, File, Loader2, Key, Copy, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "encrypt" | "decrypt";

interface FileHandlerProps {
  mode: Mode;
}

export function FileHandler({ mode }: FileHandlerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleGenerateKey = () => {
    const newKey = generateSecurityKey();
    setSecurityKey(newKey);
    toast({
      title: "Security Key Generated",
      description: "A new security key has been generated and filled in.",
    });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(securityKey);
    toast({ title: "Security key copied to clipboard." });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !password || !securityKey) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a file, password, and security key.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      let resultBlob: Blob;
      let resultFilename: string;

      if (mode === 'encrypt') {
        const { blob, filename } = await encryptFile(file, password, securityKey);
        resultBlob = blob;
        resultFilename = filename;
        toast({
          title: "Encryption Successful",
          description: "Your file has been securely encrypted.",
        });
      } else {
        const { blob, metadata } = await decryptFile(file, password, securityKey);
        resultBlob = blob;
        resultFilename = metadata.name;
        toast({
          title: "Decryption Successful",
          description: "Your file has been successfully decrypted.",
        });
      }
      
      const url = URL.createObjectURL(resultBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resultFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error(`${mode} error:`, error);
      toast({
        variant: "destructive",
        title: `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} Failed`,
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-4xl capitalize">{mode} a File</CardTitle>
        <CardDescription className="text-lg pt-1">
          {mode === 'encrypt'
            ? "Upload a file to securely encrypt it in your browser."
            : "Upload an encrypted .fortress file to decrypt it."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div 
            className={cn(
                "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
                isDragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input 
              id="file-upload"
              type="file" 
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2 text-foreground">
                <File className="w-16 h-16 text-primary"/>
                <span className="font-medium text-lg mt-2">{file.name}</span>
                <span className="text-base text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
                <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                  Remove file
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <UploadCloud className="w-16 h-16" />
                <p className="font-semibold text-lg">Drag & drop your file here</p>
                <p className="text-base">or click to browse</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="security-key" className="text-lg">Security Key</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="security-key"
                  type="text"
                  placeholder="Enter or generate a security key"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  required
                  className="h-12 text-base"
                />
                 <Button type="button" variant="outline" onClick={handleCopyKey} size="icon" className="h-12 w-12" disabled={!securityKey}>
                  <Copy className="w-5 h-5" />
                  <span className="sr-only">Copy Key</span>
                </Button>
                {mode === 'encrypt' && (
                  <Button type="button" variant="secondary" onClick={handleGenerateKey} className="h-12 text-base px-4">
                    <Key className="w-5 h-5 mr-2" />
                    Generate
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <Alert variant="destructive" className="mt-6 text-base p-5">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-headline text-lg">Important: Save Your Keys!</AlertTitle>
            <AlertDescription className="mt-2">
              Both your password AND the security key are required to unlock your files. FileFortress does <strong>NOT</strong> store these keys.
              <br />
              <strong>Lose them, and your files are gone forever.</strong> Please keep them safe and backed up!
            </AlertDescription>
          </Alert>
          
          <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isProcessing || !file}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                <span className="capitalize">{mode}</span> & Download File
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
