"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { useActionState, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
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

import { createLinkAction, type CreateLinkState } from "./actions";

const initialState: CreateLinkState = {};

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" />}>
        <PlusIcon aria-hidden="true" />
        Create link
      </DialogTrigger>
      <DialogContent>
        {open && <CreateLinkForm onSuccess={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function CreateLinkForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState(
    async (previousState: CreateLinkState, formData: FormData) => {
      const result = await createLinkAction(previousState, formData);
      if (result.success) onSuccess();
      return result;
    },
    initialState,
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Shorten a link</DialogTitle>
        <DialogDescription>
          Paste a long URL to get a short link you can share.
        </DialogDescription>
      </DialogHeader>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="destination-url">Destination URL</Label>
          <Input
            id="destination-url"
            name="url"
            type="url"
            placeholder="https://example.com/a-very-long-link"
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
            onClick={onSuccess}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Shorten link"}
          </Button>
        </div>
      </form>
    </>
  );
}