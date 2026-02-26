import mongoose from 'mongoose';

const SenderSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    replyTo: {
        type: String,
        trim: true,
        lowercase: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isDefault: {
        type: Boolean,
        default: false,
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

SenderSchema.index({ teamId: 1, email: 1 }, { unique: true });

SenderSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

export default mongoose.models.Sender || mongoose.model('Sender', SenderSchema);
