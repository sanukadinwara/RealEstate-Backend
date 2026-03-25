import mongoose from 'mongoose';

const propertySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', 
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        purpose: {type: String, required: true, enum: ['Buy', 'Rent'], default: 'Buy'},
        rentPrice: {type: Number},
        price: { type: Number, required: true },
        location: { type: String, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        area: { type: Number, required: true },
        contactName: { type: String, required: true }, 
        contactNumber: { type: String, required: true },
        image: { type: String, required: true }, 
        images: [{ type: String }],
        views: { type: Number, default: 0 },
        viewedBy: [{ type: String }],
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    },
    {
        timestamps: true,
    }
);

const Property = mongoose.model('Property', propertySchema);

export default Property;