"use server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import { actionClient } from "@/lib/safe-action";
import User from "@/models/User";
import Document from "@/models/Document";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  documentId: z.string().min(1, "Document ID is required"),
});

export const deleteDocumentAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { documentId } }) => {
    try {
      const session = await auth();
      if (!session?.user) return { success: false, message: "Unauthorized" };
      await connectDB();
      const user = await User.findById(session.user.id);

      if (!user) return { success: false, message: "User not found" };

      // Remove documentId from user's recentDocuments
      await Document.findByIdAndDelete(documentId);

      revalidatePath(`/document/*`);
      return { success: true, message: "Document deleted successfully" };
    } catch (error) {
      console.log("Error deleting document:", error);
      return {
        success: false,
        message: "Error deleting document",
      };
    }
  });
