import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Logged out successfully' 
      },
      { status: 200 }
    );

    // Clear the cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Match login/register
      sameSite: 'strict', // Match login/register
      expires: new Date(0), // Expire immediately
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}