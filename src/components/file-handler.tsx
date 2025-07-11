"use client"

import { useState, useCallback, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { encryptFile, decryptFile, generateSecurityKey } from "@/lib/crypto";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, UploadCloud, File, Loader2, Key, Copy, Download, ShieldCheck, FileText, RefreshCw, FileKey, Wand2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateFilename } from "@/ai/flows/generate-filename-flow";

type Mode = "encrypt" | "decrypt";

interface FileHandlerProps {
  mode: Mode;
}

interface EncryptedResult {
  blob: Blob;
  filename: string;
  securityKey: string;
}

const passwordConditions = [
    { label: "8+ characters", regex: /.{8,}/ },
    { label: "1 uppercase", regex: /[A-Z]/ },
    { label: "1 lowercase", regex: /[a-z]/ },
    { label: "1 number", regex: /[0-9]/ },
    { label: "1 special", regex: /[^A-Za-z0-9]/ },
];

export function FileHandler({ mode }: FileHandlerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordBlurred, setConfirmPasswordBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [securityKey, setSecurityKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [encryptedResult, setEncryptedResult] = useState<EncryptedResult | null>(null);
  const [filename, setFilename] = useState("");
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const keyFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (file) {
      if (mode === 'encrypt') {
        setSecurityKey(generateSecurityKey());
      }
      const baseName = file.name.split('.').slice(0, -1).join('.');
      setFilename((baseName || file.name).substring(0, 25));
    } else {
      setFilename("");
    }
  }, [file, mode]);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleKeyFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyFile = event.target.files?.[0];
    if (!keyFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) {
        toast({ variant: 'destructive', title: 'Error reading file', description: 'Could not read the key file.' });
        return;
      }
      // The key is expected on the 3rd line of the file.
      const lines = content.split('\n');
      if (lines.length >= 3 && lines[2].trim()) {
        setSecurityKey(lines[2].trim());
      } else {
        toast({ variant: 'destructive', title: 'Invalid Key File', description: 'Could not find a valid security key in the uploaded file.' });
      }
    };
    reader.onerror = () => {
        toast({ variant: 'destructive', title: 'File Read Error', description: 'An error occurred while reading the key file.' });
    };
    reader.readAsText(keyFile);

    // Reset the input so the same file can be uploaded again
    if (keyFileInputRef.current) {
        keyFileInputRef.current.value = '';
    }
  };

  const handleRandomizeName = async () => {
    if (!file) return;
    setIsGeneratingName(true);
    try {
        const result = await generateFilename({ originalFilename: file.name });
        setFilename(result.newFilename.substring(0, 25));
    } catch (error) {
        console.error("Error generating filename: ", error);
        toast({ variant: "destructive", title: "Could not generate name", description: "The AI service might be busy. Please try again." });
    } finally {
        setIsGeneratingName(false);
    }
  }


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
    setConfirmPassword("");
    setConfirmPasswordBlurred(false);
    setSecurityKey("");
    setEncryptedResult(null);
    setIsProcessing(false);
    setFilename("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !password) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a file and password.",
      });
      return;
    }

    if (mode === 'encrypt') {
        const isPasswordValid = passwordConditions.every(cond => cond.regex.test(password));
        if (!isPasswordValid) {
            toast({
                variant: "destructive",
                title: "Weak Password",
                description: "Password must meet all conditions.",
            });
            return;
        }
        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords do not match",
                description: "Please ensure your passwords match.",
            });
            return;
        }
    }

    if (mode === 'decrypt' && !securityKey) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please provide the security key for decryption.",
        });
        return;
    }
    
    if (mode === 'encrypt' && !filename) {
        toast({
            variant: "destructive",
            title: "Missing Filename",
            description: "Please provide a name for the encrypted file.",
        });
        return;
    }

    setIsProcessing(true);
    try {
      if (mode === 'encrypt') {
        const encryptedFilename = `${filename}.fortress`;
        const { blob } = await encryptFile(file, password, securityKey);
        setEncryptedResult({ blob, filename: encryptedFilename, securityKey });
      } else {
        const { blob, metadata } = await decryptFile(file, password, securityKey);
        downloadBlob(blob, metadata.name);
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
             {mode === 'encrypt' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="filename" className="text-lg">Encrypted Filename</Label>
                  <div className="flex h-12 mt-2 w-full rounded-md border border-input bg-background text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <Input
                          id="filename"
                          type="text"
                          placeholder="Enter a filename"
                          value={filename}
                          onChange={(e) => setFilename(e.target.value.substring(0, 25))}
                          required
                          maxLength={25}
                          className="h-auto text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                      />
                      <span className="flex items-center px-3 text-muted-foreground bg-transparent">.fortress</span>
                  </div>
                </div>
                <div className="flex justify-center">
                    <Button type="button" variant="secondary" onClick={handleRandomizeName} disabled={!file || isGeneratingName}>
                        {isGeneratingName ? <Loader2 className="animate-spin" /> : <Wand2 className="mr-2 h-5 w-5"/>}
                        Randomize
                    </Button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-lg pr-12"
                />
                <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
               {mode === 'encrypt' && password.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                    {passwordConditions.map(condition => (
                        <div key={condition.label} className={cn("flex items-center text-sm", condition.regex.test(password) ? "text-green-600" : "text-muted-foreground")}>
                            {condition.regex.test(password) ? <ShieldCheck className="w-4 h-4 mr-2" /> : <div className="w-4 h-4 mr-2" />}
                            {condition.label}
                        </div>
                    ))}
                </div>
              )}
            </div>
            
            {mode === 'encrypt' && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-lg">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmPasswordBlurred(true)}
                    required
                    className="h-12 text-lg pr-12"
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
                 {confirmPasswordBlurred && confirmPassword && (
                  <div className={cn(
                    "flex items-center text-sm pt-1",
                    password === confirmPassword ? "text-green-600" : "text-destructive"
                  )}>
                    {password === confirmPassword ? 
                      <CheckCircle2 className="w-4 h-4 mr-2" /> :
                      <XCircle className="w-4 h-4 mr-2" />
                    }
                    {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
                  </div>
                )}
              </div>
            )}
            
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
                    <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
                        <Input
                            id="security-key-decrypt"
                            type="text"
                            placeholder="Enter security key"
                            value={securityKey}
                            onChange={(e) => setSecurityKey(e.target.value)}
                            required
                            className="h-12 text-lg"
                        />
                         <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-semibold">
                            <hr className="w-full border-border sm:hidden" />
                            <span className="whitespace-nowrap">OR</span>
                             <hr className="w-full border-border sm:hidden" />
                        </div>
                        <input
                            type="file"
                            accept=".txt"
                            ref={keyFileInputRef}
                            onChange={handleKeyFileChange}
                            className="hidden"
                        />
                        <Button type="button" variant="secondary" className="h-12 text-base px-4 w-full sm:w-auto" onClick={() => keyFileInputRef.current?.click()}>
                           <FileKey className="mr-2 h-5 w-5"/> Upload Key File
                        </Button>
                    </div>
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
