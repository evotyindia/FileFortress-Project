"use client"

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatbot } from '@/ai/flows/chatbot-flow';
import { cn } from '@/lib/utils';
import type { ChatbotOutput } from '@/ai/flows/chatbot-flow';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

const CHAT_MESSAGES_KEY = 'chatMessages';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load messages from sessionStorage on initial render
  useEffect(() => {
    try {
      const storedMessages = sessionStorage.getItem(CHAT_MESSAGES_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([{ role: 'bot', text: "Hello! I'm the FileFortress expert assistant. How can I help you today? You can ask me about the site, or even ask me to encrypt a piece of text for you." }]);
      }
    } catch (error) {
       setMessages([{ role: 'bot', text: "Hello! I'm the FileFortress expert assistant. How can I help you today? You can ask me about the site, or even ask me to encrypt a piece of text for you." }]);
    }
  }, []);


  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    try {
        sessionStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
        console.error("Could not save chat messages to session storage.", error);
    }
  }, [messages]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

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

  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? "scale-0" : "scale-100")}>
        <Button size="icon" className="w-16 h-16 rounded-full shadow-lg" onClick={() => setIsOpen(true)}>
          <MessageSquare className="h-8 w-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>

      <div className={cn("fixed bottom-6 right-6 z-50 transition-opacity duration-300 ease-in-out", !isOpen ? "opacity-0 pointer-events-none" : "opacity-100")}>
        <Card ref={cardRef} className="w-[350px] h-[500px] flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline flex items-center gap-2">
              <Bot className="text-primary"/> AI Assistant
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
                    <p className="text-sm break-words">{message.text}</p>
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
