import mongoose from 'mongoose';

const SegmentSchema = new mongoose.Schema({
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
    description: {
        type: String,
    },
    rules: [{
        field: { type: String, required: true },
        operator: { type: String, required: true }, // e.g., 'equals', 'contains', 'in'
        value: { type: mongoose.Schema.Types.Mixed, required: true },
    }],
    // For pre-computed or static segments
    contactIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

SegmentSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

export default mongoose.models.Segment || mongoose.model('Segment', SegmentSchema);
