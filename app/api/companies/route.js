import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Company from '@/models/Company';
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

        const companies = await Company.find({ teamId: authInfo.teamId }).sort({ createdAt: -1 });
        return NextResponse.json({ companies });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const authInfo = await getTeamId(request);
        if (!authInfo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { name, domain, industry, employeeCount } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Company Name is required' }, { status: 400 });
        }

        const exists = await Company.findOne({ teamId: authInfo.teamId, name });
        if (exists) {
            return NextResponse.json({ error: 'Company already exists' }, { status: 400 });
        }

        const company = await Company.create({
            teamId: authInfo.teamId,
            ownerId: authInfo.userId, // assign to the user who created it implicitly
            name,
            domain,
            industry,
            employeeCount,
            contactCount: 0
        });

        return NextResponse.json({ company }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
