import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const AdminInventory = ({ onNavigate, currentSection }) => {
  const [activeSection, setActiveSection] = useState('inventory');

  useEffect(() => {
    if (currentSection) {
      setActiveSection(currentSection);
    }
  }, [currentSection]);

  const handleNavigation = (section) => {
    setActiveSection(section);
    if (onNavigate) {
      onNavigate(section);
    }
  };

  // Sample inventory data
  const inventoryData = [
    { 
      item: 'Projector', 
      lentQuantity: '30 Pieces', 
      remainingQuantity: '12 Pieces', 
      totalQuantity: '42 Pieces', 
      expiryDate: '11/02/25', 
      availability: 'Low stock' 
    },
    { 
      item: 'Terminal Extender', 
      lentQuantity: '21 Pieces', 
      remainingQuantity: '12 Pieces', 
      totalQuantity: '33 Pieces', 
      expiryDate: '21/12/22', 
      availability: 'In-stock' 
    },
    { 
      item: 'Printer', 
      lentQuantity: '0 Pieces', 
      remainingQuantity: '0 Pieces', 
      totalQuantity: '0 Pieces', 
      expiryDate: '5/12/22', 
      availability: 'Out of stock' 
    },
    { 
      item: 'VGA Cable', 
      lentQuantity: '21 Pieces', 
      remainingQuantity: '5 Pieces', 
      totalQuantity: '26 Pieces', 
      expiryDate: '15/03/25', 
      availability: 'Low stock' 
    },
    { 
      item: 'HDMI Cable', 
      lentQuantity: '21 Pieces', 
      remainingQuantity: '10 Pieces', 
      totalQuantity: '31 Pieces', 
      expiryDate: '20/06/25', 
      availability: 'In-stock' 
    },
    { 
      item: 'Laptop Charger', 
      lentQuantity: '8 Pieces', 
      remainingQuantity: '15 Pieces', 
      totalQuantity: '23 Pieces', 
      expiryDate: '10/08/24', 
      availability: 'In-stock' 
    }
  ];

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Low stock': return 'text-orange-600';
      case 'In-stock': return 'text-green-600';
      case 'Out of stock': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const InventoryContent = () => (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <div className="flex items-center space-x-3">
          <button 
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-all font-medium"
            style={{ backgroundColor: '#048494' }}
          >
            Add Product
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            Download all
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lent Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {item.item}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.lentQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.remainingQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.totalQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.expiryDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getAvailabilityColor(item.availability)}`}>
                      {item.availability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <button className="hover:text-gray-700">Previous</button>
          <span>Page 1 of 10</span>
          <button className="hover:text-gray-700">Next</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onNavigate={handleNavigation}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <InventoryContent />
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;