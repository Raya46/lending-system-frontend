const Sidebar = ({ activeSection, onNavigate }) => {
  const handleNavigation = (section) => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  return (
    <div className="w-64 bg-white h-screen shadow-sm border-r border-gray-200">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center space-x-3 mb-8">
          <img 
            src="./src/assets/PEENJE.png" 
            alt="PNJ Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-semibold text-gray-900">Lending</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          <button 
            onClick={() => handleNavigation('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left font-medium transition-all mx-0 ${
              activeSection === 'dashboard' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('history')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left font-medium transition-all mx-0 ${
              activeSection === 'history' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>History Log</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('class')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left font-medium transition-all mx-0 ${
              activeSection === 'class' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-6 0H3m2-2h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Class Log</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('inventory')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left font-medium transition-all mx-0 ${
              activeSection === 'inventory' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Inventory</span>
          </button>
        </nav>
        
        <div className="space-y-1 mt-auto">
          <button 
            onClick={() => handleNavigation('settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left font-medium transition-all mx-0 ${
              activeSection === 'settings' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('logout')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left font-medium transition-all mx-0 ${
              activeSection === 'logout' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;