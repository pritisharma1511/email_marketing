import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Campaign from '@/models/Campaign';
import Contact from '@/models/Contact';
import EmailEvent from '@/models/EmailEvent';
import { sendEmail } from '@/services/emailService';

// This endpoint would typically be called by a cron job (e.g. Vercel Cron or standard Node cron) every minute
export async function GET(request) {
    // Add simple authentication (e.g. check a CRON_SECRET header to ensure only your cron job can trigger this)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectDB();

        // Find a campaign that is currently marked as 'sending'
        // Alternatively, find 'scheduled' campaigns whose scheduledAt time has passed
        const campaignsToProcess = await Campaign.find({
            status: { $in: ['scheduled', 'sending'] },
        }).limit(5); // Process in small batches to avoid timeouts

        let totalEmailsSent = 0;

        for (const campaign of campaignsToProcess) {
            if (campaign.status === 'scheduled') {
                campaign.status = 'sending';
                await campaign.save();
            }

            // Find subscribers for this team who haven't bounced or unsubscribed
            // Ideally, we'd also check if we already sent to them for THIS campaign to avoid duplicates during retries
            const contacts = await Contact.find({
                teamId: campaign.teamId,
                status: 'subscribed',
            }); // For real world: paginate this

            let sentCount = 0;
            let failedCount = 0;

            for (const contact of contacts) {
                // Simple throttling / wait between sends could be added here

                // Personalization replacements
                let personalizedHtml = campaign.htmlContent || '';
                personalizedHtml = personalizedHtml.replace(/{{firstName}}/g, contact.firstName || '');
                personalizedHtml = personalizedHtml.replace(/{{email}}/g, contact.email || '');

                const result = await sendEmail({
                    to: contact.email,
                    from: `"${campaign.fromName}" <${campaign.fromEmail}>`,
                    subject: campaign.subject,
                    html: personalizedHtml,
                });

                // Log the event
                await EmailEvent.create({
                    teamId: campaign.teamId,
                    campaignId: campaign._id,
                    contactId: contact._id,
                    eventType: result.success ? 'sent' : 'bounce',
                });

                if (result.success) {
                    sentCount++;
                } else {
                    failedCount++;
                }
            }

            // Update campaign stats and mark completed
            campaign.stats.sent += sentCount;
            campaign.stats.bounced += failedCount;
            campaign.status = 'completed';
            campaign.sentAt = Date.now();
            await campaign.save();

            totalEmailsSent += sentCount;
        }

        return NextResponse.json({
            success: true,
            processedCampaigns: campaignsToProcess.length,
            totalEmailsSent
        });

    } catch (error) {
        console.error('Queue Processing Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
