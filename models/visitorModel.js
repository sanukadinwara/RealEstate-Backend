import mongoose from 'mongoose';

const visitorSchema = mongoose.Schema({
  date: { type: String, required: true, unique: true }, 
  ips: [{ type: String }],
  totalVisits: { type: Number, default: 0 } 
}, { timestamps: true });

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;