---
description: "Generate a concise instructions.md file"
name: Instructions Generator
---

Use the following data-access requirements to generate a concise `data-access.instructions.md` file in the `/.github/instructions` directory, then update `AGENTS.md` to reference it:

- All application data reads and writes must go through Server Actions, called from Client Components.
- Server Action files must be named `actions.ts` and colocated with the directory of the component that calls them.
- All Server Action inputs must have appropriate TypeScript types. Do not use the `FormData` type.
- Validate all data passed to Server Actions with Zod inside the action.
- Every Server Action must first check that a user is signed in, before performing any database operations.
- Database operations must be implemented in helper functions in the `/data` directory that wrap Drizzle queries. Server Actions must call those helpers and must not contain Drizzle queries directly.

The generated instruction file must have frontmatter with a concise `description` explaining when Copilot should use these instructions. Preserve unrelated existing guidance in `AGENTS.md`.
