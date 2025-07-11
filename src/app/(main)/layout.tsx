// This component is wrapped in a client-side component (MainLayoutClient) to handle session expiration logic.
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MainLayoutClient } from "./layout-client";
import { ChatbotWidget } from "@/components/chatbot-widget";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayoutClient>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ChatbotWidget />
      </div>
    </MainLayoutClient>
  );
}
