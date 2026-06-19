import { ReactNode } from "react";
import NextLink from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Content */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative z-10">
        <div className="absolute top-8 left-8 sm:top-12 sm:left-16 lg:left-24">
          <NextLink href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground -ml-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </NextLink>
        </div>
        
        <div className="w-full max-w-md mx-auto space-y-8">
          {children}
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex relative bg-secondary/30 items-center justify-center p-12 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-brand/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/20 rounded-full blur-3xl opacity-50" />
        
        {/* Glass panel */}
        <div className="relative z-10 glass rounded-3xl p-12 max-w-lg text-center space-y-6">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-3xl">🔗</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">The Future of Luxury Commerce</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Join the decentralized marketplace. Buy and sell automotive, watches, and property securely on the Polygon blockchain.
          </p>
        </div>
      </div>
    </div>
  );
}
