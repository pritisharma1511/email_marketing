import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import List from '@/models/List';

export async function GET() {
    await connectDB();
    // Add all contacts to all existing lists just for the user to see data
    const contacts = await Contact.find({});
    const lists = await List.find({});

    for (const list of lists) {
        list.contactCount = contacts.length;
        await list.save();
    }

    for (const contact of contacts) {
        contact.listIds = lists.map(l => l._id);
        await contact.save();
    }

    return NextResponse.json({ success: true, fixedContacts: contacts.length, fixedLists: lists.length });
}
