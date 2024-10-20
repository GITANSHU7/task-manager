import { NextRequest, NextResponse } from "next/server";
import User from '@/models/userModel';
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
  try {
    const { name, email, username } = await request.json();
    const user = new User({
      name,
      email,
      username,
    });

    if (!name || !email || !username) {
      return NextResponse.json({ error: "Please fill all fields" }, { status: 400 });
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    await user.save();
    return NextResponse.json({ message: "User created successfully", data : user }, { status: 200 });
  } catch (error : any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

