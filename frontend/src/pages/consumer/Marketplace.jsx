import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ShoppingCart, Star, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { cart, setCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      alert("Please login to add items to your cart");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/cart/add', { productId, quantity: 1 });
      setCart(res.data);
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === '' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-light min-h-screen pb-12">
      {/* Search Header */}
      <div className="bg-primary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Fresh Produce Marketplace</h1>
          <div className="flex gap-4 max-w-2xl">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for fresh vegetables, fruits..." 
                className="w-full pl-10 pr-4 py-3 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-primary-900 px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors h-full"
              >
                <Filter className="h-5 w-5" /> Filter {category && `(${category})`}
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Categories</div>
                  <button onClick={() => {setCategory(''); setShowFilters(false)}} className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${category === '' ? 'text-primary-600 font-bold' : 'text-gray-700'}`}>All</button>
                  <button onClick={() => {setCategory('Vegetable'); setShowFilters(false)}} className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${category === 'Vegetable' ? 'text-primary-600 font-bold' : 'text-gray-700'}`}>Vegetables</button>
                  <button onClick={() => {setCategory('Fruit'); setShowFilters(false)}} className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${category === 'Fruit' ? 'text-primary-600 font-bold' : 'text-gray-700'}`}>Fruits</button>
                  <button onClick={() => {setCategory('Dairy'); setShowFilters(false)}} className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${category === 'Dairy' ? 'text-primary-600 font-bold' : 'text-gray-700'}`}>Dairy</button>
                  <button onClick={() => {setCategory('Grain'); setShowFilters(false)}} className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${category === 'Grain' ? 'text-primary-600 font-bold' : 'text-gray-700'}`}>Grains</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={product._id} 
                onClick={() => navigate(`/product/${product._id}`)}
                className="card group cursor-pointer flex flex-col"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={product.images && product.images.length > 0 ? `http://localhost:5000${product.images[0]}` : 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold text-primary-700 flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 fill-current text-secondary" /> {product.freshnessScore}% Fresh
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1 uppercase font-semibold">{product.category}</div>
                  <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 truncate">{product.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                      {product.farmerId?.name?.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-500 truncate">By {product.farmerId?.name}</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-xl text-dark">₹{product.price}<span className="text-sm font-normal text-gray-500">/kg</span></span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product._id); }}
                      className="bg-primary-50 text-primary-600 p-2 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600">No products found matching your search.</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
