const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productroutes');

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

module.exports = app;
