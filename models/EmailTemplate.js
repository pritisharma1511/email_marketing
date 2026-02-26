import mongoose from 'mongoose';

const EmailTemplateSchema = new mongoose.Schema({
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
    htmlContent: {
        type: String,
        required: true,
    },
    designContent: {
        type: Object, // Stores JSON structure for drag-and-drop builders
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

EmailTemplateSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

export default mongoose.models.EmailTemplate || mongoose.model('EmailTemplate', EmailTemplateSchema);
