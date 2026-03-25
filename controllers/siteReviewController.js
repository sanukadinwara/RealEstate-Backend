import SiteReview from '../models/siteReviewModel.js';

export const getSiteReviews = async (req, res) => {
  try {
    const reviews = await SiteReview.find({}).sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

export const createSiteReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating && !comment) {
      return res.status(400).json({ message: 'Please provide a rating or a comment' });
    }

    const review = await SiteReview.create({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating) || 0,
      comment: comment || '',
    });

    res.status(201).json({ message: 'Review added successfully!', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSiteReview = async (req, res) => {
  try {
    const review = await SiteReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSiteReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await SiteReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to edit this review' });
    }

    review.rating = rating !== undefined ? Number(rating) : review.rating;
    review.comment = comment !== undefined ? comment : review.comment;

    const updatedReview = await review.save();
    res.json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};