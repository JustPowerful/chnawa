"use server";
import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const schema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  classref: z.string().min(2), // classref is the class reference
  password: z.string().min(8),
});

export const signupAction = actionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { firstname, lastname, classref, email, password },
    }) => {
      try {
        await connectDB();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return {
            validationErrors: {
              email: {
                _errors: ["Email already exists"],
              },
            },
            success: false,
          };
        }

        const user = new User({
          firstname,
          lastname,
          classref,
          email,
          password: await bcrypt.hash(password, 8),
        });
        await user.save();
        return {
          message: "Account created successfully!",
          success: true,
        };
      } catch (error) {
        console.error("Error: ", error);
        return {
          message: "Failed to create account. Please try again.",
          success: false,
        };
      }
    }
  );
