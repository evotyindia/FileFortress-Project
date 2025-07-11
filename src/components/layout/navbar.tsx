"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, X, LayoutDashboard, Lock, Unlock, FlaskConical, Info, LifeBuoy } from "lucide-react"

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/encrypt", label: "Encrypt", icon: Lock },
  { href: "/decrypt", label: "Decrypt", icon: Unlock },
  { href: "/demo", label: "Demo", icon: FlaskConical },
  { href: "/about", label: "About", icon: Info },
  { href: "/support", label: "Support", icon: LifeBuoy },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">FileFortress</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
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
            <ThemeToggle />
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[280px] p-0">
                        <div className="flex flex-col h-full">
                           <SheetHeader className="p-4 border-b">
                                <SheetTitle className="text-left">
                                     <Link href="/" className="flex items-center space-x-2">
                                        <Logo className="h-6 w-6 text-primary" />
                                        <span className="font-bold font-headline">FileFortress</span>
                                    </Link>
                                </SheetTitle>
                           </SheetHeader>
                           
                            <nav className="flex flex-col gap-1 flex-1 p-4">
                                {navLinks.map(link => {
                                  const isActive = pathname === link.href;
                                  return (
                                    <SheetClose asChild key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                            "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors",
                                            isActive 
                                              ? "bg-primary/10 text-primary" 
                                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                            )}
                                        >
                                            <link.icon className="h-5 w-5" />
                                            {link.label}
                                        </Link>
                                    </SheetClose>
                                  )
                                })}
                            </nav>
                            <div className="p-4 mt-auto border-t">
                              <ThemeToggle />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
          </div>
      </div>
    </header>
  )
}
