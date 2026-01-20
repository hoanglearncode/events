import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            ManixAI
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/tools"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Tools
            </Link>
            <Link
              href="/marketplace"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/courses"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>

          <ThemeToggle />

          <div className="h-6 w-px bg-border mx-2" />

          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
