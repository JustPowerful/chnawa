import { getDocumentById } from "@/app/actions/document/get-document-by-id";
import { notFound } from "next/navigation";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const document = await getDocumentById(documentId);

  if (!document) {
    notFound();
  }

  return <div>// ...existing code...</div>;
}
