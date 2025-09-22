import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Breadcrumbs from './components/Breadcrumb.jsx';

const AdminClassLog = ({ onNavigate, currentSection }) => {
  const [activeSection, setActiveSection] = useState('class');
  const [selectedClass, setSelectedClass] = useState(null);

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

  // Sample class data
  const classData = [
    {
      className: 'BM6A',
      students: 32,
      activeLoans: 5,
      status: 'Active'
    },
    {
      className: 'BM6B',
      students: 28,
      activeLoans: 3,
      status: 'Active'
    },
    {
      className: 'BM4A',
      students: 30,
      activeLoans: 7,
      status: 'Active'
    },
    {
      className: 'BM4B',
      students: 25,
      activeLoans: 2,
      status: 'Active'
    },
    {
      className: 'BM2A',
      students: 27,
      activeLoans: 4,
      status: 'Active'
    },
    {
      className: 'BM2B',
      students: 29,
      activeLoans: 1,
      status: 'Active'
    }
  ];

  // Sample student data for BM6B (you can expand this for other classes)
  const studentData = {
    'BM6B': [
      {
        borrowerName: 'Aditya Putra Ramadhan',
        nim: '210342148',
        numberOfTimesBorrowing: 42,
        returnedItems: 42,
        unreturnedItems: 0,
        type: 'Taking Return'
      },
      {
        borrowerName: 'Ahmad Rifqi',
        nim: '210341063',
        numberOfTimesBorrowing: 33,
        returnedItems: 33,
        unreturnedItems: 0,
        type: 'Taking Return'
      },
      {
        borrowerName: 'Ancasta Eka Octaviano',
        nim: '210342008',
        numberOfTimesBorrowing: 0,
        returnedItems: 0,
        unreturnedItems: 0,
        type: 'Taking Return'
      },
      {
        borrowerName: 'Azrul Hafidzh Busyairao',
        nim: '210341205',
        numberOfTimesBorrowing: 42,
        returnedItems: 41,
        unreturnedItems: 1,
        type: 'Not Taking Return'
      },
      {
        borrowerName: 'Bagas Putra Kurniawan',
        nim: '210341046',
        numberOfTimesBorrowing: 33,
        returnedItems: 33,
        unreturnedItems: 0,
        type: 'Taking Return'
      },
      {
        borrowerName: 'Christian Isworo Yuhannas',
        nim: '210341632',
        numberOfTimesBorrowing: 15,
        returnedItems: 14,
        unreturnedItems: 1,
        type: 'Not Taking Return'
      },
      {
        borrowerName: 'Dwi Fitriana',
        nim: '210341061',
        numberOfTimesBorrowing: 42,
        returnedItems: 42,
        unreturnedItems: 0,
        type: 'Taking Return'
      },
      {
        borrowerName: 'Erni Saflin',
        nim: '210342008',
        numberOfTimesBorrowing: 33,
        returnedItems: 33,
        unreturnedItems: 0,
        type: 'Taking Return'
      }
    ]
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-green-600' : 'text-gray-500';
  };

  const getTypeColor = (type) => {
    return type === 'Taking Return' ? 'text-teal-600' : 'text-red-600';
  };

  const handleClassClick = (className) => {
    setSelectedClass(className);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
  };

  // Student Detail View Component
  const StudentDetailView = ({ className }) => {
    const students = studentData[className] || [];
    const breadcrumbItems = [
      {
        label: 'Class Log',
        href: true,
        onClick: handleBackToClasses
      },
      {
        label: className,
        href: false
      }
    ];

    return (
      <div className="p-6">
        <Breadcrumbs items={breadcrumbItems} />
        {/* Back button and header */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToClasses}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {className}
          </button>
          <div className="flex items-center space-x-3 ml-auto">
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

        {/* Student Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Times Borrowing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Returned Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unreturned Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.borrowerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.nim}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.numberOfTimesBorrowing} Times
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.returnedItems} Pieces
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.unreturnedItems} Pieces
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getTypeColor(student.type)}`}>
                        {student.type}
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
            <span>Page 1 of 2</span>
            <button className="hover:text-gray-700">Next</button>
          </div>
        </div>
      </div>
    );
  };



  // Main Class List View Component
  const ClassLogContent = () => {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Class Log</h1>
          <div className="flex items-center space-x-3">
            <button
              className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-all font-medium"
              style={{ backgroundColor: '#048494' }}
            >
              Add Class
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-6 0H3m2-2h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Classes</p>
                <p className="text-2xl font-semibold text-gray-900">6</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">171</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Loans</p>
                <p className="text-2xl font-semibold text-gray-900">21</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-teal-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Classes</p>
                <p className="text-2xl font-semibold text-gray-900">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Loans
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleClassClick(item.className)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.className}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.activeLoans}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <button className="hover:text-gray-700">Previous</button>
            <span>Page 1 of 10</span>
            <button className="hover:text-gray-700">Next</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onNavigate={handleNavigation} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchPlaceholder="Search class..." />
        <div className="flex-1 overflow-y-auto">
          {selectedClass ? (
            <StudentDetailView className={selectedClass} />
          ) : (
            <ClassLogContent />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClassLog;