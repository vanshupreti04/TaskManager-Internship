import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {connectDB} from '../../../../lib/db';
import User from '../../../../models/User';
import { signJwtToken } from '../../../../lib/jwt'; // Added JWT

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token (REQUIRED for assignment)
    const token = signJwtToken({
      userId: newUser._id.toString(),
      email: newUser.email,
    });

    // Return response with token
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        token, // MUST include this for JWT authentication
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}