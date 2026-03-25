import mongoose from 'mongoose';

const inquirySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    contact: {
      type: String,
      required: [true, 'Please add contact details'],
    },
    requirements: {
      type: String,
      required: [true, 'Please add property requirements'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Resolved'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;