"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  createLink,
  deleteLinkForUser,
  getLinkForUser,
  updateLinkForUser,
} from "@/data/links";

const MAX_URL_LENGTH = 2048;
const INVALID_URL_ERROR = "Enter a valid http:// or https:// URL.";
const SELF_LINK_ERROR = "A short link can't point to another short link.";

export type CreateLinkState = {
  error?: string;
  success?: boolean;
};

const parseHttpUrl = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string" || value.length > MAX_URL_LENGTH) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
};

const parseId = (value: FormDataEntryValue | number | null) => {
  const id = typeof value === "string" ? Number(value) : value;
  return typeof id === "number" && Number.isSafeInteger(id) && id > 0
    ? id
    : null;
};

const isShortLinkOfThisApp = async (url: string) => {
  const { host, pathname } = new URL(url);
  const requestHost = (await headers()).get("host");
  return host === requestHost && pathname.startsWith("/l/");
};

export async function createLinkAction(
  _previousState: CreateLinkState,
  formData: FormData,
): Promise<CreateLinkState> {
  const { userId } = await auth();
  if (!userId) return { error: "Please sign in to create a link." };

  const url = parseHttpUrl(formData.get("url"));
  if (!url) return { error: INVALID_URL_ERROR };
  if (await isShortLinkOfThisApp(url)) return { error: SELF_LINK_ERROR };

  try {
    const link = await createLink(url, userId);
    if (!link) return { error: "We couldn't create your link. Please try again." };

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "We couldn't create your link. Please try again." };
  }
}

export async function updateLinkAction(
  _previousState: CreateLinkState,
  formData: FormData,
): Promise<CreateLinkState> {
  const { userId } = await auth();
  if (!userId) return { error: "Please sign in to edit a link." };

  const id = parseId(formData.get("id"));
  if (id === null) return { error: "Invalid link." };

  const url = parseHttpUrl(formData.get("url"));
  if (!url) return { error: INVALID_URL_ERROR };
  if (await isShortLinkOfThisApp(url)) return { error: SELF_LINK_ERROR };

  try {
    const existing = await getLinkForUser(id, userId);
    if (!existing) return { error: "We couldn't find that link." };
    if (existing.url === url) return { success: true };

    const link = await updateLinkForUser(id, userId, url);
    if (!link) return { error: "We couldn't find that link." };

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "We couldn't update your link. Please try again." };
  }
}

export async function deleteLinkAction(id: number): Promise<CreateLinkState> {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const linkId = parseId(id);
  if (linkId === null) return { error: "Invalid link." };

  try {
    const deleted = await deleteLinkForUser(linkId, userId);
    if (!deleted) {
      revalidatePath("/dashboard");
      return { error: "This link no longer exists." };
    }
  } catch {
    return { error: "We couldn't delete your link. Please try again." };
  }
  revalidatePath("/dashboard");
  return { success: true };
}
