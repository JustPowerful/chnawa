"use client";
import EditableText from "@/components/editable-text";
import { FC, useState, useEffect } from "react";
import { updateDocumentHeaderAction } from "@/app/actions/document/update-document-header";
import { useDebouncedUpdate } from "@/hooks/use-debounced-update";
import { useDocumentStore } from "@/stores/document.store";

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
}

const DocHeader: FC<DocHeaderProps> = ({ document }) => {
  const [headerContent, setHeaderContent] = useState({
    title: document.title,
    fullname: document.fullname,
    subject: document.subjectId.title,
    class: document.classref,
    sessionNumber: document.sessionNumber,
    objectives: document.objectives,
  });

  const { isPending, debouncedUpdate } = useDebouncedUpdate(
    (data: typeof headerContent) => {
      const d = updateDocumentHeaderAction({
        id: document._id,
        title: data.title,
        fullname: data.fullname,
        classref: data.class,
        sessionNumber: data.sessionNumber,
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
    </div>
  );
};

export default DocHeader;
