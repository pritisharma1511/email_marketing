import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Sender from '@/models/Sender';
import User from '@/models/User';
import * as jose from 'jose';

async function getTeamId(request) {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'fallback_secret_for_development_only'
        );
        const { payload } = await jose.jwtVerify(token, secret);
        const user = await User.findById(payload.id);
        return user ? user.teamId : null;
    } catch (e) {
        return null;
    }
}

export async function GET(request) {
    try {
        await connectDB();
        const teamId = await getTeamId(request);
        if (!teamId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const senders = await Sender.find({ teamId }).sort({ createdAt: -1 });
        return NextResponse.json({ senders });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const teamId = await getTeamId(request);
        if (!teamId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { name, email, replyTo, isDefault } = await request.json();

        if (!name || !email) {
            return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
        }

        if (isDefault) {
            await Sender.updateMany({ teamId }, { $set: { isDefault: false } });
        }

        const sender = await Sender.create({
            teamId,
            name,
            email,
            replyTo,
            isDefault: isDefault || false,
            isVerified: true, // Auto-verify for simplicity in draft
        });

        return NextResponse.json({ sender }, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Sender with this email already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
