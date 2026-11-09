import { SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";

async function RedirectIfSignedIn() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return null;
}

const features = [
  {
    number: "01",
    title: "Shorter links",
    description:
      "Turn long URLs into links that are easier to share, wherever your audience finds you.",
  },
  {
    number: "02",
    title: "Link insights",
    description:
      "Understand how your links are performing with analytics in one place.",
  },
  {
    number: "03",
    title: "A place for every link",
    description:
      "Keep your links organized in your own account, ready to manage and share.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-20 sm:pt-28 lg:grid-cols-2 lg:items-center lg:gap-20 lg:pb-32 lg:pt-36">
        <div>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            A little link goes a long way
          </p>
          <h1 className="max-w-2xl font-sans text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Make more of every link.
          </h1>
          <p className="mt-6 max-w-lg font-sans text-lg leading-8 text-muted-foreground">
            A simpler home for the links you share. Shorten your URLs, keep
            them organized, and see how they connect with your audience.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button size="lg">Get started <span aria-hidden="true">↗</span></Button>
            </SignUpButton>
            <Button variant="outline" size="lg" render={<a href="#features" />}>
              Explore features
            </Button>
          </div>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            Link tools are currently in development.
          </p>
        </div>

        <div
          aria-label="Illustration of a long link becoming a short link"
          className="border border-border bg-card p-6 sm:p-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            The idea
          </p>
          <div className="mt-10 border-b border-border pb-6">
            <p className="mb-3 text-xs text-muted-foreground">Your long link</p>
            <p className="break-all font-sans text-sm leading-6 text-muted-foreground">
              https://example.com/a-very-long-link-to-share
            </p>
          </div>
          <p aria-hidden="true" className="my-6 text-2xl text-muted-foreground">
            ↓
          </p>
          <div>
            <p className="mb-3 text-xs text-muted-foreground">A shorter link</p>
            <p className="break-all font-sans text-xl font-medium sm:text-2xl">
              your.link/hello
            </p>
          </div>
          <p className="mt-10 text-xs text-muted-foreground">
            Example for illustration only
          </p>
        </div>
      </section>

      <section id="features" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Built around your links
            </p>
            <h2 className="mt-4 font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
              Less clutter. More connection.
            </h2>
            <p className="mt-4 font-sans leading-7 text-muted-foreground">
              We&apos;re building a straightforward way to share and manage
              links, from the first click onward.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.number} className="border-t border-border pt-6">
                <p className="text-xs text-muted-foreground">{feature.number}</p>
                <h3 className="mt-6 font-sans text-xl font-medium">
                  {feature.title}
                </h3>
                <p className="mt-3 font-sans leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>Link Shortener</span>
          <span>Make every link count.</span>
        </div>
      </footer>
    </main>
  );
}
