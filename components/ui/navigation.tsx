'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
import { ThemeToggle } from './theme-toggle';
import { LoginDialog } from './login-dialog';
import { LogoutDialog } from './logout-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { useAuth } from '@/components/providers/auth-provider';
import { Menu, LogIn, Instagram } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const [mounted] = useState(() => typeof window !== 'undefined');
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Navigation links configuration
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Users', path: '/users' },
    { name: 'Stories', path: '/stories' },
    { name: 'Posts', path: '/posts' },
  ];

  return (
    <Card
      className="w-full border-b-4 border-border bg-background rounded-none shadow-none fixed top-0 z-50"
      role="banner"
    >
      <nav
        className="container mx-auto px-4 flex justify-between items-center h-16"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center"
          aria-label="Instagram Archiver Home"
          scroll={true}
        >
          <Button
            variant="default"
            size="lg"
            className="font-heading text-xl h-auto w-auto p-2 [&_svg]:size-6"
          >
            <Instagram />
          </Button>
        </Link>

        {/* Mobile Menu Sheet */}
        {mounted ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="noShadow"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu strokeWidth={2} className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b-2 border-border bg-secondary-background">
                  <h2 className="font-heading text-lg font-bold text-foreground">NAVIGATION</h2>
                </div>
                <nav className="flex-1 p-4" aria-label="Mobile navigation">
                  <div className="flex flex-col space-y-3">
                    {navLinks.map(link => (
                      <Button
                        key={link.path}
                        variant={isActive(link.path) ? 'default' : 'neutral'}
                        size="lg"
                        className="justify-start font-heading text-left h-12 px-4"
                        asChild
                      >
                        <Link
                          href={link.path}
                          aria-current={isActive(link.path) ? 'page' : undefined}
                          aria-label={`Navigate to ${link.name} page`}
                          scroll={true}
                        >
                          {link.name.toUpperCase()}
                        </Link>
                      </Button>
                    ))}
                    <div className="pt-3 mt-3 border-t-2 border-border">
                      {authLoading ? (
                        <Button
                          variant="default"
                          size="icon"
                          className="w-full font-heading"
                          disabled
                        >
                          <LogIn className="h-5 w-5" />
                        </Button>
                      ) : isAuthenticated && user ? (
                        <LogoutDialog>
                          <Avatar className="h-10 w-10 border-2 border-border cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src={user.photo_url} alt={user.username} />
                            <AvatarFallback className="font-heading text-sm">
                              {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </LogoutDialog>
                      ) : (
                        <LoginDialog>
                          <Button variant="default" size="icon" className="w-full font-heading">
                            <LogIn className="h-5 w-5" />
                          </Button>
                        </LoginDialog>
                      )}
                    </div>
                    <div className="pt-3 mt-3 border-t-2 border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-heading text-foreground/70">THEME</span>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </nav>
                <div className="p-4 border-t-2 border-border bg-secondary-background">
                  <p className="text-sm text-foreground/70 font-heading">INSTA ARCHIVER</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Button
            variant="noShadow"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
            disabled
          >
            <Menu strokeWidth={2} className="h-5 w-5" />
          </Button>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <div className="flex items-center space-x-2 mr-4">
            {navLinks.map(link => (
              <Button
                key={link.path}
                variant={isActive(link.path) ? 'default' : 'neutral'}
                className="font-heading"
                asChild
              >
                <Link
                  href={link.path}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  aria-label={`Navigate to ${link.name} page`}
                  scroll={true}
                >
                  {link.name.toUpperCase()}
                </Link>
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2 pl-4 border-l-2 border-border dark:border-foreground/20">
            {authLoading ? (
              <Button variant="default" size="icon" className="font-heading" disabled>
                <LogIn className="h-5 w-5" />
              </Button>
            ) : isAuthenticated && user ? (
              <LogoutDialog>
                <Avatar className="h-8 w-8 border-2 border-border cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src={user.photo_url} alt={user.username} />
                  <AvatarFallback className="font-heading text-xs">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </LogoutDialog>
            ) : (
              <LoginDialog>
                <Button variant="default" size="icon" className="font-heading">
                  <LogIn className="h-5 w-5" />
                </Button>
              </LoginDialog>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </Card>
  );
}
