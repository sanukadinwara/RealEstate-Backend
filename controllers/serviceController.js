import Service from '../models/serviceModel.js';
import mongoose from 'mongoose';

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    console.error("Save Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { name, category, description, logo, images, contact, packages } = req.body;

    const service = await Service.findById(req.params.id);

    if (service) {
      service.name = name || service.name;
      service.category = category || service.category;
      service.description = description || service.description;
      service.logo = logo || service.logo;
      service.images = images || service.images;
      service.contact = contact || service.contact;
      service.packages = packages || service.packages;

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (service) {
    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Invalid Service ID format' });
    }

    const service = await Service.findById(id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createServiceReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const service = await Service.findById(req.params.id);

    if (service) {
      if (!rating && !comment) {
        return res.status(400).json({ message: 'Please provide a rating or a review' });
      }


      const review = {
        name: req.user.name,
        rating: Number(rating) || 0,
        comment: comment || '',     
        user: req.user._id,
      };

      service.reviews.push(review);

      const ratedReviews = service.reviews.filter(r => r.rating > 0);
      service.numReviews = ratedReviews.length;
      service.rating = ratedReviews.length > 0 
        ? ratedReviews.reduce((acc, item) => item.rating + acc, 0) / ratedReviews.length 
        : 0;

      await service.save();
      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteServiceReview = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      const review = service.reviews.find((r) => r._id.toString() === req.params.reviewId);

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(401).json({ message: 'Not authorized to delete this review' });
      }

      service.reviews = service.reviews.filter((r) => r._id.toString() !== req.params.reviewId);

      const ratedReviews = service.reviews.filter(r => r.rating > 0);
      service.numReviews = ratedReviews.length;
      service.rating = ratedReviews.length > 0 
        ? ratedReviews.reduce((acc, item) => item.rating + acc, 0) / ratedReviews.length 
        : 0;

      await service.save();
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateServiceReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const service = await Service.findById(req.params.id);

    if (service) {
      const review = service.reviews.find((r) => r._id.toString() === req.params.reviewId);

      if (!review) return res.status(404).json({ message: 'Review not found' });

      if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(401).json({ message: 'Not authorized to edit this review' });
      }

      review.rating = rating !== undefined ? Number(rating) : review.rating;
      review.comment = comment !== undefined ? comment : review.comment;

      const ratedReviews = service.reviews.filter(r => r.rating > 0);
      service.numReviews = ratedReviews.length;
      service.rating = ratedReviews.length > 0 
        ? ratedReviews.reduce((acc, item) => item.rating + acc, 0) / ratedReviews.length 
        : 0;

      await service.save();
      res.json({ message: 'Review updated successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};