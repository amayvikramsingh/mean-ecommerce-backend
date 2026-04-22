const Product = require('../models/Product');

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      createdBy: req.user.id
    });  

    await product.save();
    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// CREATE MULTIPLE PRODUCTS
const mongoose = require('mongoose');
// const Product = require('../models/Product');

exports.createMultipleProducts = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ msg: 'Request body must be an array' });
    }

    const products = req.body;

    // ✅ 1. Check duplicate IDs in request
    const ids = products.map(p => p.id);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      await session.abortTransaction();
      return res.status(400).json({
        msg: 'Duplicate IDs found in request payload'
      });
    }

    // ✅ 2. Check duplicates in DB
    const existing = await Product.find({ id: { $in: ids } }).session(session);

    if (existing.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        msg: 'Some product IDs already exist in DB'
      });
    }

    // ✅ 3. Add createdBy
    const productsWithUser = products.map(p => ({
      ...p,
      createdBy: req.user.id
    }));

    // ✅ 4. Insert inside transaction
    await Product.insertMany(productsWithUser, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      msg: 'All products inserted successfully'
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    // Handle duplicate key error (extra safety)
    if (err.code === 11000) {
      return res.status(400).json({
        msg: 'Duplicate ID found, nothing inserted'
      });
    }

    res.status(500).json({ msg: err.message });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(product);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};