
import React, { useState } from 'react';
import { Medicine, Language, MedicineFormType } from '../types';
import { translations } from '../translations';

interface InventoryProps {
  medicines: Medicine[];
  onAddMedicine: (med: Omit<Medicine, 'id'>) => void;
  onUpdateMedicine: (med: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
  language: Language;
}

const Inventory: React.FC<InventoryProps> = ({ medicines, onAddMedicine, onUpdateMedicine, onDeleteMedicine, language }) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState<Partial<Medicine>>({
    category: 'Other',
    formType: 'Tablet',
    stock: 100,
    price: 0,
    buyPrice: 0,
    barcode: '',
    location: '',
    name: '',
    genericName: '',
    dosage: '500mg'
  });

  const filtered = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.barcode.includes(searchTerm) ||
    m.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMedicine) {
      onUpdateMedicine({
        ...editingMedicine,
        name: formData.name || editingMedicine.name,
        genericName: formData.genericName || editingMedicine.genericName,
        barcode: formData.barcode || editingMedicine.barcode,
        category: (formData.category as any) || editingMedicine.category,
        formType: (formData.formType as MedicineFormType) || editingMedicine.formType,
        stock: Number(formData.stock),
        expiryDate: formData.expiryDate || editingMedicine.expiryDate,
        buyPrice: Number(formData.buyPrice),
        price: Number(formData.price),
        dosage: formData.dosage || editingMedicine.dosage,
        location: formData.location || editingMedicine.location
      });
      setEditingMedicine(null);
    } else {
      onAddMedicine({
        name: formData.name || '',
        genericName: formData.genericName || '',
        barcode: formData.barcode || '',
        category: (formData.category as any) || 'Other',
        formType: (formData.formType as MedicineFormType) || 'Tablet',
        stock: Number(formData.stock) || 0,
        expiryDate: formData.expiryDate || new Date().toISOString().split('T')[0],
        buyPrice: Number(formData.buyPrice) || 0,
        price: Number(formData.price) || 0,
        dosage: formData.dosage || '500mg',
        location: formData.location || 'N/A'
      });
      setShowAddModal(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ 
      category: 'Other', 
      formType: 'Tablet', 
      stock: 100, 
      price: 0, 
      buyPrice: 0, 
      barcode: '', 
      location: '',
      name: '',
      genericName: '',
      dosage: '500mg'
    });
  };

  const handleEdit = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({ ...med });
  };

  const handleDelete = (id: string, name: string) => {
    const msg = language === 'ar' ? `هل أنت متأكد من حذف ${name}؟` : `Are you sure you want to delete ${name}?`;
    if (confirm(msg)) {
      onDeleteMedicine(id);
    }
  };

  const formOptions: MedicineFormType[] = ['Tablet', 'Syrup', 'Ampoule', 'Drops', 'Injection', 'Pieces', 'Box'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{language === 'ar' ? 'إدارة المخزون' : 'Inventory Management'}</h1>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="relative">
            <span className="absolute inset-y-0 start-3 flex items-center text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder={t.searchMedicines} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-10 pe-4 py-2 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-sm whitespace-nowrap"
          >
            {t.addMedicine}
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.medicineName}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.location}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.barcode}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.stock}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.buyPrice}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.price}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((med) => (
              <tr key={med.id} className="hover:bg-slate-50 transition group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{med.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span>{med.genericName}</span>
                    <span>•</span>
                    <span className="font-bold text-indigo-600">{t.forms[med.formType]}</span>
                    <span>•</span>
                    <span>{med.dosage}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-slate-600">
                    <span className="me-1.5 text-xs opacity-60">📍</span>
                    <span className="font-medium">{med.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="bg-slate-100 text-[10px] px-2 py-1 rounded font-mono text-slate-600">
                    {med.barcode || '---'}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <div className={`font-bold ${med.stock < 100 ? 'text-rose-500' : 'text-slate-700'}`}>
                    {med.stock}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-500">{med.buyPrice?.toLocaleString()} {t.currency}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">{med.price.toLocaleString()} {t.currency}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleEdit(med)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">✏️</button>
                    <button onClick={() => handleDelete(med.id, med.name)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddModal || editingMedicine) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{editingMedicine ? (language === 'ar' ? 'تعديل الدواء' : 'Edit Medicine') : t.newMedicineEntry}</h2>
                <p className="text-sm text-slate-500">Update clinical and stock details</p>
              </div>
              <button onClick={() => { setShowAddModal(false); setEditingMedicine(null); }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition">✕</button>
            </div>
            <form className="p-8 space-y-6 overflow-y-auto max-h-[70vh]" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.brandName}</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
                    placeholder="e.g. Lipitor" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.genericName}</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
                    placeholder="e.g. Atorvastatin" 
                    value={formData.genericName}
                    onChange={e => setFormData({...formData, genericName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.barcode}</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-mono" 
                    required 
                    value={formData.barcode}
                    onChange={e => setFormData({...formData, barcode: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.formType}</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    value={formData.formType}
                    onChange={e => setFormData({...formData, formType: e.target.value as MedicineFormType})}
                  >
                    {formOptions.map(opt => (
                      <option key={opt} value={opt}>{t.forms[opt]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.storageLocation}</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
                    placeholder="e.g. Shelf B-2, Fridge" 
                    required 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.category}</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option>Antibiotic</option>
                    <option>Analgesic</option>
                    <option>Cardiology</option>
                    <option>Antiviral</option>
                    <option>Supplements</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.initialStock}</label>
                  <input 
                    type="number" 
                    className="w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.buyPrice}</label>
                   <input 
                     type="number" 
                     step="0.01"
                     className="w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
                     value={formData.buyPrice}
                     onChange={e => setFormData({...formData, buyPrice: parseFloat(e.target.value)})}
                   />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.price}</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.expiry}</label>
                  <input 
                    type="date" 
                    className="w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
                    required 
                    value={formData.expiryDate}
                    onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-6 flex space-x-4 rtl:space-x-reverse">
                <button type="button" onClick={() => { setShowAddModal(false); setEditingMedicine(null); }} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition">{t.cancel}</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition">{t.saveMedicine}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
