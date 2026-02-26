import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['email', 'sms', 'whatsapp', 'push'],
        default: 'email',
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
    },
    subject: {
        type: String,
        // Optional during draft creation
    },
    previewText: {
        type: String,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sender',
    },
    fromName: {
        type: String,
    },
    fromEmail: {
        type: String,
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmailTemplate',
    },
    htmlContent: {
        type: String, // fallback if no template
    },
    textContent: {
        type: String,
    },
    audience: {
        listIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List',
        }],
        segmentIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Segment',
        }],
        tags: [String],
    },
    status: {
        type: String,
        enum: ['draft', 'ready', 'scheduled', 'sending', 'completed', 'failed'],
        default: 'draft',
    },
    scheduledAt: {
        type: Date, // If null and status 'draft', it's immediate when activated
    },
    sentAt: {
        type: Date,
    },
    stats: {
        sent: { type: Number, default: 0 },
        delivered: { type: Number, default: 0 },
        opened: { type: Number, default: 0 },
        clicked: { type: Number, default: 0 },
        bounced: { type: Number, default: 0 },
        unsubscribed: { type: Number, default: 0 },
        complained: { type: Number, default: 0 },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

CampaignSchema.index({ teamId: 1, status: 1 });

CampaignSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
