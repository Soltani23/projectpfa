"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, User2, FileText, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/theme/mode-toggle';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-200',
        isScrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'
          : 'bg-background'
      )}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 py-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-medium"
                >
                  <FileText className="h-5 w-5" />
                  Amal Soltani's Dashboard
                </Link>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted"
                  >
                    <User2 className="h-4 w-4" />
                    Manage
                  </Link>
                  <Link
                    href="/list"
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted"
                  >
                    <FileText className="h-4 w-4" />
                    Lists
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-lg font-bold hidden md:inline-flex">
              Amal Soltani's Dashboard
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Manage
          </Link>
          <Link
            href="/list"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Lists
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}