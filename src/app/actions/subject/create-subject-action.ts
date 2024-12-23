"use server";

import connectDB from "@/lib/connectDB";
import { actionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import Subject from "@/models/Subject";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  title: z.string(),
  description: z.string().optional(),
  teacherName: z.string().optional(),
  teacherEmail: z.string().optional(),
});

export const createSubjectAction = actionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { title, description, teacherName, teacherEmail },
    }) => {
      try {
        await connectDB();

        const session = await auth();
        if (!title) {
          return {
            success: false,
            message: "Please provide all the required fields!",
          };
        }

        const subject = new Subject({
          title,
          userId: session?.user.id,
          description,
          teacherName,
          teacherEmail,
        });
        await subject.save();
        revalidatePath("/dashboard");
        return {
          success: true,
          message: "Subject created successfully!",
        };
      } catch (error) {
        return {
          success: false,
          message: "Error creating subject!",
        };
      }
    }
  );
