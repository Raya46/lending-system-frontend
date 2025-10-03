export default function InventorySummary({ inventorySummary, onLendClick }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Inventory Summary
      </h3>
      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {inventorySummary.quantityInHand || 0}
          </div>
          <div className="text-sm text-gray-500">Quantity in Hand</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {inventorySummary.toBeReceived || 0}
          </div>
          <div className="text-sm text-gray-500">To be received</div>
        </div>
        <button
          onClick={onLendClick}
          className="px-6 py-2 text-white rounded-md hover:opacity-90 transition-all font-medium"
          style={{ backgroundColor: "#048494" }}
        >
          Lend
        </button>
      </div>
    </div>
  );
}
