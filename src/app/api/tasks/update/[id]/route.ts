import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/taskModel";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

// update task

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const slug = params.id;
    const reqBody = await request.json();
    const { title, description, user, status, due_date, priority } = reqBody;
    const task = await Task.findOne({ _id: slug });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    task.title = title;
    task.description = description;
    task.user = user;
    task.status = status;
    task.due_date = due_date;
    task.priority = priority;
    const savedTask = await task.save();
    return NextResponse.json({
      message: "Task updated successfully",
      success: true,
      data: savedTask,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}