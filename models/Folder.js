import mongoose from 'mongoose';

const FolderSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

FolderSchema.index({ teamId: 1, name: 1 }, { unique: true });

FolderSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

export default mongoose.models.Folder || mongoose.model('Folder', FolderSchema);
