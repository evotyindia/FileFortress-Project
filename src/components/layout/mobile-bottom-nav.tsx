"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lock, Unlock, FlaskConical, MoreHorizontal, Info, LifeBuoy, X, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ThemeToggle } from "../theme-toggle";


const mainNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/encrypt", label: "Encrypt", icon: Lock },
  { href: "/decrypt", label: "Decrypt", icon: Unlock },
  { href: "/demo", label: "Demo", icon: FlaskConical },
];

const moreNavLinks = [
    { href: "/about", label: "About", icon: Info },
    { href: "/support", label: "Support", icon: LifeBuoy },
];


export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t z-50 flex justify-around items-center pb-[env(safe-area-inset-bottom)]">
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
            <div className={cn("p-2 rounded-full transition-colors", isActive ? "bg-primary/10" : "bg-transparent")}>
                <link.icon className="w-6 h-6" />
            </div>
            <span className="text-xs sr-only">{link.label}</span>
          </Link>
        );
      })}
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="flex flex-col items-center justify-center w-full h-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent">
             <div className="p-2 rounded-full">
                <MoreHorizontal className="w-6 h-6" />
            </div>
            <span className="text-xs sr-only">More</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl p-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="relative p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                <SheetHeader className="text-left">
                    <SheetTitle className="font-headline text-xl">More Options</SheetTitle>
                </SheetHeader>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <ThemeToggle />
                    <SheetClose className="relative rounded-full p-2 text-muted-foreground hover:bg-muted">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                </div>

                <div className="mt-6 space-y-1">
                    {moreNavLinks.map(link => (
                      <SheetClose asChild key={link.href}>
                        <Link href={link.href} className="flex items-center gap-4 p-3 -mx-3 rounded-lg text-lg font-medium hover:bg-muted active:bg-muted">
                            <div className="p-2 bg-muted rounded-full">
                                <link.icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <span>{link.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                </div>
            </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
