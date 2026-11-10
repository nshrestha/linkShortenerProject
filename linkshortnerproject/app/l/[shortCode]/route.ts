import { NextResponse } from "next/server";

import { getUrlByShortCode } from "@/data/links";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  const { shortCode } = await params;
  const url = await getUrlByShortCode(shortCode);

  if (!url) return new NextResponse("Link not found", { status: 404 });
  return NextResponse.redirect(url, 307);
}
