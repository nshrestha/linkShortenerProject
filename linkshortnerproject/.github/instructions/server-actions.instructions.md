---
description: Read this file to understand how to write server actions in the project.
applyTo: "**/actions.ts"
---
# Server Actions Guidelines

## Never throw errors

Server actions MUST NOT throw errors. Catch failures and return a result object instead, with either an `error` or a `success` property:

```ts
type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { error: string };
```

```ts
"use server";

export async function createLinkAction(formData: FormData): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  // validate input, call helpers from /data, handle failures...
  return { success: true };
}
```

- Return `{ error: "<message>" }` for every failure: unauthenticated user, invalid input, or a failed database operation.
- Return `{ success: true }` (optionally with data) on success.
- Wrap anything that can throw (e.g. database calls) in `try/catch` and return an `error` object from the `catch`.
- Callers check the returned object (`"error" in result`) instead of using `try/catch`.
