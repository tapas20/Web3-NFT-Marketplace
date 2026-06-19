import { Category, type NavItem } from "@/types";

export const APP_NAME = "ChainMarket";
export const APP_DESCRIPTION = "Decentralized Web3 Marketplace for Automotive, Watches & Property";

export const CATEGORIES = [
  { value: Category.AUTOMOTIVE, label: "Automotive", icon: "🏎️", description: "Luxury & performance vehicles" },
  { value: Category.WATCH, label: "Watches", icon: "⌚", description: "Premium timepieces" },
  { value: Category.PROPERTY, label: "Property", icon: "🏠", description: "Real estate & properties" },
] as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Automotive", href: "/marketplace?category=AUTOMOTIVE" },
  { label: "Watches", href: "/marketplace?category=WATCH" },
  { label: "Property", href: "/marketplace?category=PROPERTY" },
];

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

export const ITEMS_PER_PAGE = 12;

/* ─── Blockchain ─── */
export const POLYGON_AMOY_CHAIN_ID = 80002;
export const POLYGON_AMOY_RPC = "https://rpc-amoy.polygon.technology";
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
