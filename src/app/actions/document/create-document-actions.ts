"use server";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import Document from "@/models/Document";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const schema = z.object({
  subjectId: z.string(),
  title: z.string(),
  sessionNumber: z.number(),
  objectives: z.array(z.string()),
});

export const createDocumentAction = actionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { subjectId, title, sessionNumber, objectives },
    }) => {
      try {
        const session = await auth();
        await connectDB();
        const user = await User.findById(session?.user.id);

        if (!user) {
          return {
            success: false,
            message: "User not found",
          };
        }

        const document = new Document({
          title,
          sessionNumber,
          objectives,
          fullname: user.firstname + " " + user.lastname,
          subjectId,
          userId: user.id,
          classref: user.classref,
        });

        await document.save();
        revalidatePath("/document/*");
        return {
          success: true,
          message: "Document created successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Error creating document",
        };
      }
    }
  );
