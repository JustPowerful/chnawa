"use client";
import EditableText from "@/components/editable-text";
import { FC, useState, useEffect } from "react";
import { updateDocumentHeaderAction } from "@/app/actions/document/update-document-header";
import { useDebouncedUpdate } from "@/hooks/use-debounced-update";
import { Dot, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface DocHeaderProps {
  document:
    | {
        _id: string;
        title: string;
        fullname: string;
        subjectId: {
          title: string;
        };
        sessionNumber: number;
        classref: string;
        objectives: string[];
      }
    | string;
  refetch?: () => void;
  readOnly?: boolean;
}

const DocHeader: FC<DocHeaderProps> = ({ document, readOnly = false }) => {
  let doc = typeof document === "object" ? document : JSON.parse(document);
  if (typeof document === "string") {
    doc = JSON.parse(document);
  }
  const [headerContent, setHeaderContent] = useState({
    title: doc.title,
    fullname: doc.fullname,
    subject: doc.subjectId.title,
    class: doc.classref,
    sessionNumber: doc.sessionNumber,
    objectives: doc.objectives,
  });
  const [newObjective, setNewObjective] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { debouncedUpdate } = useDebouncedUpdate(
    (data: typeof headerContent) => {
      const d = updateDocumentHeaderAction({
        id: doc._id,
        title: data.title,
        fullname: data.fullname,
        classref: data.class,
        sessionNumber: data.sessionNumber,
        objectives: data.objectives,
      });

      return d;
    },
    {
      delay: 2000,
      onError: (error) => {
        console.error("Failed to update document:", error);
      },
    }
  );

  useEffect(() => {
    if (readOnly) {
      return;
    }
    debouncedUpdate(headerContent);
  }, [headerContent, debouncedUpdate, readOnly]);

  useEffect(() => {
    setHeaderContent({
      title: doc.title,
      fullname: doc.fullname,
      subject: doc.subjectId.title,
      class: doc.classref,
      sessionNumber: doc.sessionNumber,
      objectives: doc.objectives,
    });
  }, [document, doc]);

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setHeaderContent((prev) => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }));
      setNewObjective("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-4xl outline-none">
        <EditableText
          readOnly={readOnly}
          value={headerContent.title}
          onContentChange={(value) => {
            setHeaderContent((prev) => ({ ...prev, title: value }));
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div>
          <span className="font-semibold">Student name: </span>

          <EditableText
            readOnly={readOnly}
            value={headerContent.fullname}
            onContentChange={(value) => {
              setHeaderContent((prev) => ({ ...prev, fullname: value }));
            }}
          />
        </div>
        <div>
          <span className="font-semibold">Subject </span>
          <span>{doc.subjectId.title}</span>
        </div>

        <div>
          <span className="font-semibold">Class: </span>
          <EditableText
            readOnly={readOnly}
            value={headerContent.class}
            onContentChange={(value) => {
              setHeaderContent((prev) => ({ ...prev, class: value }));
            }}
          />
        </div>
        <div>
          <span className="font-semibold">Session N° </span>
          <EditableText
            readOnly={readOnly}
            value={headerContent.sessionNumber}
            onContentChange={(value) => {
              setHeaderContent((prev) => ({
                ...prev,
                sessionNumber: Number(value),
              }));
            }}
          />
        </div>
      </div>
      <hr />
      <div>
        <div className="flex items-center gap-2">
          <div className="font-semibold">Objectives: </div>
          {!readOnly && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="notion" className="p-0 w-6 h-6">
                  <Plus size={14} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Objective</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Enter new objective"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddObjective();
                      }
                    }}
                  />
                  <Button onClick={handleAddObjective}>Add Objective</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {headerContent.objectives.map((objective: string, index: number) => (
          <div key={index}>
            <div>
              <Dot className="inline" />
              {objective}
              {!readOnly && (
                <Button
                  variant="notion"
                  className="p-0 ml-2 w-6 h-6"
                  onClick={() => {
                    setHeaderContent((prev) => ({
                      ...prev,
                      objectives: prev.objectives.filter(
                        (_: string, i: number) => i !== index
                      ),
                    }));
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocHeader;
