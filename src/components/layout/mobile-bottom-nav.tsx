"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lock, Unlock, ScanLine, MoreHorizontal, Info, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";

const mainNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/encrypt", label: "Encrypt", icon: Lock },
  { href: "/decrypt", label: "Decrypt", icon: Unlock },
  { href: "/demo", label: "Analyze", icon: ScanLine },
];

const moreNavLinks = [
    { href: "/about", label: "About", icon: Info },
    { href: "/support", label: "Support", icon: LifeBuoy },
];


export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50 flex justify-around items-center pb-[env(safe-area-inset-bottom)]">
      {mainNavLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <div className={cn("p-2 rounded-full", isActive && "bg-primary/10")}>
                <link.icon className="w-6 h-6" />
            </div>
            <span className="text-xs mt-0.5">{link.label}</span>
          </Link>
        );
      })}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex flex-col items-center justify-center w-full h-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent">
             <div className="p-2 rounded-full">
                <MoreHorizontal className="w-6 h-6" />
            </div>
            <span className="text-xs mt-0.5">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="mb-2 w-40">
           {moreNavLinks.map(link => (
            <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href} className="flex items-center gap-2">
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                </Link>
            </DropdownMenuItem>
           ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
