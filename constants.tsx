
import React from 'react';
import { Medicine, LicenseKey } from './types';

export const INITIAL_MEDICINES: Medicine[] = [
  // Antibiotics
  { id: '1', name: 'Amoxicillin', genericName: 'Amoxicillin Trihydrate', barcode: '1001', category: 'Antibiotic', formType: 'Tablet', stock: 150, expiryDate: '2025-12-01', buyPrice: 8.50, price: 12.50, dosage: '500mg', location: 'Shelf A-1' },
  { id: '5', name: 'Azithromycin', genericName: 'Zithromax', barcode: '1005', category: 'Antibiotic', formType: 'Tablet', stock: 45, expiryDate: '2025-10-15', buyPrice: 15.00, price: 25.00, dosage: '250mg', location: 'Shelf A-2' },
  { id: '6', name: 'Ciprofloxacin', genericName: 'Cipro', barcode: '1006', category: 'Antibiotic', formType: 'Tablet', stock: 120, expiryDate: '2026-01-20', buyPrice: 12.00, price: 18.50, dosage: '500mg', location: 'Shelf A-3' },
  { id: '7', name: 'Cephalexin', genericName: 'Keflex', barcode: '1007', category: 'Antibiotic', formType: 'Tablet', stock: 80, expiryDate: '2025-09-05', buyPrice: 10.50, price: 16.00, dosage: '500mg', location: 'Shelf A-4' },
  { id: '8', name: 'Augmentin', genericName: 'Co-amoxiclav', barcode: '1008', category: 'Antibiotic', formType: 'Tablet', stock: 200, expiryDate: '2026-03-12', buyPrice: 22.00, price: 35.00, dosage: '1g', location: 'Shelf A-1' },

  // Analgesics (Pain Relievers)
  { id: '2', name: 'Paracetamol', genericName: 'Acetaminophen', barcode: '1002', category: 'Analgesic', formType: 'Syrup', stock: 500, expiryDate: '2026-06-15', buyPrice: 2.00, price: 5.00, dosage: '500mg', location: 'Shelf B-4' },
  { id: '4', name: 'Ibuprofen', genericName: 'Advil', barcode: '1004', category: 'Analgesic', formType: 'Tablet', stock: 200, expiryDate: '2025-08-10', buyPrice: 4.25, price: 8.75, dosage: '400mg', location: 'Shelf B-2' },
  { id: '9', name: 'Diclofenac', genericName: 'Voltaren', barcode: '1009', category: 'Analgesic', formType: 'Tablet', stock: 150, expiryDate: '2025-11-30', buyPrice: 6.00, price: 11.50, dosage: '50mg', location: 'Shelf B-1' },
  { id: '10', name: 'Naproxen', genericName: 'Aleve', barcode: '1010', category: 'Analgesic', formType: 'Tablet', stock: 95, expiryDate: '2026-02-14', buyPrice: 7.50, price: 14.00, dosage: '250mg', location: 'Shelf B-3' },
  { id: '11', name: 'Tramadol', genericName: 'Ultram', barcode: '1011', category: 'Analgesic', formType: 'Tablet', stock: 30, expiryDate: '2025-12-31', buyPrice: 18.00, price: 30.00, dosage: '50mg', location: 'Controlled Safe' },

  // Cardiology (Heart & Blood Pressure)
  { id: '3', name: 'Atorvastatin', genericName: 'Lipitor', barcode: '1003', category: 'Cardiology', formType: 'Tablet', stock: 85, expiryDate: '2024-11-20', buyPrice: 32.00, price: 45.99, dosage: '20mg', location: 'Cold Storage 1' },
  { id: '12', name: 'Amlodipine', genericName: 'Norvasc', barcode: '1012', category: 'Cardiology', formType: 'Tablet', stock: 140, expiryDate: '2026-05-10', buyPrice: 5.00, price: 12.00, dosage: '5mg', location: 'Shelf C-1' },
  { id: '13', name: 'Lisinopril', genericName: 'Prinivil', barcode: '1013', category: 'Cardiology', formType: 'Tablet', stock: 110, expiryDate: '2025-12-05', buyPrice: 4.50, price: 10.50, dosage: '10mg', location: 'Shelf C-2' },
  { id: '14', name: 'Metoprolol', genericName: 'Lopressor', barcode: '1014', category: 'Cardiology', formType: 'Tablet', stock: 75, expiryDate: '2026-01-18', buyPrice: 8.00, price: 15.00, dosage: '50mg', location: 'Shelf C-3' },
  { id: '15', name: 'Clopidogrel', genericName: 'Plavix', barcode: '1015', category: 'Cardiology', formType: 'Tablet', stock: 60, expiryDate: '2025-07-22', buyPrice: 25.00, price: 42.00, dosage: '75mg', location: 'Shelf C-4' },
  { id: '16', name: 'Losartan', genericName: 'Cozaar', barcode: '1016', category: 'Cardiology', formType: 'Tablet', stock: 90, expiryDate: '2026-04-30', buyPrice: 10.00, price: 19.50, dosage: '50mg', location: 'Shelf C-1' },

  // Antivirals
  { id: '17', name: 'Oseltamivir', genericName: 'Tamiflu', barcode: '1017', category: 'Antiviral', formType: 'Box', stock: 40, expiryDate: '2025-10-10', buyPrice: 35.00, price: 55.00, dosage: '75mg', location: 'Shelf D-1' },
  { id: '18', name: 'Acyclovir', genericName: 'Zovirax', barcode: '1018', category: 'Antiviral', formType: 'Tablet', stock: 120, expiryDate: '2026-02-28', buyPrice: 9.00, price: 16.00, dosage: '400mg', location: 'Shelf D-2' },
  { id: '19', name: 'Valacyclovir', genericName: 'Valtrex', barcode: '1019', category: 'Antiviral', formType: 'Tablet', stock: 55, expiryDate: '2025-11-15', buyPrice: 40.00, price: 65.00, dosage: '500mg', location: 'Shelf D-3' },

  // Supplements & Vitamins
  { id: '20', name: 'Vitamin C', genericName: 'Ascorbic Acid', barcode: '1020', category: 'Supplements', formType: 'Tablet', stock: 300, expiryDate: '2027-01-01', buyPrice: 3.50, price: 8.00, dosage: '1000mg', location: 'Shelf E-1' },
  { id: '21', name: 'Vitamin D3', genericName: 'Cholecalciferol', barcode: '1021', category: 'Supplements', formType: 'Drops', stock: 150, expiryDate: '2026-08-12', buyPrice: 12.00, price: 22.50, dosage: '5000IU', location: 'Shelf E-2' },
  { id: '22', name: 'Omega 3', genericName: 'Fish Oil', barcode: '1022', category: 'Supplements', formType: 'Pieces', stock: 250, expiryDate: '2026-11-20', buyPrice: 15.00, price: 28.00, dosage: '1000mg', location: 'Shelf E-3' },
  { id: '23', name: 'Multivitamin', genericName: 'Centrum Type', barcode: '1023', category: 'Supplements', formType: 'Box', stock: 80, expiryDate: '2025-12-15', buyPrice: 20.00, price: 35.00, dosage: 'Standard', location: 'Shelf E-4' },
  { id: '24', name: 'Iron Supplement', genericName: 'Ferrous Sulfate', barcode: '1024', category: 'Supplements', formType: 'Tablet', stock: 110, expiryDate: '2026-05-05', buyPrice: 6.00, price: 12.00, dosage: '325mg', location: 'Shelf E-1' },

  // Other Medications (Respiratory, Gastro, etc.)
  { id: '25', name: 'Metformin', genericName: 'Glucophage', barcode: '1025', category: 'Other', formType: 'Tablet', stock: 400, expiryDate: '2026-09-30', buyPrice: 5.00, price: 10.00, dosage: '500mg', location: 'Shelf F-1' },
  { id: '26', name: 'Omeprazole', genericName: 'Prilosec', barcode: '1026', category: 'Other', formType: 'Box', stock: 180, expiryDate: '2025-12-10', buyPrice: 14.00, price: 24.50, dosage: '20mg', location: 'Shelf F-2' },
  { id: '27', name: 'Loratadine', genericName: 'Claritin', barcode: '1027', category: 'Other', formType: 'Tablet', stock: 220, expiryDate: '2026-03-25', buyPrice: 4.00, price: 9.99, dosage: '10mg', location: 'Shelf F-3' },
  { id: '28', name: 'Salbutamol', genericName: 'Ventolin Inhaler', barcode: '1028', category: 'Other', formType: 'Pieces', stock: 65, expiryDate: '2025-11-01', buyPrice: 15.00, price: 28.00, dosage: '100mcg', location: 'Shelf F-4' },
  { id: '29', name: 'Levothyroxine', genericName: 'Synthroid', barcode: '1029', category: 'Other', formType: 'Tablet', stock: 130, expiryDate: '2026-07-14', buyPrice: 12.00, price: 22.00, dosage: '50mcg', location: 'Shelf F-1' },
  { id: '30', name: 'Insulin Glargine', genericName: 'Lantus', barcode: '1030', category: 'Other', formType: 'Injection', stock: 25, expiryDate: '2025-05-20', buyPrice: 85.00, price: 120.00, dosage: '100U/ml', location: 'Fridge 1' },
  { id: '31', name: 'Prednisone', genericName: 'Deltasone', barcode: '1031', category: 'Other', formType: 'Tablet', stock: 100, expiryDate: '2026-01-10', buyPrice: 3.50, price: 7.50, dosage: '5mg', location: 'Shelf F-5' },
  { id: '32', name: 'Albuterol', genericName: 'ProAir', barcode: '1032', category: 'Other', formType: 'Pieces', stock: 50, expiryDate: '2025-08-30', buyPrice: 18.00, price: 32.00, dosage: '90mcg', location: 'Shelf F-4' },
  { id: '33', name: 'Gabapentin', genericName: 'Neurontin', barcode: '1033', category: 'Other', formType: 'Tablet', stock: 140, expiryDate: '2026-04-12', buyPrice: 20.00, price: 38.00, dosage: '300mg', location: 'Shelf F-6' },
  { id: '34', name: 'Furosemide', genericName: 'Lasix', barcode: '1034', category: 'Other', formType: 'Tablet', stock: 170, expiryDate: '2026-02-15', buyPrice: 4.00, price: 9.00, dosage: '40mg', location: 'Shelf F-2' },
  { id: '35', name: 'Hydrochlorothiazide', genericName: 'Microzide', barcode: '1035', category: 'Other', formType: 'Tablet', stock: 190, expiryDate: '2025-12-20', buyPrice: 3.00, price: 7.00, dosage: '25mg', location: 'Shelf F-2' },
  { id: '36', name: 'Sertraline', genericName: 'Zoloft', barcode: '1036', category: 'Other', formType: 'Tablet', stock: 80, expiryDate: '2025-10-31', buyPrice: 22.00, price: 45.00, dosage: '50mg', location: 'Shelf G-1' },
  { id: '37', name: 'Escitalopram', genericName: 'Lexapro', barcode: '1037', category: 'Other', formType: 'Tablet', stock: 75, expiryDate: '2026-03-15', buyPrice: 24.00, price: 48.00, dosage: '10mg', location: 'Shelf G-1' },
  { id: '38', name: 'Pantoprazole', genericName: 'Protonix', barcode: '1038', category: 'Other', formType: 'Tablet', stock: 150, expiryDate: '2026-05-20', buyPrice: 12.00, price: 22.50, dosage: '40mg', location: 'Shelf F-2' },
  { id: '39', name: 'Fluticasone', genericName: 'Flonase', barcode: '1039', category: 'Other', formType: 'Drops', stock: 110, expiryDate: '2025-09-12', buyPrice: 14.50, price: 26.00, dosage: '50mcg', location: 'Shelf F-3' },
  { id: '40', name: 'Montelukast', genericName: 'Singulair', barcode: '1040', category: 'Other', formType: 'Tablet', stock: 105, expiryDate: '2026-01-30', buyPrice: 18.00, price: 32.00, dosage: '10mg', location: 'Shelf F-3' },
  { id: '41', name: 'Ranitidine', genericName: 'Zantac', barcode: '1041', category: 'Other', formType: 'Tablet', stock: 200, expiryDate: '2025-11-15', buyPrice: 8.00, price: 15.00, dosage: '150mg', location: 'Shelf F-2' },
  { id: '42', name: 'Budesonide', genericName: 'Symbicort', barcode: '1042', category: 'Other', formType: 'Pieces', stock: 35, expiryDate: '2025-06-10', buyPrice: 95.00, price: 145.00, dosage: '160/4.5', location: 'Shelf F-4' },
];

export const MOCK_LICENSES: LicenseKey[] = [
  { key: 'PH-X921-2024-LITE', status: 'active', expiryDate: '2024-12-31', tier: 'Lite' },
  { key: 'PH-Y812-2025-PRO', status: 'pending', expiryDate: '2025-12-31', tier: 'Pro' }
];

export const UI_COLORS = {
  primary: '#059669', // Emerald 600
  secondary: '#0891b2', // Cyan 600
  accent: '#f59e0b', // Amber 500
  danger: '#e11d48', // Rose 600
  background: '#f8fafc', // Slate 50
};
