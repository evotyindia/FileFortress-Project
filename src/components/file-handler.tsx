"use client"

import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { encryptFile, decryptFile, generateSecurityKey } from "@/lib/crypto";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, UploadCloud, File, Loader2, Key, Copy, Download, ShieldCheck, FileText, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "encrypt" | "decrypt";

interface FileHandlerProps {
  mode: Mode;
}

interface EncryptedResult {
  blob: Blob;
  filename: string;
  securityKey: string;
}

export function FileHandler({ mode }: FileHandlerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [encryptedResult, setEncryptedResult] = useState<EncryptedResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (mode === 'encrypt' && file) {
      setSecurityKey(generateSecurityKey());
    }
  }, [file, mode]);

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
      handleFileChange(event.dataTransfer.files);
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

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Security key copied to clipboard." });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadKey = () => {
    if (!encryptedResult) return;
    const keyFileContent = `FileFortress Security Key\n\n${encryptedResult.securityKey}\n\nIMPORTANT: Store this key and your password in a safe place. You will need BOTH to decrypt your file. If you lose them, your file cannot be recovered.`;
    const blob = new Blob([keyFileContent], { type: 'text/plain' });
    const filename = `${encryptedResult.filename.replace('.fortress', '')}_security_key.txt`;
    downloadBlob(blob, filename);
  };

  const resetForm = () => {
    setFile(null);
    setPassword("");
    setSecurityKey("");
    setEncryptedResult(null);
    setIsProcessing(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !password || (mode === 'encrypt' && !securityKey)) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a file and password.",
      });
      return;
    }

    if (mode === 'decrypt' && !securityKey) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please provide the security key for decryption.",
        });
        return;
    }

    setIsProcessing(true);
    try {
      if (mode === 'encrypt') {
        const { blob, filename } = await encryptFile(file, password, securityKey);
        setEncryptedResult({ blob, filename, securityKey });
        toast({
          title: "Encryption Successful",
          description: "Your file has been securely encrypted.",
        });
      } else {
        const { blob, metadata } = await decryptFile(file, password, securityKey);
        downloadBlob(blob, metadata.name);
        toast({
          title: "Decryption Successful",
          description: "Your file has been successfully decrypted and downloaded.",
        });
        resetForm();
      }
    } catch (error) {
      console.error(`${mode} error:`, error);
      toast({
        variant: "destructive",
        title: `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} Failed`,
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
      setIsProcessing(false);
    }
  };

  if (mode === 'encrypt' && encryptedResult) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4">
            <ShieldCheck className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="font-headline text-4xl">Encryption Complete</CardTitle>
          <CardDescription className="text-lg pt-1">
            Your file has been successfully secured.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="generated-key" className="text-lg">Your New Security Key</Label>
                 <div className="relative">
                    <Textarea
                        id="generated-key"
                        readOnly
                        value={encryptedResult.securityKey}
                        className="h-28 text-base font-code pr-12"
                        placeholder="Your generated security key"
                    />
                    <Button type="button" variant="outline" onClick={() => handleCopyKey(encryptedResult.securityKey)} size="icon" className="absolute top-2 right-2 h-9 w-9 flex-shrink-0">
                        <Copy className="w-4 h-4" />
                        <span className="sr-only">Copy Key</span>
                    </Button>
                </div>
            </div>

            <Alert variant="destructive" className="text-base p-5">
                <div className="flex items-start gap-4">
                    <AlertTriangle className="h-8 w-8" />
                    <div className="flex-1">
                      <AlertTitle className="font-headline text-lg m-0">Crucial: Save Your Keys!</AlertTitle>
                      <AlertDescription className="mt-2">
                          You MUST save both your password and this security key.
                          <strong> Losing either will result in permanent data loss.</strong>
                      </AlertDescription>
                    </div>
                </div>
            </Alert>
            
            <div className="grid sm:grid-cols-2 gap-6">
                 <Button
                    size="lg"
                    className="w-full text-lg h-20 flex-col gap-1"
                    onClick={() => downloadBlob(encryptedResult.blob, encryptedResult.filename)}
                    >
                    <Download className="w-6 h-6 mb-1" />
                    Download Encrypted File
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    className="w-full text-lg h-20 flex-col gap-1"
                    onClick={handleDownloadKey}
                    >
                    <FileText className="w-6 h-6 mb-1" />
                    Download Security Key
                </Button>
            </div>
          
            <div className="text-center">
                <Button variant="link" size="lg" className="text-lg" onClick={resetForm}>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Encrypt Another File
                </Button>
            </div>
        </CardContent>
      </Card>
    );
  }

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
              disabled={isProcessing}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2 text-foreground">
                <File className="w-16 h-16 text-primary"/>
                <span className="font-medium text-lg mt-2">{file.name}</span>
                <span className="text-base text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
                <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); setSecurityKey(''); }}>
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
                className="h-12 text-lg"
              />
            </div>
            {mode === 'encrypt' ? (
                <div className="space-y-2">
                    <Label htmlFor="security-key" className="text-lg">Generated Security Key</Label>
                     <div className="relative">
                        <Textarea
                            id="security-key"
                            readOnly
                            placeholder="A key will be generated when you select a file"
                            value={securityKey}
                            className="h-28 text-base font-code pr-12 bg-muted/50"
                        />
                         <Button type="button" variant="outline" onClick={() => handleCopyKey(securityKey)} size="icon" className="absolute top-2 right-2 h-9 w-9 flex-shrink-0" disabled={!securityKey}>
                            <Copy className="w-4 h-4" />
                            <span className="sr-only">Copy Key</span>
                        </Button>
                    </div>
                </div>
            ) : (
                 <div className="space-y-2">
                    <Label htmlFor="security-key-decrypt" className="text-lg">Security Key</Label>
                    <Input
                        id="security-key-decrypt"
                        type="text"
                        placeholder="Enter the security key for your file"
                        value={securityKey}
                        onChange={(e) => setSecurityKey(e.target.value)}
                        required
                        className="h-12 text-lg"
                    />
                </div>
            )}
          </div>
          
          <Alert variant="destructive" className="text-base p-5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-8 w-8" />
              <div className="flex-1">
                <AlertTitle className="font-headline text-lg">Important: Save Your Keys!</AlertTitle>
                <AlertDescription className="mt-2">
                  Both your password AND the security key are required to unlock your files. FileFortress does <strong>NOT</strong> store these keys.
                  <br />
                  <strong>Lose them, and your files are gone forever.</strong> Please keep them safe and backed up!
                </AlertDescription>
              </div>
            </div>
          </Alert>
          
          <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isProcessing || !file}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-5 w-5" />
                <span className="capitalize">{mode}</span> File
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
