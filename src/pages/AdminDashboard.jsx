import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StudentLendModal from './components/StudentLendModal.jsx';
import LectureLendModal from './components/LecturerLendModal.jsx';

const AdminDashboard = ({ onNavigate, currentSection }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [lendModalOpen, setLendModalOpen] = useState(false);
  const [modalType, setModalType] = useState('student'); // 'student' or 'lecturer'
  const [borrowerData, setBorrowerData] = useState(null);

  useEffect(() => {
    if (currentSection) {
      setActiveSection(currentSection);
    }
  }, [currentSection]);

  // Function to determine modal type based on name input
  const handleLendClick = () => {
    setLendModalOpen(true);
    setModalType('student'); // Default to student
    setBorrowerData(null);
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    if (onNavigate) {
      onNavigate(section);
    }
  };

  // Sample data
  const topLendingItems = [
    { name: 'Projector', lentQuantity: 30, remainingQuantity: 12 },
    { name: 'Terminal Extender', lentQuantity: 21, remainingQuantity: 18 },
    { name: 'VGA Cable', lentQuantity: 21, remainingQuantity: 5 },
    { name: 'HDMI Cable', lentQuantity: 21, remainingQuantity: 10 }
  ];

  const lowStockItems = [
    { name: 'Projector', remainingQuantity: 12, status: 'Low' },
    { name: 'VGA Cable', remainingQuantity: 5, status: 'Low' },
    { name: 'HDMI Cable', remainingQuantity: 10, status: 'Low' }
  ];

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


  const LendingDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Top section with two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Lending Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Top Lending Items</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">See All</button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-48">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500">
                <div className="truncate">Name</div>
                <div className="truncate">Lent Quantity</div>
                <div className="truncate">Remaining Quantity</div>
              </div>
            </div>
            <div className="overflow-y-auto h-32">
              {topLendingItems.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-3 px-6 border-b border-gray-50 hover:bg-gray-25">
                  <div className="text-gray-900 truncate" title={item.name}>{item.name}</div>
                  <div className="text-gray-600 truncate">{item.lentQuantity}</div>
                  <div className="text-gray-600 truncate">{item.remainingQuantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Quantity Stock */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Low Quantity Stock</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">See All</button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-48">
            <div className="overflow-y-auto h-44 p-6">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 py-3 hover:bg-gray-25 rounded-md px-2 -mx-2">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate" title={item.name}>{item.name}</div>
                    <div className="text-sm text-gray-500 truncate">Remaining Quantity • {item.remainingQuantity} Pieces</div>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium flex-shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
        <div className="flex items-center space-x-3">
          <button
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-all font-medium"
            style={{ backgroundColor: '#048494' }}
          >
            Add Product
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            Filters
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            Download all
          </button>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">See All</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4">
          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 mb-4">
            <div>Items</div>
            <div>Lent Quantity</div>
            <div>Remaining Quantity</div>
            <div>Total Quantity</div>
            <div>Expiry Date</div>
            <div>Availability</div>
          </div>

          {inventoryData.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 py-4 border-t border-gray-100">
              <div className="text-gray-900 font-medium">{item.item}</div>
              <div className="text-gray-600">{item.lentQuantity}</div>
              <div className="text-gray-600">{item.remainingQuantity}</div>
              <div className="text-gray-600">{item.totalQuantity}</div>
              <div className="text-gray-600">{item.expiryDate}</div>
              <div className={`font-medium ${getAvailabilityColor(item.availability)}`}>
                {item.availability}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Previous</span>
          <span>Page 1 of 10</span>
          <span>Next</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Summary</h3>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">27</div>
            <div className="text-sm text-gray-500">Quantity in Hand</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">51</div>
            <div className="text-sm text-gray-500">To be received</div>
          </div>
          <button
            onClick={handleLendClick}
            className="px-6 py-2 text-white rounded-md hover:opacity-90 transition-all font-medium"
            style={{ backgroundColor: '#048494' }}
          >
            Lend
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onNavigate={handleNavigation} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchPlaceholder="Search product..." />
        <div className="flex-1 overflow-y-auto">
          <LendingDashboard />
        </div>
      </div>
{lendModalOpen && (
  modalType === 'student' ? (
    <StudentLendModal
      isOpen={lendModalOpen}
      onClose={() => setLendModalOpen(false)}
      onSubmit={(data) => {
        console.log('Student lend data:', data);
        setLendModalOpen(false);
      }}
      modalType={modalType}
      setModalType={setModalType}
      borrowerData={borrowerData}
    />
  ) : (
    <LectureLendModal
      isOpen={lendModalOpen}
      onClose={() => setLendModalOpen(false)}
      onSubmit={(data) => {
        console.log('Lecturer lend data:', data);
        setLendModalOpen(false);
      }}
      modalType={modalType}
      setModalType={setModalType}
      borrowerData={borrowerData}
    />
  )
)}
    </div>
  );
};

export default AdminDashboard;