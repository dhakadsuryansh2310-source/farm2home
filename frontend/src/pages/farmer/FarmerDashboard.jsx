import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, TrendingUp, DollarSign, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/useAuthStore';

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Vegetable',
    price: '',
    stock: '',
    images: null
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        // Here we could pass farmerId to filter if endpoint supports it,
        // or rely on a specific /my-products endpoint. For now, fetching all and filtering.
        const res = await axios.get('http://localhost:5000/api/products');
        const myProducts = res.data.filter(p => p.farmerId?._id === user._id || p.farmerId === user._id);
        setProducts(myProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, [user._id]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('category', newProduct.category);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);

      if (newProduct.images && newProduct.images.length > 0) {
        Array.from(newProduct.images).forEach(file => {
          formData.append('images', file);
        });
      }

      const res = await axios.post('http://localhost:5000/api/products', formData);
      setProducts([res.data, ...products]);
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', category: 'Vegetable', price: '', stock: '', images: null });
    } catch (error) {
      console.error("Error adding product", error);
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, {
        name: editingProduct.name,
        description: editingProduct.description,
        category: editingProduct.category,
        price: editingProduct.price,
        stock: editingProduct.stock
      });
      setProducts(products.map(p => p._id === editingProduct._id ? res.data : p));
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product", error);
      alert(error.response?.data?.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        console.error("Error deleting product", error);
        alert(error.response?.data?.message || "Failed to delete product");
      }
    }
  };

  return (
    <div className="bg-light min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark">{t('farmer_dashboard_title', { name: user?.name })}</h1>
            <p className="text-gray-600">{t('farmer_dashboard_subtitle')}</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" /> Add New Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 flex items-center gap-4 border-l-4 border-primary-500">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Earnings</p>
              <h3 className="text-2xl font-bold">₹0</h3>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-4 border-l-4 border-blue-500">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Products</p>
              <h3 className="text-2xl font-bold">{products.length}</h3>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-4 border-l-4 border-secondary">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Orders</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="card mb-8">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-dark">Your Products</h2>
          </div>
          <div className="p-0">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading products...</div>
            ) : products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm">
                      <th className="px-6 py-3 font-medium">Product</th>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium">Price</th>
                      <th className="px-6 py-3 font-medium">Stock</th>
                      <th className="px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={product.images && product.images.length > 0 ? `http://localhost:5000${product.images[0]}` : 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&w=100&q=80'}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <span className="font-medium">{product.name}</span>
                        </td>
                        <td className="px-6 py-4 capitalize text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 font-medium">₹{product.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.stock} kg
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => { setEditingProduct(product); setShowEditModal(true); }}
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium mr-3"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-dark mb-1">No products found</h3>
                <p className="text-gray-500 text-sm mb-4">Get started by adding your first product to the marketplace.</p>
                <button onClick={() => setShowAddModal(true)} className="btn-primary py-2 px-4 text-sm">Add Product</button>
              </div>
            )}
          </div>
        </div>

      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required type="text" className="input-field" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required className="input-field" rows="2" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input required type="number" className="input-field" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock (kg)</label>
                  <input required type="number" className="input-field" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="input-field" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Grain">Grain</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="input-field"
                  onChange={e => setNewProduct({ ...newProduct, images: e.target.files })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required type="text" className="input-field" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required className="input-field" rows="2" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input required type="number" className="input-field" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock (kg)</label>
                  <input required type="number" className="input-field" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="input-field" value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Grain">Grain</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowEditModal(false); setEditingProduct(null); }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
