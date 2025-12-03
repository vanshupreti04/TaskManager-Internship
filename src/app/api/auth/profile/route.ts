import { NextResponse, NextRequest } from 'next/server';
import { verifyJwtToken } from '../../../../lib/jwt';
import { connectDB } from '../../../../lib/db';
import User from '../../../../models/User';

export async function GET(req: NextRequest) {
  try {
    
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyJwtToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = (decoded as any).id || (decoded as any).userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}