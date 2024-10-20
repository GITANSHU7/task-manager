import { NextResponse, NextRequest } from "next/server";
import User from '@/models/userModel';
import { connect } from "@/dbConfig/dbConfig";

connect()

export async function POST(request: NextRequest) {
  
    try {
      const { searchParams } = new URL(request.url);
      const page = searchParams.get("page");
      const per_page_record = searchParams.get("per_page_record");
  
      let users;
      let total;
  
      if (page && per_page_record) {
        const pageInt = parseInt(page);
        const perPageRecordInt = parseInt(per_page_record);
        const startIndex = (pageInt - 1) * perPageRecordInt;
        total = await User.countDocuments();
        users = await User.find()
          .sort({ createdAt: -1 })
          .skip(startIndex)
          .limit(perPageRecordInt);
      } else {
        users = await User.find().sort({ createdAt: -1 });
        total = users.length;
      }
  
      return NextResponse.json({
        message: "User list retrieved successfully",
        data: users,
        total: total,
        success: true,
      });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }