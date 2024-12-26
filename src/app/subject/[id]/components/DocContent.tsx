"use client";
import { useDocumentStore } from "@/stores/document.store";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import DocHeader from "./document-content/DocHeader";
import { Noto_Serif, Inter } from "next/font/google";
// import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import DocNav from "./document-content/DocNav";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
// });

interface DocContentProps {}

const DocContent: FC<DocContentProps> = ({}) => {
  const documentId = useDocumentStore((state) => state.documentId);
  // const isSaving = useDocumentStore((state) => state.saving);
  async function fetchDocumentHeader() {
    try {
      const response = await fetch(`/api/document/${documentId}`);
      const data = await response.json();
      if (response.ok) {
        return data.document;
      }
    } catch (error) {
      throw new Error("Failed to fetch document");
    }
  }

  const { refetch, data, error, isFetched } = useQuery({
    queryKey: ["document", documentId],
    queryFn: fetchDocumentHeader,
    enabled: !!documentId,
  });

  return (
    <div className={cn(notoSerif.className, "relative")}>
      {/* {isSaving && (
        <div
          className={cn(
            "fixed top-2 left-2 bg-white bg-opacity-40 backdrop-blur-lg p-2 rounded-md border flex items-center justify-center h-10 gap-1 text-zinc-600",
            inter.className
          )}
        >
          <Loader2 className="w-5 h-5 animate-spin" /> Saving the document
        </div>
      )} */}

      {data && (
        <>
          <DocNav refetch={refetch} document={data} />
          <DocHeader refetch={refetch} document={data} />
        </>
      )}
    </div>
  );
};

export default DocContent;
