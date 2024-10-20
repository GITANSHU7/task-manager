import { NextRequest, NextResponse } from "next/server";
import User from '@/models/userModel';
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {

        const slug = params.id;
        const reqBody = await request.json();
        const { name, email, username } = reqBody;
        const user = await User.findOne({ _id: slug });
    
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        user.name = name;
        user.email = email;
        user.username = username;
        const savedUser = await user.save();
        return NextResponse.json({
          message: "User updated successfully",
          success: true,
          data: savedUser,
        });
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }