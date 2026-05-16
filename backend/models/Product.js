const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  marketPrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String }], // Array of image URLs
  freshnessScore: { type: Number, default: 100 }, // AI score
  harvestDate: { type: Date },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
