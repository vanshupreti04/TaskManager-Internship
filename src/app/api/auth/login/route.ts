import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {connectDB} from '../../../../lib/db';
import User from '../../../../models/User';
import { signJwtToken } from '../../../../lib/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Create JWT Token
    const token = signJwtToken({ id: user._id, email: user.email });

    // Create response with cookie
    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        token, // ADD THIS: Return token in response too!
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email 
        } 
      },
      { status: 200 }
    );

    // Set HTTP-only cookie (THIS IS CORRECT!)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // 'strict' is fine
      maxAge: 60 * 60 * 24, // 1 day (good for security)
      path: '/',
    });

    return response;

  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}