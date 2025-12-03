import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '../../../../lib/db';
import Task from '../../../../models/Task';
import { verifyJwtToken } from '../../../../lib/jwt';

function getUserId(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  const decoded: any = verifyJwtToken(token);
  return decoded ? decoded.id : null;
}

// UPDATE (For editing details or moving drag-and-drop status)
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // ← params is a Promise
) {
  try {
    // AWAIT THE PARAMS FIRST!
    const { id } = await params;
    
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    await connectDB();

    // Find and update, ensuring the task belongs to the user
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId }, // ← Use 'id' from awaited params
      { ...body },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating task' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // ← params is a Promise
) {
  try {
    // AWAIT THE PARAMS FIRST!
    const { id } = await params;
    
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId }); // ← Use 'id' from awaited params

    if (!deletedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting task' }, { status: 500 });
  }
}

// Also add GET for single task (if you don't have it)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching task' }, { status: 500 });
  }
}