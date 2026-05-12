import React from 'react';
import { Leaf, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary-400" />
              <span className="font-bold text-xl tracking-tight">Farm2Table</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting local farmers directly with consumers for fresh, organic, and sustainable produce.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Consumers</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Marketplace</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Freshness Promise</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Farmers</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Sell with us</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Farmer Dashboard</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>support@farm2table.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Organic Lane, Farming City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Farm2Table. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500" /> for local farming
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
