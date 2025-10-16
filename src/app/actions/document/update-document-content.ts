"use server";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import Document from "@/models/Document";
import connectDB from "@/lib/connectDB";
import { auth } from "@/lib/auth";

const schema = z.object({
  id: z.string(),
  content: z.string(),
});

export const updateDocumentContentAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    try {
      await connectDB();
      const session = await auth();

      const document = await Document.findById(parsedInput.id);
      if (!document || document.userId?.toString() !== session?.user.id) {
        throw new Error("Not authorized");
      }

      await Document.findByIdAndUpdate(parsedInput.id, {
        content: parsedInput.content,
      });

      return {
        success: true,
        message: "Document content updated successfully",
      };
    } catch {
      return {
        success: false,
        message: "Failed to update document content",
      };
    }
  });
