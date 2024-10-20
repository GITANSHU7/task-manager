import { NextResponse, NextRequest } from "next/server";
import User from '@/models/userModel';
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
    
      const slug = params.id;
      if (!slug) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }
  
      const user = await User.findOneAndDelete({ _id: slug });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json({
        message: "User deleted successfully",
        success: true,
      });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }
  