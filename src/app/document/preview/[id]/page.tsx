import Editor from "@/components/document-content/DocEditor";
import DocHeader from "@/components/document-content/DocHeader";
import connectDB from "@/lib/connectDB";
import Document from "@/models/Document";
import React from "react";
import DownloadButton from "./components/DownloadButton";
import "@/models/Subject";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  await connectDB();
  const document = await Document.findById(id).populate("subjectId");

  return (
    <div className="p-12">
      <DocHeader document={JSON.stringify(document!)} readOnly />
      <Editor document={JSON.stringify(document!)} readOnly />
      <DownloadButton />
    </div>
  );
};

export default page;
