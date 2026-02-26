import mongoose from 'mongoose';

const EmailEventSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true,
    },
    eventType: {
        type: String,
        enum: ['sent', 'delivered', 'open', 'click', 'bounce', 'complaint'],
        required: true,
    },
    urlParams: {
        type: String, // e.g. which link was clicked
    },
    userAgent: {
        type: String,
    },
    ipAddress: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 365, // Auto-delete after 1 year optionally
    },
});

// Indexes for fast querying on analytics dashboards
EmailEventSchema.index({ teamId: 1, campaignId: 1, eventType: 1 });
EmailEventSchema.index({ teamId: 1, contactId: 1, eventType: 1 });

export default mongoose.models.EmailEvent || mongoose.model('EmailEvent', EmailEventSchema);
