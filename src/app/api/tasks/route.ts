import { NextResponse, NextRequest } from 'next/server';
import {connectDB} from '../../../lib/db';
import Task from '../../../models/Task';
import { verifyJwtToken } from '../../../lib/jwt';

// Helper to get user ID from token
function getUserId(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  const decoded: any = verifyJwtToken(token);
  return decoded ? decoded.id : null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    // Fetch tasks only for this user, sorted by creation date
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, priority, dueDate, status } = body;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    await connectDB();
    const newTask = await Task.create({
      userId,
      title,
      description,
      priority,
      dueDate,
      status: status || 'todo',
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating task' }, { status: 500 });
  }
}