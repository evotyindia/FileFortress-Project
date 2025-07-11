"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/encrypt", label: "Encrypt" },
  { href: "/decrypt", label: "Decrypt" },
  { href: "/demo", label: "Demo" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <Logo className="h-6 w-6 text-primary" />
                <span className="font-bold sm:inline-block font-headline">FileFortress</span>
            </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
           <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[280px]">
                        <div className="flex flex-col h-full">
                           <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <Link href="/" className="flex items-center space-x-2">
                                    <Logo className="h-6 w-6 text-primary" />
                                    <span className="font-bold font-headline">FileFortress</span>
                                </Link>
                                <SheetClose asChild>
                                    <Button variant="ghost" size="icon">
                                        <X className="h-6 w-6" />
                                        <span className="sr-only">Close Menu</span>
                                    </Button>
                                </SheetClose>
                            </div>
                           
                            <nav className="flex flex-col gap-4 flex-1">
                                {navLinks.map(link => (
                                    <SheetClose asChild key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                            "text-lg transition-colors hover:text-primary",
                                            pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </nav>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
