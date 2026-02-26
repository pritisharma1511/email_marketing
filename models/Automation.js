import mongoose from 'mongoose';

const AutomationSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['active', 'paused', 'draft'],
        default: 'draft',
    },
    trigger: {
        type: {
            type: String,
            enum: ['segment_joined', 'contact_created', 'date_based', 'api'],
            required: true,
        },
        config: {
            type: Object, // Dynamic configuration based on trigger type
        },
    },
    steps: [{
        type: {
            type: String,
            enum: ['send_email', 'delay', 'condition', 'update_contact'],
            required: true,
        },
        config: {
            type: mongoose.Schema.Types.Mixed,
        },
        nextStepId: {
            type: String, // String ID for referencing other steps in the list
        },
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

AutomationSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

export default mongoose.models.Automation || mongoose.model('Automation', AutomationSchema);
