
"use client"

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatbot } from '@/ai/flows/chatbot-flow';
import { cn } from '@/lib/utils';
import type { ChatbotOutput } from '@/ai/flows/chatbot-flow';
import { useToast } from '@/hooks/use-toast';


type Message = {
  role: 'user' | 'bot';
  text: string;
};

const EncryptedMessage = ({ text }: { text: string }) => {
    const { toast } = useToast();
    
    const password = text.match(/PASSWORD_HERE\[(.*?)\]/)?.[1];
    const securityKey = text.match(/SECURITY_KEY_HERE\[(.*?)\]/)?.[1];
    const encryptedText = text.match(/ENCRYPTED_MESSAGE\[(.*)\]/)?.[1];
    
    // Check if all parts are present
    const isFormattedEncryption = password && securityKey && encryptedText;
  
    if (!isFormattedEncryption) {
      return <p className="text-sm break-words">{text}</p>;
    }
  
    const handleCopy = (value: string, name: string) => {
      navigator.clipboard.writeText(value);
      toast({ title: `${name} copied to clipboard.` });
    };

    const introText = text.substring(0, text.indexOf('PASSWORD_HERE['));
  
    return (
      <div className="text-sm break-words space-y-3">
        {introText && <p>{introText}</p>}
        
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-semibold">Password</span>
                <Button variant="outline" size="sm" onClick={() => handleCopy(password, 'Password')} className="h-7">
                    <Copy className="h-3 w-3 mr-2" />
                    Copy
                </Button>
            </div>
            <p className="font-code text-muted-foreground p-2 rounded-md bg-background/50 border text-xs tracking-wider">************</p>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-semibold">Security Key</span>
                <Button variant="outline" size="sm" onClick={() => handleCopy(securityKey, 'Security Key')} className="h-7">
                    <Copy className="h-3 w-3 mr-2" />
                    Copy the key
                </Button>
            </div>
            <p className="font-code text-muted-foreground p-2 rounded-md bg-background/50 border text-xs tracking-wider">************</p>
        </div>

        <div className="space-y-2">
             <div className="flex justify-between items-center">
                <span className="font-semibold">Encrypted Message</span>
                <Button variant="outline" size="sm" onClick={() => handleCopy(encryptedText, 'Encrypted Message')} className="h-7">
                    <Copy className="h-3 w-3 mr-2" />
                    Copy
                </Button>
            </div>
            <p className="font-code text-muted-foreground p-2 rounded-md bg-background/50 border text-xs tracking-wider">********************</p>
        </div>

      </div>
    );
  };

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hello! I'm Cipher, the FileFortress expert assistant. How can I help you today? You can ask me about the site, or even ask me to encrypt a piece of text for you." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isOpen]);

  // Handle clicks outside the chatbot
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response: ChatbotOutput = await chatbot({ message: input });
      const botMessage: Message = { role: 'bot', text: response.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Chatbot error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? "scale-0" : "scale-100")}>
        <Button size="icon" className="w-16 h-16 rounded-full shadow-lg" onClick={() => setIsOpen(true)}>
          <MessageSquare className="h-8 w-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>

      <div className={cn("fixed bottom-6 right-6 z-50 transition-opacity duration-300 ease-in-out", !isOpen ? "opacity-0 pointer-events-none" : "opacity-100")}>
        <Card ref={cardRef} className="w-[350px] flex flex-col shadow-2xl max-h-[calc(100vh-6rem)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline flex items-center gap-2">
              <Bot className="text-primary"/> Cipher
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? "justify-end" : "justify-start")}>
                  {message.role === 'bot' && <Bot className="w-6 h-6 text-primary flex-shrink-0" />}
                  <div className={cn("p-3 rounded-lg max-w-[80%]", message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                     {message.role === 'bot' && message.text.includes("ENCRYPTED_MESSAGE") ? (
                        <EncryptedMessage text={message.text} />
                      ) : (
                        <p className="text-sm break-words">{message.text}</p>
                      )}
                  </div>
                   {message.role === 'user' && <User className="w-6 h-6 text-muted-foreground flex-shrink-0" />}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                    <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                    <div className="p-3 rounded-lg bg-muted flex items-center">
                       <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <CardFooter>
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                autoComplete="off"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
