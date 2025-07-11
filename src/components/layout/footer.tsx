import { Logo } from "@/components/icons"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between py-6 gap-4 md:flex-row">
        <div className="flex items-center space-x-2">
          <Logo className="h-6 w-6 text-primary" />
          <p className="text-sm text-muted-foreground font-headline">
            FileFortress
          </p>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} FileFortress. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
