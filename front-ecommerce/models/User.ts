
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    dni: {
        type: String,
        required: false,
    },
    course: {
        type: String,
        required: false,
    },
    division: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
