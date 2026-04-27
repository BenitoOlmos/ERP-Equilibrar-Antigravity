import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Package, Plus, Edit3, Trash2, X, Archive } from 'lucide-react';

export default function Productos() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/data/products');
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setIsActive(true);
    setShowModal(true);
  };

  const openEdit = (prod: any) => {
    setEditingId(prod.id);
    setName(prod.name);
    setDescription(prod.description || '');
    setPrice(prod.price.toString());
    setStock(prod.stock.toString());
    setIsActive(prod.isActive);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este producto permanentemente?')) return;
    try {
      await axios.delete(`/api/data/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch(e) {
      alert('Error eliminando producto');
    }
  };

  const toggleActiveStat = async (id: string, currentVal: boolean) => {
    try {
      await axios.patch(`/api/data/products/${id}/toggle`, { isActive: !currentVal });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentVal } : p));
    } catch (e) {
      alert('Error updating status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, description, price: Number(price), stock: Number(stock), isActive };
    try {
      if (editingId) {
        const res = await axios.put(`/api/data/products/${editingId}`, payload);
        setProducts(prev => prev.map(p => p.id === editingId ? res.data : p));
      } else {
        const res = await axios.post('/api/data/products', payload);
        setProducts([res.data, ...products]);
      }
      setShowModal(false);
    } catch (error) {
      alert('Error guardando producto');
    }
  };

  // KPIs
  const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);
  const totalValue = products.reduce((acc, curr) => acc + (curr.stock * curr.price), 0);
  const activeProducts = products.filter(p => p.isActive).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 min-h-[calc(100vh-6rem)] flex flex-col relative animate-fade-in">
      <header className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <Archive className="w-8 h-8 mr-3 text-indigo-600" />
            Control de Bodega (Productos)
          </h1>
          <p className="text-slate-500 mt-2">Gestiona el inventario físico, suplementos y productos a la venta.</p>
        </div>
        <button 
          onClick={openNew}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Unidades en Stock</span>
          <span className="text-4xl font-black text-indigo-600">{totalStock}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Catálogo Activo</span>
          <span className="text-4xl font-black text-slate-800">{activeProducts} Ítems</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Valorización Bodega</span>
          <span className="text-4xl font-black text-emerald-600">${totalValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-slate-50/30">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white sticky top-0 z-10 shadow-sm">
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Producto</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Precio Unitario</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Stock Disponible</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id} className="border-b border-slate-100 hover:bg-white transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{prod.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{prod.description}</div>
                    </td>
                    <td className="p-4 font-black text-slate-700">${prod.price.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Package className={`w-4 h-4 ${prod.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                        <span className={`font-bold ${prod.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          {prod.stock} Uds.
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleActiveStat(prod.id, prod.isActive)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${prod.isActive ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {prod.isActive ? 'Activo' : 'Pausado'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(prod)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(prod.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400 font-medium">No hay productos registrados en bodega.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800">{editingId ? 'Editar Producto / Restocar' : 'Nuevo Producto Físico'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre del Producto</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Descripción Corta</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Precio de Venta ($)</label>
                  <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-black text-slate-800 text-lg focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stock Inicial / Actual</label>
                  <input type="number" required value={stock} onChange={e => setStock(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-5 h-5 accent-indigo-600 rounded" />
                <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">Producto Activo en Catálogo (Vendible)</label>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Cancelar</button>
                <button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
