"use server";
import { actionClient } from "@/lib/safe-action";
import Subject from "@/models/Subject";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const schema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  teacherName: z.string().optional(),
  teacherEmail: z.string().optional(),
});

export const editSubjectAction = actionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { id, title, description, teacherName, teacherEmail },
    }) => {
      try {
        const session = await auth();
        const subject = await Subject.findById(id);
        if (!subject) {
          throw new Error("Subject not found");
        }
        if (subject.userId.toString() !== session?.user.id) {
          throw new Error("Unauthorized");
        }

        subject.title = title;
        subject.description = description;
        subject.teacherName = teacherName;
        subject.teacherEmail = teacherEmail;
        await subject.save();
        revalidatePath("/dashboard");
        return {
          success: true,
          message: "Subject updated successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to update subject",
        };
      }
    }
  );
