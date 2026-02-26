import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Campaign from '@/models/Campaign';
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

export async function GET(request, { params }) {
    try {
        await connectDB();
        const teamId = await getTeamId(request);
        if (!teamId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const campaign = await Campaign.findOne({ _id: id, teamId }).populate('folderId senderId audience.listIds');
        if (!campaign) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ campaign });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const teamId = await getTeamId(request);
        if (!teamId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const updates = await request.json();

        // If listIds are passed directly in the update payload,
        // we need to set them inside the audience object correctly without overwriting other audience fields.
        if (updates.listIds) {
            updates['audience.listIds'] = updates.listIds;
            delete updates.listIds; // Remove the top-level key
        }

        const campaign = await Campaign.findOneAndUpdate(
            { _id: id, teamId },
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('folderId senderId audience.listIds');

        if (!campaign) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ campaign });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
