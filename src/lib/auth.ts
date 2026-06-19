import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ethers } from "ethers";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        if (user.isSuspended) {
          throw new Error("Account is suspended");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    CredentialsProvider({
      id: "wallet",
      name: "Wallet Signature",
      credentials: {
        walletAddress: { label: "Wallet Address", type: "text" },
        signature: { label: "Signature", type: "text" },
        message: { label: "Message", type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials?.walletAddress ||
          !credentials?.signature ||
          !credentials?.message
        ) {
          throw new Error("Missing wallet credentials");
        }

        try {
          // Verify the signature
          const recoveredAddress = ethers.verifyMessage(
            credentials.message,
            credentials.signature
          );

          if (recoveredAddress.toLowerCase() !== credentials.walletAddress.toLowerCase()) {
            throw new Error("Invalid signature");
          }

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { walletAddress: credentials.walletAddress.toLowerCase() },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                walletAddress: credentials.walletAddress.toLowerCase(),
                name: `Wallet_${credentials.walletAddress.substring(0, 6)}`,
                role: "USER",
              },
            });
          }

          if (user.isSuspended) {
            throw new Error("Account is suspended");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            walletAddress: user.walletAddress,
          };
        } catch (error) {
          console.error("Wallet auth error:", error);
          throw new Error("Invalid wallet signature");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.walletAddress = user.walletAddress;
      }
      
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.walletAddress = token.walletAddress as string | undefined;
      }
      return session;
    },
  },
};
