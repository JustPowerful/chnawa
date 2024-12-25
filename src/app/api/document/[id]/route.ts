import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Document from "@/models/Document";
import connectDB from "@/lib/connectDB";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();

    const document = await Document.findById(id).populate("subjectId");
    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found",
        },
        {
          status: 404,
        }
      );
    }
    if (document.userId.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    return NextResponse.json({
      success: true,
      document,
      message: "Document fetched successfully",
    });
  } catch (error) {
    throw error;
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
