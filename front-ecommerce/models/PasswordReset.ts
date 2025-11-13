import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordReset extends Document {
    email: string;
    token: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>({
    email: {
        type: String,
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    used: {
        type: Boolean,
        default: false,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

passwordResetSchema.index({ email: 1, used: 1 });

const PasswordReset = mongoose.models.PasswordReset || mongoose.model<IPasswordReset>('PasswordReset', passwordResetSchema);

export default PasswordReset;
