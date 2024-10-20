import {NextRequest, NextResponse} from 'next/server';
import Task from '@/models/taskModel';
import {connect} from '@/dbConfig/dbConfig';


connect();

export async function DELETE(request: NextRequest, {params}: {params: {id: string}}) {
    try {
        const slug = params.id;
        if (!slug) {
            return NextResponse.json({error: 'Task ID is required'}, {status: 400});
        }

        const task = await Task.findOneAndDelete({_id: slug});
        if (!task) {
            return NextResponse.json({error: 'Task not found'}, {status: 404});
        }

        return NextResponse.json({message: 'Task deleted successfully', success: true});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}