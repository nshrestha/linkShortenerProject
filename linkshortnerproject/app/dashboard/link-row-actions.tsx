"use client";

import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { useActionState, useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  deleteLinkAction,
  updateLinkAction,
  type CreateLinkState,
} from "./actions";

type LinkProps = { id: number; shortCode: string; url: string };

const initialState: CreateLinkState = {};

export function EditLinkDialog({ id, shortCode, url }: LinkProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
        <PencilSimpleIcon aria-hidden="true" />
        Edit
      </DialogTrigger>
      <DialogContent>
        {open && (
          <EditLinkForm
            id={id}
            shortCode={shortCode}
            url={url}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditLinkForm({
  id,
  shortCode,
  url,
  onClose,
}: LinkProps & { onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(
    async (previousState: CreateLinkState, formData: FormData) => {
      const result = await updateLinkAction(previousState, formData);
      if (result.success) onClose();
      return result;
    },
    initialState,
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit link</DialogTitle>
        <DialogDescription>
          Change where /l/{shortCode} redirects to.
        </DialogDescription>
      </DialogHeader>
      <form action={formAction} className="flex flex-col gap-4">
        <Input type="hidden" name="id" value={id} />
        <div className="flex flex-col gap-2">
          <Label htmlFor={`edit-url-${id}`}>Destination URL</Label>
          <Input
            id={`edit-url-${id}`}
            name="url"
            type="url"
            defaultValue={url}
            maxLength={2048}
            required
            autoFocus
          />
        </div>
        {state.error && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </>
  );
}

export function DeleteLinkDialog({ id, shortCode }: Omit<LinkProps, "url">) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteLinkAction(id);
      if (result.error) setError(result.error);
      else setOpen(false);
    });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(undefined);
      }}
    >
      <AlertDialogTrigger
        render={<Button type="button" variant="destructive" size="sm" />}
      >
        <TrashIcon aria-hidden="true" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this link?</AlertDialogTitle>
          <AlertDialogDescription>
            /l/{shortCode} will stop working immediately. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete link"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
