import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
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

export async function GET(request) {
    try {
        await connectDB();
        const teamId = await getTeamId(request);
        if (!teamId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const searchParams = request.nextUrl.searchParams;
        const listId = searchParams.get('listId');
        const searchQuery = searchParams.get('search');
        const statusFilter = searchParams.get('status');

        let query = { teamId };

        if (statusFilter) {
            query.status = statusFilter;
        }

        if (listId) {
            const List = (await import('@/models/List')).default;
            const list = await List.findOne({ _id: listId, teamId });

            if (!list) {
                return NextResponse.json({ error: 'List not found' }, { status: 404 });
            }

            if (list.rules && list.rules.length > 0) {
                // Future-proof: Build an $and array
                const andConditions = [];
                for (const rule of list.rules) {
                    if (rule.field === 'memberOfList' && rule.operator === 'equals') {
                        andConditions.push({ listIds: rule.value });
                    }
                    // Add more rules here later
                }
                if (andConditions.length > 0) {
                    query.$and = andConditions;
                } else {
                    // Fallback if rules are unsupported yet
                    query.listIds = listId;
                }
            } else {
                // Backward compatibility / default behavior
                query.listIds = listId;
            }
        }

        if (searchQuery) {
            // Add search across name and email
            const searchRegex = new RegExp(searchQuery, 'i');
            if (!query.$and) query.$and = [];
            query.$and.push({
                $or: [
                    { email: searchRegex },
                    { firstName: searchRegex },
                    { lastName: searchRegex }
                ]
            });
        }

        const contacts = await Contact.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ contacts });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const teamId = await getTeamId(request);
        if (!teamId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { email, firstName, lastName, tags } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const exists = await Contact.findOne({ teamId, email });
        if (exists) {
            return NextResponse.json({ error: 'Contact already exists in your team' }, { status: 400 });
        }

        const contact = await Contact.create({
            teamId,
            email,
            firstName,
            lastName,
            tags: tags || [],
        });

        return NextResponse.json({ contact }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
