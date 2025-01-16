"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Document, { IDocument } from "@/models/Document";

export async function getDocumentById(id: string): Promise<IDocument | null> {
  try {
    await connectDB();
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const document = await Document.findById(id)
      .populate("subjectId")
      .populate("userId")
      .lean();

    if (!document) {
      return null;
    }

    if (document.userId.toString() !== session.user.id) {
      throw new Error("Unauthorized");
    }

    return document as IDocument;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
}
