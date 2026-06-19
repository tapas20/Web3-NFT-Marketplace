import Link from "next/link";
import { ExternalLink, Link2, Globe, Mail } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/lib/constants";

const footerSections = [
  {
    title: "Marketplace",
    links: [
      { label: "Automotive", href: "/marketplace?category=AUTOMOTIVE" },
      { label: "Watches", href: "/marketplace?category=WATCH" },
      { label: "Property", href: "/marketplace?category=PROPERTY" },
      { label: "All Listings", href: "/marketplace" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Listings", href: "/dashboard/listings" },
      { label: "Wishlist", href: "/dashboard/wishlist" },
      { label: "Transactions", href: "/dashboard/transactions" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const socialLinks = [
  { icon: ExternalLink, href: "#", label: "Twitter" },
  { icon: Link2, href: "#", label: "LinkedIn" },
  { icon: Globe, href: "#", label: "Website" },
  { icon: Mail, href: "mailto:info@chainmarket.io", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container-custom py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="md" className="mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The decentralized marketplace for luxury goods. Buy and sell with
              blockchain security and transparency.
            </p>
            {/* Social Links */}
            <div className="flex gap-2 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors text-muted-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {APP_NAME}. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5">
            Powered by
            <span className="text-primary font-medium">Polygon</span>
            •
            <span className="font-medium">Amoy Testnet</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
