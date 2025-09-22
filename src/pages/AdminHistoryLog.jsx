import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const AdminHistoryLog = ({ onNavigate, currentSection }) => {
  const [activeSection, setActiveSection] = useState('history');

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

  // Sample history log data based on your earlier design
  const historyData = [
    {
      borrowerName: 'Robert Neil',
      items: 'Projector',
      itemId: '706774836',
      class: 'BM6A',
      expiryTime: '--',
      type: 'Taking Return',
      status: 'success'
    },
    {
      borrowerName: 'Tom Homan',
      items: 'Terminal Extender',
      itemId: '686754538B',
      class: 'BM6A',
      expiryTime: '--',
      type: 'Taking Return',
      status: 'success'
    },
    {
      borrowerName: 'Vesmilar',
      items: 'Printer',
      itemId: '686754566',
      class: 'TT2A',
      expiryTime: '5 hours',
      type: 'Not Taking Return',
      status: 'warning'
    },
    {
      borrowerName: 'Charlin',
      items: 'Terminal Extender',
      itemId: '626754457',
      class: 'BM6B',
      expiryTime: '--',
      type: 'Taking Return',
      status: 'success'
    },
    {
      borrowerName: 'Hoffman',
      items: 'Terminal Extender',
      itemId: '636754651',
      class: 'BM2B',
      expiryTime: '--',
      type: 'Taking Return',
      status: 'success'
    },
    {
      borrowerName: 'Famiean Juke',
      items: 'Terminal Extender',
      itemId: '866754982',
      class: 'BM2B',
      expiryTime: '2 hours',
      type: 'Not Taking Return',
      status: 'warning'
    },
    {
      borrowerName: 'Martin',
      items: 'Printer',
      itemId: '886754457',
      class: 'BM2B',
      expiryTime: '--',
      type: 'Taking Return',
      status: 'success'
    },
    {
      borrowerName: 'Joe Nike',
      items: 'Printer',
      itemId: '856754769',
      class: 'BM6B',
      expiryTime: '--',
      type: 'Taking Return',
      status: 'success'
    },
    {
      borrowerName: 'Martin',
      items: 'Printer',
      itemId: '886754457',
      class: 'TT2B',
      expiryTime: '--',
      type: 'Taking Return',
      status: 'success'
    },
    {
      borrowerName: 'Joe Nike',
      items: 'Terminal Extender',
      itemId: '856754769',
      class: 'BM6B',
      expiryTime: '--',
      type: 'Taking Return',
      status: 'success'
    },
    {
      borrowerName: 'Dender Luke',
      items: 'Printer',
      itemId: '686754580',
      class: 'TT4B',
      expiryTime: '4 hours',
      type: 'Not Taking Return',
      status: 'warning'
    },
    {
      borrowerName: 'Joe Nike',
      items: 'Terminal Extender',
      itemId: '856754769',
      class: 'BM6B',
      expiryTime: '--',
      type: 'Taking Return',
      status: 'success'
    },
    {
      borrowerName: 'Joe Nike',
      items: 'Terminal Extender',
      itemId: '856754769',
      class: 'BM6B',
      expiryTime: '--',
      type: 'Taking Return',
      status: 'success'
    }
  ];

  const getStatusColor = (status) => {
    return status === 'success' ? 'text-teal-600' : 'text-red-600';
  };


  const HistoryLogContent = () => (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">History Log</h1>
        <div className="flex items-center space-x-3">
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrower Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.borrowerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.itemId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.expiryTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getStatusColor(item.status)}`}>
                      {item.type}
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
          <HistoryLogContent />
        </div>
      </div>
    </div>
  );
};

export default AdminHistoryLog;