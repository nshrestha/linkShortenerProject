import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLinksForUser } from "@/data/links";

import { createLinkAction, deleteLinkAction } from "./actions";

const errorMessages: Record<string, string> = {
  "invalid-url": "Enter a valid http:// or https:// URL.",
  "create-failed": "We couldn't create your link. Please try again.",
};

async function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const [{ error }, links] = await Promise.all([
    searchParams,
    getLinksForUser(userId),
  ]);
  const errorMessage = error ? errorMessages[error] : undefined;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Shorten a link</CardTitle>
          <CardDescription>
            Paste a long URL to get a short link you can share.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form action={createLinkAction} className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="url">Destination URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com/a-very-long-link"
                required
              />
            </div>
            <Button type="submit">Shorten</Button>
          </form>
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your links</CardTitle>
          <CardDescription>
            {links.length === 0
              ? "You haven't created any links yet."
              : `${links.length} ${links.length === 1 ? "link" : "links"}`}
          </CardDescription>
        </CardHeader>
        {links.length > 0 && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short link</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        nativeButton={false}
                        role="link"
                        render={
                          <Link
                            href={`/l/${link.shortCode}`}
                            target="_blank"
                            prefetch={false}
                          />
                        }
                      >
                        /l/{link.shortCode}
                      </Button>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {link.url}
                    </TableCell>
                    <TableCell>
                      {link.createdAt.toLocaleDateString("en-US")}
                    </TableCell>
                    <TableCell className="text-right">
                      <form action={deleteLinkAction}>
                        <Input type="hidden" name="id" value={link.id} />
                        <Button type="submit" variant="destructive" size="sm">
                          Delete
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </main>
  );
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
