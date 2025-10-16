import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session!.user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  const formData = await request.formData();
  // console log formData to see what's inside

  const file = formData.get("image") as File;

  if (!file) {
    console.log("No file uploaded");
    return NextResponse.json(
      {
        message: "No file uploaded",
      },
      {
        status: 400,
      }
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");
  try {
    const { url } = await put(filename, buffer, {
      contentType: file.type,
      access: "public",
    });
    return NextResponse.json({
      success: 1,
      file: {
        url,
      },
    });
  } catch {
    return NextResponse.json(
      {
        message: "Error uploading file",
      },
      {
        status: 500,
      }
    );
  }
}
