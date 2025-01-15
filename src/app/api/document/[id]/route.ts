import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Document from "@/models/Document";
import connectDB from "@/lib/connectDB";

export async function GET(request: NextRequest, params: { id: string }) {
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

    const document = await Document.findById(id)
      .populate("subjectId")
      .populate("userId");

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

    if ((document.userId as any)._id.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized For user request",
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
