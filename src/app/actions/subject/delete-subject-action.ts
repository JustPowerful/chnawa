"use server";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import Subject from "@/models/Subject";
import connectDB from "@/lib/connectDB";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const schema = z.object({
  id: z.string(),
});

export const deleteSubjectAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      await connectDB();
      const session = await auth();
      const subject = await Subject.findById(id);
      if (subject?.userId?.toString() !== session?.user.id) {
        throw new Error("Not authorized");
      }
      await Subject.findByIdAndDelete(id);
      revalidatePath("/dashboard");
      return {
        success: true,
        message: "Subject deleted successfully",
      };
    } catch {
      return {
        success: false,
        message: "Failed to delete subject, please try again later",
      };
    }
  });
