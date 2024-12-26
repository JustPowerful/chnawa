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
  document: {
    _id: string;
    title: string;
    fullname: string;
    subjectId: {
      title: string;
    };
    sessionNumber: number;
    classref: string;
    objectives: string[];
  };
  refetch: () => void;
}

const DocHeader: FC<DocHeaderProps> = ({ document, refetch }) => {
  const [headerContent, setHeaderContent] = useState({
    title: document.title,
    fullname: document.fullname,
    subject: document.subjectId.title,
    class: document.classref,
    sessionNumber: document.sessionNumber,
    objectives: document.objectives,
  });
  const [newObjective, setNewObjective] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isPending, debouncedUpdate } = useDebouncedUpdate(
    (data: typeof headerContent) => {
      const d = updateDocumentHeaderAction({
        id: document._id,
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
    debouncedUpdate(headerContent);
  }, [headerContent, debouncedUpdate]);

  useEffect(() => {
    setHeaderContent({
      title: document.title,
      fullname: document.fullname,
      subject: document.subjectId.title,
      class: document.classref,
      sessionNumber: document.sessionNumber,
      objectives: document.objectives,
    });
  }, [document]);

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
    <div className="p-6 space-y-4">
      <div className="text-4xl outline-none">
        <EditableText
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
            value={headerContent.fullname}
            onContentChange={(value) => {
              setHeaderContent((prev) => ({ ...prev, fullname: value }));
            }}
          />
        </div>
        <div>
          <span className="font-semibold">Subject </span>
          <span>{document.subjectId.title}</span>
        </div>

        <div>
          <span className="font-semibold">Class: </span>
          <EditableText
            value={headerContent.class}
            onContentChange={(value) => {
              setHeaderContent((prev) => ({ ...prev, class: value }));
            }}
          />
        </div>
        <div>
          <span className="font-semibold">Session N° </span>
          <EditableText
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
        </div>
        {headerContent.objectives.map((objective, index) => (
          <div key={index}>
            <div>
              <Dot className="inline" />
              {objective}
              <Button
                variant="notion"
                className="p-0 ml-2 w-6 h-6"
                onClick={() => {
                  setHeaderContent((prev) => ({
                    ...prev,
                    objectives: prev.objectives.filter((_, i) => i !== index),
                  }));
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocHeader;
