"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { File, Files, Loader2, Plus } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useDocumentStore } from "@/stores/document.store";

import { useAction } from "next-safe-action/hooks";
import { createDocumentAction } from "@/app/actions/document/create-document-actions";
import DeleteModal from "./DeleteModal";
interface SidebarProps {
  id: string;
  title: string;
  description?: string;
  teacherName?: string;
  teacherEmail?: string;
  documents: string;
}

const Sidebar: FC<SidebarProps> = ({
  id,
  title,
  description,
  teacherEmail,
  teacherName,
  documents,
}) => {
  const ObjectInputRef = useRef<HTMLInputElement>(null);
  const [objectives, setObjectives] = useState<string[]>([]);
  const parsedDocs: {
    _id: string;
    title: string;
  }[] = JSON.parse(documents);

  // Applying useAction here to get the loading state
  const {
    execute: createDocumentExec,
    isPending: createDocumentLoading,
    result: response,
  } = useAction(createDocumentAction);

  const updateDocumentId = useDocumentStore((state) => state.updateDocumentId);
  const resetDocumentId = useDocumentStore((state) => state.resetDocumetId);

  useEffect(() => {
    resetDocumentId();
  }, [resetDocumentId]);

  async function createDocument(formData: FormData) {
    try {
      createDocumentExec({
        subjectId: id,
        title: formData.get("title") as string,
        sessionNumber: Number(formData.get("sessionNumber")),
        objectives: objectives,
      });
      if (response?.data?.success) {
        toast.success("Document created successfully");
      } else {
        toast.error(response?.data?.message);
      }
    } catch {
      toast.error("Failed to create document");
    } finally {
      setObjectives([]);
    }
  }

  return (
    <div>
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-zinc-600">{description}</p>
          {teacherName && (
            <p className="text-sm">
              teacher | <span className="font-semibold">{teacherName}</span>
            </p>
          )}
          {teacherEmail && (
            <p className="text-sm">
              teacher email |{" "}
              <span className="font-semibold">{teacherEmail}</span>
            </p>
          )}
        </div>
        <Dialog>
          <DialogTrigger
            className={cn(
              buttonVariants({
                variant: "secondary",
              }),
              "w-full"
            )}
          >
            <Plus size={16} /> Add new document
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Document</DialogTitle>
              <DialogDescription>
                Fill in the form below to create a new document.
              </DialogDescription>
            </DialogHeader>
            <form action={createDocument}>
              <div className="space-y-3">
                <InputWithLabel
                  label="title"
                  placeholder="title"
                  name="title"
                />
                <InputWithLabel
                  label="session number"
                  placeholder="session number"
                  name="sessionNumber"
                  type="number"
                />
                {/* Objectives input dynamically scales */}
                <hr />
                <Label>Objectives</Label>
                <div className="grid grid-cols-[9fr_2fr] gap-2">
                  <Input
                    placeholder="objective"
                    name="objective"
                    ref={ObjectInputRef}
                  />
                  <Button
                    className="rounded-md"
                    variant="notion"
                    onClick={(event) => {
                      event.preventDefault();
                      const value = ObjectInputRef.current?.value?.trim();
                      if (!value) return;
                      setObjectives((prev) => [...prev, value]);
                      if (ObjectInputRef.current) {
                        ObjectInputRef.current.value = "";
                      }
                    }}
                  >
                    Add Objective
                  </Button>
                </div>
                <div>
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex justify-between">
                      <p>{objective}</p>
                      <Button
                        variant="notion"
                        onClick={(event) => {
                          event.preventDefault();
                          setObjectives((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="submit">
                    {createDocumentLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      "Create"
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={(event) => {
                      event.preventDefault();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="text-sm text-zinc-600 flex items-center gap-1">
          {" "}
          <Files className="w-4 h-4" /> Documents
        </div>
        <div className="flex flex-col gap-2">
          {parsedDocs.map((doc) => (
            <div key={doc._id} className="grid grid-cols-[9fr_2fr]">
              <div
                onClick={() => {
                  updateDocumentId(doc._id);
                }}
                className="cursor-pointer bg-slate-100 p-2 w-full flex gap-1 items-center justify-between text-xs hover:bg-slate-300"
              >
                <div className="flex items-center gap-1">
                  <File className="w-3 h-3" />
                  <p>{doc.title}</p>
                </div>
              </div>
              <DeleteModal documentId={doc._id} title={doc.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
