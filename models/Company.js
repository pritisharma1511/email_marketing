import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
    },
    domain: {
        type: String,
        trim: true,
    },
    industry: {
        type: String,
        trim: true,
    },
    employeeCount: {
        type: Number,
        default: null,
    },
    contactCount: {
        type: Number,
        default: 0
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
});

companySchema.index({ teamId: 1, name: 1 }, { unique: true });

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

export default Company;
