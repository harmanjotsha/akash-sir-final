const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const category = req.query.category || '';

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.log('GET PRODUCTS ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, image, description, stock, category } = req.body;

    if (!name || !price || !image || !description || !category) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const product = await Product.create({
      name,
      price,
      image,
      description,
      stock: stock || 10,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log('CREATE PRODUCT ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, image, description, stock, category } = req.body;

    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.description = description || product.description;
    product.stock = stock !== undefined ? stock : product.stock;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log('UPDATE PRODUCT ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log('DELETE PRODUCT ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;

    const products = await Product.find({
      stock: { $lte: threshold }
    }).sort({ stock: 1 });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.log('LOW STOCK ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
};