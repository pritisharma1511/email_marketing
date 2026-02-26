import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Segment from '@/models/Segment';
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

        const segments = await Segment.find({ teamId }).sort({ createdAt: -1 });
        return NextResponse.json({ segments });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const teamId = await getTeamId(request);
        if (!teamId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { name, folderName } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const exists = await Segment.findOne({ teamId, name });
        if (exists) {
            return NextResponse.json({ error: 'Segment already exists' }, { status: 400 });
        }

        // Add folderName to the schema dynamically or just ignore it for now since the schema doesn't have it
        const segment = await Segment.create({
            teamId,
            name,
            rules: [], // initialize empty rules
        });

        return NextResponse.json({ segment }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
