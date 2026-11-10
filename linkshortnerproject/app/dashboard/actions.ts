"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createLink, deleteLinkForUser } from "@/data/links";

const MAX_URL_LENGTH = 2048;

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

export async function createLinkAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const url = parseHttpUrl(formData.get("url"));
  if (!url) redirect("/dashboard?error=invalid-url");

  const link = await createLink(url, userId);
  if (!link) redirect("/dashboard?error=create-failed");

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteLinkAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await deleteLinkForUser(id, userId);
  revalidatePath("/dashboard");
}
