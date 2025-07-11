import { Logo } from "@/components/icons"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6 gap-4">
        <div className="flex items-center space-x-2">
          <Logo className="h-6 w-6 text-primary" />
          <p className="text-sm text-muted-foreground font-headline">
            FileFortress
          </p>
        </div>
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} FileFortress. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
