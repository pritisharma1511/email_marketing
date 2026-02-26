import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import List from '@/models/List';
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

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const teamId = await getTeamId(request);
        if (!teamId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const { rules } = await request.json();

        if (!Array.isArray(rules)) {
            return NextResponse.json({ error: 'Rules must be an array' }, { status: 400 });
        }

        const list = await List.findOneAndUpdate(
            { _id: id, teamId },
            { $set: { rules } },
            { new: true }
        );

        if (!list) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        return NextResponse.json({ list });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
