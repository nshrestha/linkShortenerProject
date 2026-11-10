import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLinksForUser } from "@/data/links";

import { CreateLinkDialog } from "./create-link-dialog";
import { DeleteLinkDialog, EditLinkDialog } from "./link-row-actions";

async function DashboardContent() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const links = await getLinksForUser(userId);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Your links</CardTitle>
              <CardDescription>
                {links.length === 0
                  ? "You haven't created any links yet."
                  : `${links.length} ${links.length === 1 ? "link" : "links"}`}
              </CardDescription>
            </div>
            <CreateLinkDialog />
          </div>
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
                      <div className="flex justify-end gap-2">
                        <EditLinkDialog
                          id={link.id}
                          shortCode={link.shortCode}
                          url={link.url}
                        />
                        <DeleteLinkDialog
                          id={link.id}
                          shortCode={link.shortCode}
                        />
                      </div>
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

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
