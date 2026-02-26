import mongoose from 'mongoose';

const UnsubscribeSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
    },
    reason: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UnsubscribeSchema.index({ teamId: 1, email: 1 }, { unique: true });

export default mongoose.models.Unsubscribe || mongoose.model('Unsubscribe', UnsubscribeSchema);
