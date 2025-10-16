"use client";
import { Loader2, Trash2 } from "lucide-react";
import React, { FC, useState } from "react";
import { deleteDocumentAction } from "@/app/actions/document/delete-document-actions";
import { useAction } from "next-safe-action/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  documentId: string;
  title: string;
}

const DeleteModal: FC<DeleteModalProps> = ({ documentId, title }) => {
  const { execute: deleteDocument, isPending } =
    useAction(deleteDocumentAction);
  const [isToggled, setIsToggled] = useState(false);
  async function handleDelete() {
    try {
      await deleteDocument({ documentId });
    } catch {
      console.log("Error deleting document");
    }
  }
  return (
    <>
      <Dialog open={isToggled} onOpenChange={setIsToggled}>
        <DialogTrigger className="p-2 rounded-md hover:bg-red-100/50 transition-colors">
          <Trash2 className="w-4 h-4 text-red-500" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Do you want to delete the following document: {title} ?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              document.
            </DialogDescription>
          </DialogHeader>
          <form className="grid grid-cols-2" action={handleDelete}>
            <Button type="submit">
              {isPending ? (
                <Loader2 className="w-4 h-4 text-white" />
              ) : (
                "Delete"
              )}
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => setIsToggled(false)}
              type="button"
            >
              Cancel
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteModal;
