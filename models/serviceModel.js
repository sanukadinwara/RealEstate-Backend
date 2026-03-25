import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    comment: { type: String }, 
  },
  { timestamps: true }
);

const serviceSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { 
      type: String, 
      required: true, 
      enum: ['Construction', 'Architect', 'Interior Design', 'Renovation'] 
    },
    description: { type: String, required: true },
    logo: { type: String, required: true }, 
    images: [{ type: String }],
    
    packages: [
      {
        title: String,
        price: String,
        features: [String]
      }
    ],

    contact: {
      phone: { type: String, required: true },
      email: { type: String },
      website: { type: String },
      address: { type: String }
    },

    isFeatured: { type: Boolean, default: false }, 
    verified: { type: Boolean, default: true },
    
    reviews: [reviewSchema],
    
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;