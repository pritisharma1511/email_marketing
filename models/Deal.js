import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Deal name is required'],
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    stage: {
        type: String,
        enum: ['New', 'Qualified', 'Proposition', 'Won', 'Lost'],
        default: 'New'
    },
    closeDate: {
        type: Date,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    }
}, {
    timestamps: true
});

const Deal = mongoose.models.Deal || mongoose.model('Deal', dealSchema);

export default Deal;
