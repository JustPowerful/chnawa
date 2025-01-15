export { auth as middleware } from "@/lib/auth";
export const config = {
  matcher: "/:path*",
  unstable_allowDynamic: [
    "/src/lib/connectDB.ts",
    "/node_modules/mongoose/dist/**",
  ],
};
