"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Wallet, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

import { loginSchema } from "@/lib/validations";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { connectAndSign, isConnecting, error: walletError } = useWallet();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setError(null);
    const authData = await connectAndSign();
    
    if (authData) {
      setIsLoading(true);
      try {
        const result = await signIn("wallet", {
          redirect: false,
          walletAddress: authData.address,
          signature: authData.signature,
          message: authData.message,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err) {
        setError("Failed to authenticate wallet");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>

      {(error || walletError) && (
        <div className="p-3 mb-6 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error || walletError}</p>
        </div>
      )}

      {/* Web3 Login */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 text-base gap-2 hover:bg-primary/5 hover:text-primary border-primary/20"
        onClick={handleWalletLogin}
        disabled={isLoading || isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Wallet className="h-5 w-5 text-primary" />
        )}
        Sign in with MetaMask
      </Button>

      <div className="relative py-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Web2 Login */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className="pl-9 h-11 bg-secondary/50"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="pl-9 h-11 bg-secondary/50"
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
          {isLoading && !isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <NextLink href="/register" className="text-primary hover:underline font-medium">
            Create account
          </NextLink>
        </p>
      </div>
    </>
  );
}

import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
