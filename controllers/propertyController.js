import Property from '../models/propertyModel.js';

export const getProperties = async (req, res) => {
    try {
        const { keyword, location, minPrice, maxPrice, bedrooms, bathrooms, purpose, maxRent, sort, page, limit, town, floors, area } = req.query;

        let query = { status: 'approved' }; 

        if (keyword) query.title = { $regex: keyword, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
        if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
        if (town) query.town = { $regex: town, $options: 'i' };
        if (floors) query.floors = Number(floors);
        if (area) query.area = { $gte: Number(area) };
        if (purpose) query.purpose = purpose;

        if (purpose === 'Rent' && maxRent) {
            query.rentPrice = { $lte: Number(maxRent) };
        }

        let mongooseQuery = Property.find(query).populate('user', 'name email');

        if (sort) {
            mongooseQuery = mongooseQuery.sort(sort);
        } else {
            mongooseQuery = mongooseQuery.sort('-createdAt');
        }

        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 8; 
        const skip = (pageNumber - 1) * pageSize;

        const total = await Property.countDocuments(query);

        mongooseQuery = mongooseQuery.skip(skip).limit(pageSize);
        const properties = await mongooseQuery;

        res.json({
            properties,
            page: pageNumber,
            pages: Math.ceil(total / pageSize),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('user', 'name email');
        
        if (property) {
            const viewerIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            if (!property.viewedBy.includes(viewerIp)) {
                property.viewedBy.push(viewerIp);
                property.views = property.viewedBy.length;
                
                await property.save();
            }

            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProperty = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            rentPrice, 
            purpose, 
            district, 
            town, 
            bedrooms, 
            bathrooms, 
            area,
            contactName, 
            contactNumber,
            images 
        } = req.body;

        const property = new Property({
            user: req.user._id,
            title: name,
            description,
            purpose,
            price: price || 0,
            rentPrice: rentPrice || 0,
            location: `${town}, ${district}`, 
            bedrooms,
            bathrooms,
            area,
            contactName, 
            contactNumber,
            image: images[0], 
            images: images,
            status: 'pending'
        });

        const createdProperty = await property.save();
        
        res.status(201).json({
            message: 'Property created successfully',
            property: createdProperty
        });
    } catch (error) {
        console.error("DETAILED ERROR:", error);
        res.status(500).json({ message: error.message || 'Failed to create property' });
    }
};

export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            if (property.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(401).json({ message: 'Not authorized to update this property' });
            }

            property.title = req.body.title || property.title;
            property.description = req.body.description || property.description;
            property.purpose = req.body.purpose || property.purpose;
            property.price = req.body.price || property.price;
            property.rentPrice = req.body.rentPrice || property.rentPrice;
            property.location = req.body.location || property.location;
            property.bedrooms = req.body.bedrooms || property.bedrooms;
            property.bathrooms = req.body.bathrooms || property.bathrooms;
            
            property.area = req.body.area || property.area;
            property.contactName = req.body.contactName || property.contactName;
            property.contactNumber = req.body.contactNumber || property.contactNumber;

            property.image = req.body.image || property.image;
            if (req.body.images) {
                property.images = req.body.images;
            }

            property.status = req.body.status || 'pending';

            const updatedProperty = await property.save();
            
            res.json({
                message: 'Property updated successfully',
                property: updatedProperty
            });
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        console.error("Detailed Update Error:", error);
        res.status(500).json({ message: 'Failed to update property' });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            if (property.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(401).json({ message: 'Not authorized to delete this property' });
            }

            await Property.deleteOne({ _id: property._id });
            
            res.json({ message: 'Property deleted successfully' });
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete property' });
    }
};

export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ user: req.user._id }).sort('-createdAt');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your properties' });
  }
};

export const getPendingProperties = async (req, res) => {
  const properties = await Property.find({ status: 'pending' });
  res.json(properties);
};

export const approveProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (property) {
    property.status = 'approved';
    await property.save();
    res.json({ message: 'Property Approved Successfully' });
  } else {
    res.status(404).json({ message: 'Property not found' });
  }
};