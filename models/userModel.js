import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
        favServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
        
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;