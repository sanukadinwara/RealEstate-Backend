import Visitor from '../models/visitorModel.js';
import Property from '../models/propertyModel.js';
import Service from '../models/serviceModel.js';
import SiteReview from '../models/siteReviewModel.js';

export const recordVisit = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    const today = new Date().toISOString().split('T')[0];

    let visitorRecord = await Visitor.findOne({ date: today });

    if (!visitorRecord) {
      await Visitor.create({
        date: today,
        ips: [ip],
        totalVisits: 1
      });
    } else {
      if (!visitorRecord.ips.includes(ip)) {
        visitorRecord.ips.push(ip);
        visitorRecord.totalVisits += 1;
        await visitorRecord.save();
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error recording visit' });
  }
};

export const getTrafficStats = async (req, res) => {
   try {
     const allRecords = await Visitor.find({});
     
     const totalTraffic = allRecords.reduce((acc, record) => acc + record.totalVisits, 0);
     
     const today = new Date().toISOString().split('T')[0];
     const todayRecord = allRecords.find(r => r.date === today);
     const todayTraffic = todayRecord ? todayRecord.totalVisits : 0;

     res.json({ totalTraffic, todayTraffic });
   } catch (error) {
     res.status(500).json({ message: 'Error fetching stats' });
   }
};

export const getPublicStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalReviews = await SiteReview.countDocuments();

    res.json({
      properties: totalProperties,
      services: totalServices,
      reviews: totalReviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public stats' });
  }
};