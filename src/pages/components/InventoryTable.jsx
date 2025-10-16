export default function InventoryTable({
  inventoryData,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Low stock":
        return "text-orange-600";
      case "In-stock":
        return "text-green-600";
      case "Out of stock":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4">
        <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 mb-4">
          <div>Items</div>
          <div>Lent Quantity</div>
          <div>Remaining Quantity</div>
          <div>Total Quantity</div>
          <div>Availability</div>
        </div>

        {inventoryData.length > 0 ? (
          inventoryData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 py-4 border-t border-gray-100"
            >
              <div className="text-gray-900 font-medium">{item.item}</div>
              <div className="text-gray-600">{item.lentQuantity}</div>
              <div className="text-gray-600">{item.remainingQuantity}</div>
              <div className="text-gray-600">{item.totalQuantity}</div>
              <div
                className={`font-medium ${getAvailabilityColor(
                  item.availability
                )}`}
              >
                {item.availability}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No inventory data available
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`hover:text-gray-700 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`hover:text-gray-700 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
