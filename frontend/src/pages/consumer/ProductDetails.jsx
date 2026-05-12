import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, MapPin, Truck, Leaf, ShieldCheck } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const { setCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to your cart");
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/cart/add', { productId: product._id, quantity });
      setCart(res.data);
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-light">
        <Leaf className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <Link to="/marketplace" className="mt-4 text-primary-600 hover:underline">Return to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/marketplace" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Marketplace
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            
            {/* Product Image */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl overflow-hidden bg-gray-100 relative h-[400px]"
            >
              <img 
                src={product.images && product.images.length > 0 ? `http://localhost:5000${product.images[0]}` : 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-lg font-bold text-primary-700 flex items-center gap-1 shadow-md">
                <Star className="h-4 w-4 fill-current text-secondary" /> {product.freshnessScore}% Fresh
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">
                {product.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-dark mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <span className="text-3xl font-bold text-primary-600">₹{product.price}</span>
                <span className="text-gray-500">/ kg</span>
                <span className="ml-auto px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                  In Stock ({product.stock} kg)
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-dark mb-2">About this product</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "Freshly harvested organic produce, brought to you directly from the farm. No chemicals, no middleman, just pure nature."}
                </p>
              </div>

              {/* Farmer Info */}
              <div className="bg-gray-50 p-4 rounded-xl mb-8 flex items-center gap-4 border border-gray-100">
                <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {product.farmerId?.name?.charAt(0) || 'F'}
                </div>
                <div className="flex-grow">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Grown By</p>
                  <p className="font-bold text-dark">{product.farmerId?.name || 'Local Farmer'}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center text-sm text-gray-600 gap-1">
                    <MapPin className="h-4 w-4 text-primary-500" /> 
                    {product.farmerId?.address?.city || 'Local Area'}
                  </div>
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="mt-auto pt-4 flex gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                  >-</button>
                  <span className="px-4 py-3 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                  >+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow btn-primary flex justify-center items-center gap-2 text-lg py-3 shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck className="h-5 w-5 text-primary-500" />
                  <span>Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-primary-500" />
                  <span>Direct Delivery</span>
                </div>
              </div>

            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
