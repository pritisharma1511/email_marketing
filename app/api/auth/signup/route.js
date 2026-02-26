import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Team from '@/models/Team';
import { signToken } from '@/lib/auth';

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Please provide all fields' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Create user and initial team transactionally
        const user = await User.create({
            name,
            email,
            password,
            role: 'admin', // First user in a new signup gets admin role for their team
        });

        const team = await Team.create({
            name: `${name}'s Team`,
            ownerId: user._id,
        });

        user.teamId = team._id;
        await user.save();

        const token = signToken(user._id);

        const response = NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                teamId: user.teamId,
            },
        }, { status: 201 });

        // Set HTTP-Only Cookie
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Signup Error:', error.message, error.stack);
        return NextResponse.json({ error: 'Server error during signup', details: error.message }, { status: 500 });
    }
}
