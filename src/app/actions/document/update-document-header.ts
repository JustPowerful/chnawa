"use server";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import Document from "@/models/Document";
import connectDB from "@/lib/connectDB";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const schema = z.object({
  id: z.string(),
  title: z.string(),
  fullname: z.string(),
  classref: z.string(),
  sessionNumber: z.number(),
  objectives: z.array(z.string()).optional(),
});

export const updateDocumentHeaderAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    try {
      await connectDB();
      const session = await auth();

      const document = await Document.findById(parsedInput.id);
      if (
        !document ||
        (document as any).userId?.toString() !== session?.user.id
      ) {
        throw new Error("Not authorized");
      }

      await Document.findByIdAndUpdate(parsedInput.id, {
        title: parsedInput.title,
        fullname: parsedInput.fullname,
        classref: parsedInput.classref,
        sessionNumber: parsedInput.sessionNumber,
        objectives: parsedInput.objectives,
      });
      // check if title is changed
      if ((document as any).title !== parsedInput.title) {
        // revalidate the document page
        revalidatePath(`/document/${parsedInput.id}`);
      }

      return {
        success: true,
        message: "Document updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to update document",
      };
    }
  });
