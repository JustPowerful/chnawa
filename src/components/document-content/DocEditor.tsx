"use client";
import React, { useEffect, useRef, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ColorPicker from "editorjs-color-picker";
import { useDebouncedUpdate } from "@/hooks/use-debounced-update";
import { updateDocumentContentAction } from "@/app/actions/document/update-document-content";
import toast from "react-hot-toast";
import ImageTool from "@editorjs/image";

const DEFAULT_INITIAL_DATA: OutputData = {
  time: 0,
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "",
      },
    },
  ],
  version: "2.22.2",
};

function Editor({
  document,
  readOnly = false,
}: {
  document:
    | {
        _id: string;
        title: string;
        content: string;
        subjectId: string;
        createdAt: string;
        updatedAt: string;
      }
    | string;
  readOnly?: boolean;
}) {
  const doc = typeof document === "string" ? JSON.parse(document) : document;
  const ref = useRef<EditorJS>(null);
  const [data, setData] = useState<OutputData>(() => {
    try {
      if (!doc.content) return DEFAULT_INITIAL_DATA;

      const parsedContent = JSON.parse(doc.content);
      // Ensure there's at least one block
      if (!parsedContent.blocks || parsedContent.blocks.length === 0) {
        return DEFAULT_INITIAL_DATA;
      }
      return parsedContent;
    } catch {
      return DEFAULT_INITIAL_DATA;
    }
  });

  const { debouncedUpdate } = useDebouncedUpdate(
    async (content: OutputData) => {
      // Ensure we never save empty blocks array
      if (!content.blocks || content.blocks.length === 0) {
        content = DEFAULT_INITIAL_DATA;
      }
      return await updateDocumentContentAction({
        id: doc._id,
        content: JSON.stringify(content),
      });
    },
    {
      onError: () => toast.error("Failed to save changes"),
    }
  );

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        readOnly,
        placeholder: "Write something, or press / to use commands",
        tools: {
          image: {
            class: ImageTool,
            config: {
              features: {
                caption: "optional",
                risize: true,
              },
              endpoints: {
                byFile: "/api/upload",
              },
            },
          },
          list: List,
          header: Header,
          ColorPicker: {
            class: ColorPicker as any,
          },
        },
        data: data,
        autofocus: true,
        async onChange(api) {
          let content = await api.saver.save();
          // Ensure we never set empty blocks array
          if (!content.blocks || content.blocks.length === 0) {
            content = DEFAULT_INITIAL_DATA;
          }
          setData(content);
          debouncedUpdate(content);
        },
      });
      ref.current = editor;
    }

    return () => {
      if (ref.current?.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return (
    <div
      id="editorjs"
      style={{
        padding: 0,
        width: "100%",
        maxWidth: "unset",
        minHeight: 500,
        borderRadius: "7px",
        background: "fff",
      }}
    />
  );
}

export default Editor;
