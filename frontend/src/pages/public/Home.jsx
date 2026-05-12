import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Farm Fresh Vegetables" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Fresh from Farm <br/><span className="text-primary-400">Direct to Your Table</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10">
              Skip the middleman. Connect directly with local farmers for the freshest, organic produce delivered straight to your door.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/marketplace" className="btn-primary py-3 px-8 text-lg flex items-center justify-center gap-2">
                Shop Fresh Produce <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/register" className="bg-white text-primary-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg flex items-center justify-center">
                I am a Farmer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">Why Choose Farm2Table?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're revolutionizing the way you buy food by bringing the farmer's market experience online.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div whileHover={{ y: -10 }} className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Organic & Fresh</h3>
              <p className="text-gray-600">Our AI Freshness score ensures you only get the best quality produce harvested within 24 hours.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fair Prices for All</h3>
              <p className="text-gray-600">Farmers set their own prices, earning more while you pay less than supermarket markups.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Same-Day Delivery</h3>
              <p className="text-gray-600">Track your order in real-time as it makes its way from the farm straight to your kitchen.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
