import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { borrowAPI } from "../../utils/api";

export default function BarcodeScannerModal({
  isOpen,
  onClose,
  transactionId,
  onSuccess,
}) {
  const [barcode, setBarcode] = useState("");
  const [scannedItem, setScannedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef(null);
  const scanTimeoutRef = useRef(null);

  const handleScan = async (scannedBarcode = null) => {
    const barcodeToScan = scannedBarcode || barcode;
    if (!barcode.trim()) {
      setError("Please enter a barcode");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await borrowAPI.scanBarcode(barcodeToScan);
      setScannedItem(response.data);
      setBarcode(barcodeToScan);
    } catch (error) {
      console.error("Error scanning barcode: ", error);
      setError(error.response?.data?.message || "failed to scan barcode");
    } finally {
      setLoading(false);
      setIsScanning(false);
    }
  };

  const handleConfirm = async () => {
    if (!scannedItem) return;

    try {
      setLoading(true);
      await borrowAPI.completeTransaction(transactionId, {
        item_id: scannedItem.id_barang,
        waktu_pengembalian: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error completing transaction: ", error);
      setError(
        error.response?.data?.message || "Failed to complete transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setBarcode("");
    setScannedItem(null);
    setError(null);
    setIsScanning(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // handle hardware scanner input
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = () => {
      // clear any existing timeout
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }

      // start scanning mode when a key is pressed in the input
      if (document.activeElement === inputRef.current) {
        setIsScanning(true);

        scanTimeoutRef.current = setTimeout(() => {
          if (barcode.trim() && isScanning) {
            handleScan(barcode);
          }
        }, 500); //wait 500ms after the last keystrok to scan
      }
    };

    const handlekeyUp = (e) => {
      if (e.key === "Enter" && document.activeElement === inputRef.current) {
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
        }
        if (barcode.trim()) {
          handleScan(barcode);
        }
      }
    };

    // focus the input when modal opens
    if (inputRef.current && !scannedItem) {
      inputRef.current.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handlekeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handlekeyUp);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [isOpen, barcode, isScanning, scannedItem]);

  // refocus input when resetting
  useEffect(() => {
    if (!scannedItem && inputRef.current) {
      inputRef.current.focus();
    }
  }, [scannedItem]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Scan barcode
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-gray-400"
            >
              x
            </button>
          </div>
          {!scannedItem ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Barcode
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Enter or scan barcode"
                  className={`w-full px-3 py-2.5 border-gray-300 rounded-md ${
                    isScanning ? "ring-2 ring-blue-500 border-blue-500" : ""
                  }`}
                  onKeyPress={(e) => e.key === "Enter" && handleScan()}
                />
              </div>
              {isScanning && (
                <div className="text-xs text-blue-600 mt-1">
                  Scanning... Hardware scanner detected
                </div>
              )}
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 text-white rounded-md transition-all font-medium"
                  style={{ backgroundColor: "#048494" }}
                >
                  {loading ? "Scanning" : "Scan"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Item found
                </h3>
                <div className="space-y-1 text-sm text-green-700">
                  <p>
                    <strong>Name: </strong> {scannedItem.tipe_nama_barang}
                  </p>
                  <p>
                    <strong>Brand: </strong> {scannedItem.brand}
                  </p>
                  <p>
                    <strong>Model: </strong> {scannedItem.model}
                  </p>
                  <p>
                    <strong>Barcode: </strong> {scannedItem.barcode}
                  </p>
                  <p>
                    <strong>Status: </strong> {scannedItem.status}
                  </p>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={resetScanner}
                  className="flex-1 py-2.5 bg-gray-200 text-gray-700 transition-colors font-medium"
                >
                  Scan Again
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 text-white rounded-md transition-all font-medium disabled:opacity-50"
                  style={{ backgroundColor: "#048494" }}
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
