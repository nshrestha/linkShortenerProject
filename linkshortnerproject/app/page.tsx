import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  ChartLineUpIcon,
  LinkIcon,
  LockKeyIcon,
  LightningIcon,
  ShareNetworkIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Link Shortener - Short links, clear analytics",
  description:
    "Create short, shareable links, track every click, and manage everything from one secure dashboard.",
};

const features = [
  {
    icon: LightningIcon,
    title: "Instant short links",
    description:
      "Paste a long URL and get a clean, memorable short link in seconds.",
  },
  {
    icon: ChartLineUpIcon,
    title: "Link analytics",
    description:
      "See how many people click your links and understand what is working.",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Manage your links",
    description:
      "Edit, organize, and delete your links from a single personal dashboard.",
  },
  {
    icon: ShareNetworkIcon,
    title: "Public or private",
    description:
      "Share links with the world or keep them to yourself. You decide.",
  },
  {
    icon: LockKeyIcon,
    title: "Secure by default",
    description:
      "Sign in with Clerk. Your links are tied to your account and only you can change them.",
  },
  {
    icon: LinkIcon,
    title: "Built to scale",
    description:
      "Backed by serverless PostgreSQL so your links stay fast and reliable.",
  },
];

const steps = [
  { title: "Sign up", description: "Create a free account in a few clicks." },
  { title: "Paste your URL", description: "Turn any long link into a short one." },
  { title: "Share and track", description: "Send it anywhere and watch the clicks." },
];

async function RedirectIfSignedIn() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return null;
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>

      <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-24 text-center">
        <Badge variant="secondary">Free link shortener</Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Short links. Big insights.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Turn long, messy URLs into short links you can share anywhere, then
          track every click from one secure dashboard.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg">Get started free</Button>
          </SignUpButton>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Everything you need to share links
          </h2>
          <p className="text-muted-foreground">
            Simple tools to create, track, and control your links.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="mb-2 size-8 text-primary" weight="duotone" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">
          How it works
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map(({ title, description }, index) => (
            <Card key={title}>
              <CardHeader>
                <Badge className="mb-2 w-fit">{index + 1}</Badge>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Ready to shorten your first link?
        </h2>
        <p className="text-muted-foreground">
          Create your account and start sharing in under a minute.
        </p>
        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
          <Button size="lg">Create your account</Button>
        </SignUpButton>
      </section>
    </main>
  );
}
