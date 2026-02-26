import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    subscribedChannels: [{
        type: String,
        enum: ['email', 'sms', 'whatsapp', 'push'],
    }],
    isBlocked: {
        type: Boolean,
        default: false,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    listIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
    }],
    customFields: {
        type: Map,
        of: String,
    },
    status: {
        type: String,
        enum: ['subscribed', 'unsubscribed', 'bounced', 'complained'],
        default: 'subscribed',
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

ContactSchema.index({ teamId: 1, email: 1 }, { unique: true });
ContactSchema.index({ teamId: 1, tags: 1 });
ContactSchema.index({ teamId: 1, status: 1 });

ContactSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
