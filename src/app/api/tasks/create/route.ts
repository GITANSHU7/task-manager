import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/taskModel";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { title, description, user, status, due_date, priority } = reqBody;

    if (!title || !description || !user || !status || !due_date || !priority) {
      return NextResponse.json(
        { error: "All fields are required"},
        { status: 400 }
        );
    }

    const task = new Task({
      title,
      description,
      user,
      status,
      due_date,
      priority,
    });

    const savedTask = await task.save();
    const updated = await User.findByIdAndUpdate(
      user,
      { $push: { tasks: savedTask._id } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Task created successfully", data: savedTask },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
