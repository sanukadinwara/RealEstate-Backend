import mongoose from 'mongoose';

const siteReviewSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  comment: { type: String }, 
}, { timestamps: true });

const SiteReview = mongoose.model('SiteReview', siteReviewSchema);
export default SiteReview;