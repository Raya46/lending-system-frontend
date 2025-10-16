export default function LowStockItems({ lowStockItems }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Low Quantity Stock
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-48">
        <div className="overflow-y-auto h-44 p-6">
          {lowStockItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 py-3 hover:bg-gray-25 rounded-md px-2 -mx-2"
            >
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="font-medium text-gray-900 truncate"
                  title={item.name}
                >
                  {item.name}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  Remaining Quantity • {item.remainingQuantity} Pieces
                </div>
              </div>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium flex-shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
