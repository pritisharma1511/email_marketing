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

export async function GET(request) {
    try {
        await connectDB();
        const teamId = await getTeamId(request);
        if (!teamId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const lists = await List.find({ teamId }).sort({ createdAt: -1 });
        return NextResponse.json({ lists });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const teamId = await getTeamId(request);
        if (!teamId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { name, folderName, contactIds, description } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const exists = await List.findOne({ teamId, name, folderName: folderName || 'Your First Folder' });
        if (exists) {
            return NextResponse.json({ error: 'List already exists in this folder' }, { status: 400 });
        }

        let totalContacts = 0;
        if (contactIds && Array.isArray(contactIds)) {
            totalContacts = contactIds.length;
        }

        const list = await List.create({
            teamId,
            name,
            description,
            folderName: folderName || 'Your First Folder',
            contactCount: totalContacts
        });

        // If contacts were selected, update them to include this list's ID
        if (totalContacts > 0) {
            const Contact = (await import('@/models/Contact')).default;
            await Contact.updateMany(
                { _id: { $in: contactIds }, teamId },
                { $addToSet: { listIds: list._id } }
            );
        }

        return NextResponse.json({ list }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
