import { NextAuthConfig } from "next-auth";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import Credentials from "next-auth/providers/credentials";
// import * as argon from "argon2";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | null;
  }
  interface Session {
    user: User;
  }
}

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { type: "email", label: "Email", required: true },
        password: { type: "password", label: "Password", required: true },
      },
      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>>
      ) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) {
          throw new Error("Invalid credentials");
        }
        console.log("credentials", credentials);
        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        // const isPasswordValid = await Bun.password.verify(
        //   user.password,
        //   credentials.password as string
        // );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
