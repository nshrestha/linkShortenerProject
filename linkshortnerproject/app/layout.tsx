import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "A simpler home for the links you share.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("dark", "h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{ theme: shadcn }}>
          <header className="border-b border-border">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
              <Link href="/" className="font-sans text-lg font-semibold tracking-tight">
                Link Shortener<span aria-hidden="true">.</span>
              </Link>
              <Suspense>
                <Show when="signed-out">
                  <div className="flex items-center gap-2">
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                      <Button variant="ghost">Sign in</Button>
                    </SignInButton>
                    <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                      <Button>Sign up</Button>
                    </SignUpButton>
                  </div>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </Suspense>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}