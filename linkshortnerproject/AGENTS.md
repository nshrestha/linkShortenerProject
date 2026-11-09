# Agent Instructions for Link Shortner projecs

This document provides comprehansive guidelines for AI agents and LLM working on this project. These instructions ensure consistency, quality, and adherence to project standards. 

# Table of contnts
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Coding Standards](#coding-standards)
4. [Documentation](#documentation)

## CRITICAL: READ THE DOCS BEFORE WRITING ANY CODE

**This is the single most important rule in this document.**

You MUST ALWAYS read the relevant individual instruction files in the `/docs` directory BEFORE generating ANY code. No exceptions.

- Do NOT write, edit, or suggest code until you have read every `/docs` file relevant to the task.
- Do NOT rely on assumptions, memory, or general knowledge in place of these files. The `/docs` files override defaults and take precedence over your own preferences.
- If a task touches multiple areas (e.g. authentication and UI), read ALL of the relevant files.
- If you are unsure whether a file is relevant, read it.
- Code generated without first reading the relevant `/docs` files is considered incorrect and must be redone.

For detailed guidelines on specific topics, refer to the modular documentation in the `/docs` directory:

- [docs/authentication.md](docs/authentication.md) - Authentication (Clerk only), protected `/dashboard`, homepage redirect, modal sign-in/sign-up
- [docs/ui-components.md](docs/ui-components.md) - UI components (shadcn/ui only, no custom components)


# Project Overview 

This is a link shortner application built with modrn web technologies. The application allows users to:

- Create shortened URLs
- Track Link Analytics
- Manage thier links with authentication
- Share links publicly or privately


**Project Type:** Full-Stack Next.js application
**Database:** PostgreSQL (via Neon Database)
**ORM:** Drizzle ORM
**Authentication:** Clerk
**Styling:** Tailwind CSS v4

# Technology Stack

### Core Technologies
- **Framework:** Next.js 16.0.10 (App Router)
- **Runtime:** React 19.2.1
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL via @neondatabase/serverless
- **ORM:** Drizzle ORM 0.45.1
- **Authentication:** Clerk (@clerk/next.js 6.36.2)
- **Styling:** Tailwind CSS 4.x

### Development Tools
- **Package Manager:** npm (implied from workspace)
- **Linter:** ESLint 9.x
- **Database Migration:** Drizzle Kit 0.31.8
- **TypeScript Executor:** tsx 4.21.0

### UI Libraries
- **Icons:** Lucide React 0.561.0 
- **utilities:** clsx, tailwind-merge, class-variance-authrity
- **animations:** tw-animate-css

## Coding Standards

### General Principle

1. **Type Safety First**
- Always use TypeScript with strict mode enabled
- Avoid 'any' types; use 'unknown' or proper type definitions
- Export and reuse type definitions across files

2. **Component Organization**
- Use functional components with TypeScript 
- Place reusable components in appropriate directories
- keep components focused and single-responsibility

3. **File Namings**
- Use Kabab-case for directories: 'link-manager/'
- Use PascalCase for react components: 'LinkCard.tsx'
- Use camelCase for utilities and hooks: 'useLinks.ts'
- Use kebab-case for regular TypeScript files: 'api-client.ts'

4. **Import Prganization**
- Group imports: external packages - internal modules - 
- Use path aliases ('@/') defined in tsconfig.json
- Avoid circular dependencies

5. **Code Styles**
- Use 2-space indentification
- Use double quotes for strings (match ESLint config)
- Use semicolons (TypeScript standard)
- Prefer const over let; void var
- Use arrow functions for callbacks and functional componnts

### Next.js Specific

1. **App Router Convention**
- Use Server Components by default
- Add '"use client"' directive only when needed
- Follow Next.js 16.x file conventions (page.tsx, layout.tsx, etc.)

2. **Metadata**
- Export metadata objects for SEO
- Use generateMetadata for dynamic pages

3. **Performance**
- Use dynamic imports for large components
- Implement proper loading states
- Optimize images with next/image

### Database & ORM

1. **Drizzle ORM Patterns**
- Define schema in 'db/schema.ts'
- Use Drizzle's type-safe query builder
- Export types from schema definitions
- Use transactions for multi-step operations

2. **Migrations**
- Generate migrations with 'drizzle-kit'
- Review generated SQL before applying
- Never edit schema files directly in production

### Authentication

1. **Clerk Integration**
- Wrap app with CLerkProvider in root layout
- Use Clerk hooks for auth state
- Protect routes with Clerk middleware
- Use userId from auth() for database associations

2. **Authorization**
- Always verify user ownership on server actions
- Implement proper access control for data operations
- Never trust client-side authorization


## Documentation

### Code Comments

1. **when to comments**
- Complex business logic
- NOn-obvious algorithms decisions
- Workrounds for known issues
- Public API functions

2. **JSDOC for Functions**
   '''typescript

   /**
    * Shortens a URL and stores it in the database
    * @paramm url - The original URL to shorten
    * @param userId - The authenticated user's ID
    * @returns The shortended URL object 
    */

3. **Avoid Obvious Comments**
- Don't comment what the code clearly shows
- Focus on "why" not "what"

### Component Documentation

1. **Props Interface**
- Document complex props with JSDOc
- Provide examples for non-trivial usage
- Export prop types for refuse

2. **Component Purpose**
- Add brief description for complex componnts
- Document any non-standard behavior
- Note dependencies or requiremnts

## Quick Reference

### Common Commands
'''bash
- `npm run dev` - start the dev server
- `npm run build` - production build (also type-checks)
- `npm run lint` - run ESLint
- `npx drizzle-kit generate` / `npx drizzle-kit migrate` - create and apply migrations
'''
Run `npm run lint` and `npm run build` before finishing a change that touches code.

### Path Alias
- Use '@/' to reference project root: 'import { db } from "@/db"'


### Environment Variables
Required variables (add to '.env.local'):
- 'DATABASE_URL' - Neon PostgreSQL connection string
- 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY' - Clerk public key
- 'CLERK_SECRET_KEY' - Clerk seret key

---

**Note:** This is a living document, Update these guidlines as the project evolves. When in doubt, prioritize consistency with existing code patterns in the project.
