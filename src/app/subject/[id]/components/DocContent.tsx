"use client";
import { useDocumentStore } from "@/stores/document.store";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import DocHeader from "../../../../components/document-content/DocHeader";
import { Noto_Serif } from "next/font/google";
// import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import DocNav from "../../../../components/document-content/DocNav";
import dynamic from "next/dynamic";

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
      } else {
        console.log(data);
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

  const DocEditor = dynamic(
    () => import("../../../../components/document-content/DocEditor"),
    {
      ssr: false,
    }
  );

  return (
    <div className={cn(notoSerif.className, "relative h-screen")}>
      {data && (
        <>
          <DocNav refetch={refetch} document={data} />
          <div className="relative px-4 md:px-8 h-[calc(100vh-64px)] overflow-y-auto">
            <div
              id="documentContent"
              className="px-8 py-8 space-y-6 bg-white rounded-lg shadow-sm"
              style={{
                maxWidth: "800px",
                margin: "2rem auto",
                minHeight: "calc(100vh - 128px)",
                pageBreakInside: "avoid",
                wordBreak: "break-word",
              }}
            >
              <DocHeader refetch={refetch} document={data} />
              <DocEditor document={data} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DocContent;
