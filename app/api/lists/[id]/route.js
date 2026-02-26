import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import List from '@/models/List';
import Contact from '@/models/Contact';
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

        // Unpack params since it's a promise in newer Next.js versions
        const { id } = await params;

        const list = await List.findOne({ _id: id, teamId });
        if (!list) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        return NextResponse.json({ list });
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
        const body = await request.json();

        if (body.action === 'add_contact' && body.contactId) {
            const list = await List.findOne({ _id: id, teamId });
            if (!list) return NextResponse.json({ error: 'List not found' }, { status: 404 });

            const contact = await Contact.findOne({ _id: body.contactId, teamId });
            if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

            if (!contact.listIds.includes(list._id)) {
                contact.listIds.push(list._id);
                await contact.save();
                list.contactCount += 1;
                await list.save();
            }

            return NextResponse.json({ success: true, list });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
