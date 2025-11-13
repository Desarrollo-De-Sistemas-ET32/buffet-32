
import mongoose, { Types } from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    maxUses: {
        type: Number,
        required: true,
        default: 1,
    },
    usedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

export default Coupon;