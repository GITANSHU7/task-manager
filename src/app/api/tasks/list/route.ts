import { NextRequest, NextResponse } from "next/server";
import Task from '@/models/taskModel';
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page");
        const per_page_record = searchParams.get("per_page_record");
    
        // let tasks;
        // let total;
    
        // if (page && per_page_record) {
        // const pageInt = parseInt(page);
        // const perPageRecordInt = parseInt(per_page_record);
        // const startIndex = (pageInt - 1) * perPageRecordInt;
        // total = await Task.countDocuments();
        // tasks = await Task.find()
        // // display user name in task list
        //     .sort({ createdAt: -1 })
        //     .skip(startIndex)
        //     .limit(perPageRecordInt);
        // } else {
        // tasks = await Task.find().populate('user', 'name').sort({ createdAt: -1 });
        // total = tasks.length;
        // }
    
        // return NextResponse.json({
        // message: "Task list retrieved successfully",
        // data: tasks,
        // total: total,
        // success: true,
        // });
        let tasks;
let total;

if (page && per_page_record) {
    const pageInt = parseInt(page);
    const perPageRecordInt = parseInt(per_page_record);
    const startIndex = (pageInt - 1) * perPageRecordInt;
    total = await Task.countDocuments();
    tasks = await Task.find()
        .populate('user') // Populate the user field with the name
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(perPageRecordInt);
} else {
    tasks = await Task.find()
        .populate('user') // Populate the user field with the name
        .sort({ createdAt: -1 });
    total = tasks.length;
}

// Map over tasks to include the user name as assign
const tasksWithAssign = tasks.map(task => ({
    ...task.toObject(),
    assign: task.user?.name || 'Unassigned',
    user: task.user?._id // Remove the user field if you don't want to send it
}));

return NextResponse.json({
    message: "Task list retrieved successfully",
    data: tasksWithAssign,
    total: total,
    success: true,
});
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    }