import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    action: {
        type: String,
        required: true,
    },
    resourceType: {
        type: String,
        required: true, // e.g., 'campaign', 'contact', 'team'
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 90, // Keep logs for 90 days
    },
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
