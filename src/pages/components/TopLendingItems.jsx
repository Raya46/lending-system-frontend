export default function TopLendingItems({ topLendingItems }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Top Lending Items
        </h2>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
          See All
        </button>
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
          {topLendingItems.length > 0 ? (
            topLendingItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 py-3 px-6 border-b border-gray-50 hover:bg-gray-25"
              >
                <div className="text-gray-900 truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="text-gray-600 truncate">
                  {item.lentQuantity}
                </div>
                <div className="text-gray-600 truncate">
                  {item.remainingQuantity}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              No lending data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
