# Authentication

All authentication in this app is handled by Clerk (`@clerk/nextjs`). **No other auth method may be used.** Do not add custom auth, password handling, session/JWT logic, NextAuth, Auth.js, or any other provider.

## Rules

1. **Clerk only.** Use Clerk components, hooks, and server helpers for everything auth-related.
2. **`/dashboard` is protected.** Unauthenticated users must not be able to access `/dashboard` or any route under it.
3. **Signed-in users skip the homepage.** A signed-in user visiting `/` must be redirected to `/dashboard`.
4. **Sign-in and sign-up always open as a modal.** Never navigate users to a dedicated sign-in or sign-up page.

## Modal sign-in and sign-up

Use `mode="modal"` on Clerk's buttons, and send users to the dashboard afterward:

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";

<SignInButton mode="modal" forceRedirectUrl="/dashboard" />
<SignUpButton mode="modal" forceRedirectUrl="/dashboard" />
```

- Do not render `<SignIn />` or `<SignUp />` on their own pages, and do not link to `/sign-in` or `/sign-up`.
- Do not create new routes for sign-in or sign-up.
- Wrap a custom trigger (e.g. a shadcn `Button`) as the child of the Clerk button instead of building your own flow.

## Protecting `/dashboard`

Enforce in two places. The proxy is a convenience; the page is the security boundary.

1. In `proxy.ts`, use `createRouteMatcher` and `auth.protect()`:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

2. In the dashboard page/layout and in every Server Action or Route Handler that touches user data, call `auth()` again and fail closed:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const { userId } = await auth();
if (!userId) redirect("/");
```

Keep the existing `config.matcher` in `proxy.ts` unchanged.

## Redirecting signed-in users from `/`

In `app/page.tsx`, check the session on the server and redirect:

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  // render the public landing page
}
```

Do not do this redirect on the client.

## Reading the current user

- Server code: `auth()` (async, always `await`) for `userId`; `currentUser()` only when profile data is needed. Both come from `@clerk/nextjs/server`.
- Client components: `useUser` / `useAuth` from `@clerk/nextjs`, for UI only. Never use client state as an authorization decision.

## Conditional UI

- Use `<Show when="signed-in">` and `<Show when="signed-out">` (as in `app/layout.tsx`). Do not use `<SignedIn>` / `<SignedOut>`.
- Use `<UserButton />` for the signed-in account menu.

## Authorization and data

- Store the Clerk `userId` on every user-owned row and scope every query and mutation by it. A user must never access another user's records.
- `CLERK_SECRET_KEY` is server-only. Never log it or import it in client code.
