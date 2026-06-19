"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Heart,
  User,
  Wallet,
  ShoppingBag,
  Car,
  Watch,
  Home as HomeIcon,
  Building2,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/marketplace?category=AUTOMOTIVE", label: "Automotive", icon: Car },
  { href: "/marketplace?category=WATCH", label: "Watches", icon: Watch },
  { href: "/marketplace?category=PROPERTY", label: "Property", icon: Building2 },
];

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-strong">
      {/* ─── Top Bar ─── */}
      <div className="border-b border-border/50">
        <div className="container-custom flex h-10 items-center justify-between text-xs text-muted-foreground">
          <p className="hidden sm:block">
            🔗 Decentralized Marketplace — Powered by Polygon
          </p>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/sell" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" />
              Sell
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Main Nav ─── */}
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href.split("?")[0]) &&
                    (link.href.includes("?")
                      ? true
                      : !pathname.includes("?"));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-muted-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>

            <ThemeToggle />

            {/* Wishlist */}
            <Link href="/dashboard/wishlist" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Heart className="h-4 w-4" />
              </Button>
            </Link>

            {/* Connect Wallet */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/10"
            >
              <Wallet className="h-4 w-4" />
              Connect
            </Button>

            {/* Account */}
            <Link href="/login" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <User className="h-4 w-4" />
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
                    <Menu className="h-5 w-5" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-80 p-0" showCloseButton={false}>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <Logo size="sm" />
                    <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                      <span className="text-xs">✕</span>
                    </Button>
                  </div>

                  {/* Mobile Nav Links */}
                  <nav className="flex-1 p-4 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          pathname === link.href
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <Separator />

                  {/* Mobile Actions */}
                  <div className="p-4 space-y-2">
                    <Button className="w-full gap-2" variant="outline">
                      <Wallet className="h-4 w-4" />
                      Connect Wallet
                    </Button>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gap-2">
                        <User className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar (expandable) */}
        {searchOpen && (
          <div className="pb-4 animate-in slide-in-from-top-2 duration-200">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search listings..."
                className="pl-9 bg-secondary"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
