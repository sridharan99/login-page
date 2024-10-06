const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Joi = require('joi');

// App setup
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    address: String
});

const User = mongoose.model('User', userSchema);

// Validation schema using Joi
const userValidationSchema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    phone: Joi.string().min(10).max(15).required(),
    email: Joi.string().email().required(),
    address: Joi.string().required()
});

// CRUD Routes

// Create new user
app.post('/api/users', async (req, res) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send('Error saving user: ' + err);
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.status(200).send(users);
});

// Update user by ID
app.put('/api/users/:id', async (req, res) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).send('User not found');
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send('Error updating user: ' + err);
    }
});

// Delete user by ID
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.status(200).send('User deleted');
    } catch (err) {
        res.status(500).send('Error deleting user: ' + err);
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});