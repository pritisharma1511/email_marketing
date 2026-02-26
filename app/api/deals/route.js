import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Deal from '@/models/Deal';
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
        return user ? { teamId: user.teamId, userId: user._id } : null;
    } catch (e) {
        return null;
    }
}

export async function GET(request) {
    try {
        await connectDB();
        const authInfo = await getTeamId(request);
        if (!authInfo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const deals = await Deal.find({ teamId: authInfo.teamId }).sort({ createdAt: -1 });
        return NextResponse.json({ deals });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const authInfo = await getTeamId(request);
        if (!authInfo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { name, amount, stage, closeDate, companyId } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Deal Name is required' }, { status: 400 });
        }

        const deal = await Deal.create({
            teamId: authInfo.teamId,
            ownerId: authInfo.userId,
            name,
            amount: amount || 0,
            stage: stage || 'New',
            closeDate: closeDate || null,
            companyId: companyId || null,
        });

        return NextResponse.json({ deal }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
