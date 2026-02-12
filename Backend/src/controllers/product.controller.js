import { Product } from "../models/product.model.js";

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const syncProducts = async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/products');

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText} - ${text.substring(0, 100)}`);
    }

    const products = await response.json();

    const syncedProducts = [];

    for (const item of products) {
      const productData = {
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
        variations: {
            colors: ["Black", "White"], // Default variations
            sizes: ["S", "M", "L"]
        }
      };

      // Upsert: Update if exists, Insert if not. Key is 'title' to avoid duplicates based on name.
      // In a real app, external ID would be better, but 'title' works for this assignment.
      const product = await Product.findOneAndUpdate(
        { title: item.title },
        productData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      syncedProducts.push(product);
    }

    res.status(200).json({ success: true, message: "Products synced successfully", data: syncedProducts });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ success: false, message: "Failed to sync products" });
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  syncProducts,
};
