import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'List name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    folderName: {
        type: String,
        default: 'Your First Folder'
    },
    contactCount: {
        type: Number,
        default: 0
    },
    rules: [{
        field: { type: String, required: true },
        operator: { type: String, required: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true }
    }]
}, {
    timestamps: true
});

// Ensure a team can't have duplicate list names in the same folder
listSchema.index({ teamId: 1, name: 1, folderName: 1 }, { unique: true });

const List = mongoose.models.List || mongoose.model('List', listSchema);

export default List;
