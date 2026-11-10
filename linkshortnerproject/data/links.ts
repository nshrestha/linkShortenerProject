import { randomBytes } from "node:crypto";

import { and, desc, eq } from "drizzle-orm";

import db from "@/db";
import { linksTable, type Link } from "@/db/schema";

const SHORT_CODE_ALPHABET =
  "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SHORT_CODE_LENGTH = 7;
const MAX_INSERT_ATTEMPTS = 5;

const generateShortCode = () =>
  Array.from(
    randomBytes(SHORT_CODE_LENGTH),
    (byte) => SHORT_CODE_ALPHABET[byte % SHORT_CODE_ALPHABET.length],
  ).join("");

/**
 * Shortens a URL and stores it in the database
 * @param url - The original URL to shorten
 * @param userId - The authenticated user's ID
 * @returns The shortened link, or null if no unique code could be allocated
 */
export async function createLink(
  url: string,
  userId: string,
): Promise<Link | null> {
  for (let attempt = 0; attempt < MAX_INSERT_ATTEMPTS; attempt++) {
    const [link] = await db
      .insert(linksTable)
      .values({ clerkUserId: userId, shortCode: generateShortCode(), url })
      .onConflictDoNothing({ target: linksTable.shortCode })
      .returning();
    if (link) return link;
  }
  return null;
}

export async function getLinksForUser(userId: string): Promise<Link[]> {
  return db
    .select()
    .from(linksTable)
    .where(eq(linksTable.clerkUserId, userId))
    .orderBy(desc(linksTable.createdAt));
}

export async function deleteLinkForUser(id: number, userId: string) {
  await db
    .delete(linksTable)
    .where(and(eq(linksTable.id, id), eq(linksTable.clerkUserId, userId)));
}

export async function getUrlByShortCode(shortCode: string) {
  const [link] = await db
    .select({ url: linksTable.url })
    .from(linksTable)
    .where(eq(linksTable.shortCode, shortCode))
    .limit(1);
  return link?.url ?? null;
}
