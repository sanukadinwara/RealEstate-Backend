import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Service from '../models/serviceModel.js';

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'This email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin, 
                message: 'User created successfully'
            });
        } else {
            res.status(400).json({ message: 'User creation failed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '15d',
            });

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin, 
                token: token,
                message: 'Login Successful'
            });
        } else {
            res.status(401).json({ message: 'Email or Password is incorrect' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const propertyId = req.params.id;

        if (user.favorites.includes(propertyId)) {
            user.favorites.pull(propertyId);
        } else {
            user.favorites.push(propertyId);
        }
        
        await user.save();
        res.json(user.favorites); 
    } catch (error) {
        res.status(500).json({ message: 'Error updating favorites' });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites' });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const socialLogin = async (req, res) => {
    const { name, email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({ 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                isAdmin: user.isAdmin, 
                token, 
                message: 'Social Media Login Successful!' 
            });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            
            user = await User.create({ name, email, password: hashedPassword });
            
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.status(201).json({ 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                isAdmin: user.isAdmin,
                token, 
                message: 'Social Media Signup Successful!' 
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error during Social Media Login' });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Real Estate App - Password Reset',
            text: `To reset your password, go to this link: \n\n ${resetUrl}`,
        });

        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Email could not be sent' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password; 
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: req.headers.authorization.split(' ')[1], 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating profile' });
  }
};

export const toggleFavoriteService = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const serviceId = req.params.id;

    if (!user) return res.status(404).json({ message: 'User not found' });

    const serviceExists = await Service.findById(serviceId);
    if (!serviceExists) return res.status(404).json({ message: 'Service not found' });

    const isFavorite = user.favServices.includes(serviceId);

    if (isFavorite) {
      user.favServices = user.favServices.filter(id => id.toString() !== serviceId);
      await user.save();
      res.json({ message: 'Removed from Favorites', favServices: user.favServices });
    } else {
      user.favServices.push(serviceId);
      await user.save();
      res.json({ message: 'Added to Favorites', favServices: user.favServices });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites')
      .populate('favServices');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      properties: user.favorites || [],
      services: user.favServices || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};