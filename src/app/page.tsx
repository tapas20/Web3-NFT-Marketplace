"use client";

import { motion } from "framer-motion";
import { Car, Watch, Building2, Shield, Link2, Eye, Wallet, ArrowRight, Sparkles } from "lucide-react";
import NextLink from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const categories = [
  {
    title: "Automotive",
    description: "Luxury & performance vehicles",
    icon: Car,
    href: "/marketplace?category=AUTOMOTIVE",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop",
    count: "120+",
  },
  {
    title: "Watches",
    description: "Premium timepieces",
    icon: Watch,
    href: "/marketplace?category=WATCH",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=400&fit=crop",
    count: "85+",
  },
  {
    title: "Property",
    description: "Real estate & properties",
    icon: Building2,
    href: "/marketplace?category=PROPERTY",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    count: "60+",
  },
];

const features = [
  {
    icon: Shield,
    title: "Blockchain Security",
    description: "Every transaction is secured on the Polygon blockchain with full transparency.",
  },
  {
    icon: Eye,
    title: "Verified Ownership",
    description: "Smart contracts ensure authentic ownership transfer of every asset.",
  },
  {
    icon: Link2,
    title: "Transparent Transactions",
    description: "All transaction records are immutable and publicly verifiable on-chain.",
  },
  {
    icon: Wallet,
    title: "Wallet Authentication",
    description: "Connect your MetaMask wallet for secure, passwordless authentication.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-brand/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Powered by Polygon Blockchain
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Buy & Sell Luxury{" "}
              <span className="text-gradient">On-Chain</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The decentralized marketplace for automotive, watches, and
              property. Trade with blockchain security, verified ownership, and
              transparent transactions.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <NextLink href="/marketplace">
                <Button size="lg" className="gap-2 text-base px-8">
                  Explore Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </NextLink>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base px-8 border-primary/30 hover:bg-primary/10"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {[
                { value: "265+", label: "Listings" },
                { value: "1.2K", label: "Users" },
                { value: "$4.5M", label: "Volume" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 bg-secondary/30">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <Badge variant="outline" className="mb-3">Categories</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              Browse by Category
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Explore our curated selection of luxury assets across three premium categories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
                variants={fadeUp}
              >
                <NextLink href={cat.href}>
                  <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-primary/90 text-primary-foreground">
                          {cat.count} listings
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <cat.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{cat.title}</h3>
                          <p className="text-sm text-muted-foreground">{cat.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </NextLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE ─── */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <Badge variant="outline" className="mb-3">Why ChainMarket</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              Built on Trust & Transparency
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
                variants={fadeUp}
              >
                <Card className="h-full border-border/50 hover:border-primary/20 transition-colors text-center p-6">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 bg-secondary/30">
        <div className="container-custom">
          <motion.div
            className="relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-brand/10 to-primary/20 rounded-2xl" />
            <div className="absolute inset-0 glass rounded-2xl" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Ready to Start Trading?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Join thousands of users buying and selling luxury assets on the
                blockchain. Get started in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NextLink href="/register">
                  <Button size="lg" className="gap-2 px-8">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </NextLink>
                <NextLink href="/marketplace">
                  <Button size="lg" variant="outline" className="gap-2 px-8">
                    Browse Listings
                  </Button>
                </NextLink>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
