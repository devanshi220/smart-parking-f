import { useEffect, useState } from "react";
import BookingForm from "./BookingForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ParkingLotSelection() {
  const [selectedLot, setSelectedLot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [lots, setLots] = useState([]);
  const [key,updateKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if(!token || token.length === 0) {
      navigate("/login");
      return;
    }

    const fetchParkingLots = async () => {
      try {
        setIsLoading(true);
        const {data} = await axios.get("http://localhost:8080/api/parking-lots", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLots(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch parking lots:", err);
        setError("Failed to load parking lots. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParkingLots();
  }, [navigate,key]);

  const handleSelectLot = (lot) => {
    if ((lot.totalSlots !== lot.bookedSlots) && lot.isOpen) {
      setSelectedLot(lot);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLot(null);
  };

  return (
    <>
    <div className="relative w-full flex flex-col justify-center items-start">
        <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 w-full">
          
          {/* Header with loading/error state */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900">{error}</p>
            </div>
          ) : (
            <>
              {/* Filter buttons */}
              <div className="flex justify-center mb-8 gap-x-3">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-6 py-2 rounded-md transition-all ${
                    filter === "all"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("available")}
                  className={`px-6 py-2 rounded-md transition-all ${
                    filter === "available"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  Available
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {lots
                .filter(lot => filter === "all" || (lot.bookedSlots !== lot.totalSlots && lot.isOpen))
                .map((lot) => (
                <div
                  key={lot.id}
                  onClick={() => handleSelectLot(lot)}
                  className={`relative rounded-2xl border border-blue-200 bg-white p-8 flex flex-col items-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                  (lot.totalSlots === lot.bookedSlots || !lot.isOpen)
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer"
                  }`}
                  style={{ minHeight: 240 }}
                >
            {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 shadow-inner">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="7"
                    width="18"
                    height="10"
                    rx="2"
                    fill="#bfdbfe"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <rect
                    x="7"
                    y="10"
                    width="2"
                    height="4"
                    rx="1"
                    fill="#1d4ed8"
                  />
                  <rect
                    x="15"
                    y="10"
                    width="2"
                    height="4"
                    rx="1"
                    fill="#1d4ed8"
                  />
                  <rect
                    x="11"
                    y="10"
                    width="2"
                    height="4"
                    rx="1"
                    fill="#1d4ed8"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-xl mb-2 text-blue-800 text-center">
                {lot.name}
              </h3>

              {/* Location */}
              <p className="text-blue-600 mb-4 text-center text-sm font-medium">
                {lot.address}
              </p>

              {/* Availability */}
              <span
                className={`px-4 py-1 rounded-full text-xs font-semibold shadow ${
                  (lot.bookedSlots !== lot.totalSlots && lot.isOpen)
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {(lot.bookedSlots !== lot.totalSlots)
                  ? (lot.isOpen?`${lot.totalSlots - lot.bookedSlots} slots available`:"Termporary Closed")
                  : "No slots available"}
              </span>
                </div>
                ))}
              </div>
            </>
          )}

        {modalOpen && selectedLot && (
          <div className="fixed inset-0 z-50 h-full w-full flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <BookingForm lot={selectedLot} onClose={handleCloseModal} updateKey={updateKey}/>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
