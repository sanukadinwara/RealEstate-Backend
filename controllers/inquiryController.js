import Inquiry from '../models/inquiryModel.js';

export const createInquiry = async (req, res) => {
  try {
    const { name, contact, requirements } = req.body;

    if (!name || !contact || !requirements) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }

    const inquiry = await Inquiry.create({
      name,
      contact,
      requirements,
    });

    if (inquiry) {
      res.status(201).json({ message: 'Inquiry sent successfully', inquiry });
    } else {
      res.status(400).json({ message: 'Invalid inquiry data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort('-createdAt');
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inquiries' });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (inquiry) {
      inquiry.status = req.body.status || inquiry.status;
      const updatedInquiry = await inquiry.save();
      
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (inquiry) {
      await Inquiry.deleteOne({ _id: inquiry._id });
      res.json({ message: 'Inquiry deleted successfully' });
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete inquiry' });
  }
};