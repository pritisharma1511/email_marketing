import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a team name'],
        trim: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    billingStatus: {
        type: String,
        enum: ['active', 'past_due', 'canceled', 'trialing'],
        default: 'trialing',
    },
    emailQuota: {
        type: Number,
        default: 1000,
    },
    emailsSentThisMonth: {
        type: Number,
        default: 0,
    },
    subscriptionPlan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
