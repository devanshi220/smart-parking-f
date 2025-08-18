import React, { useState } from "react";
import BookingForm from "./BookingForm";

const lots = [
  {
    id: 1,
    name: "Central City Lot",
    location: "Downtown, Main St.",
    available: 12,
  },
  {
    id: 2,
    name: "Mall Parking",
    location: "City Mall, 2nd Ave.",
    available: 5,
  },
  {
    id: 3,
    name: "Station Lot",
    location: "Train Station, North Rd.",
    available: 0,
  },
  {
    id: 4,
    name: "Tech Park Lot",
    location: "Tech Park, Silicon Blvd.",
    available: 8,
  },
];

export default function ParkingLotSelection() {
  const [selectedLot, setSelectedLot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelectLot = (lot) => {
    if (lot.available > 0) {
      setSelectedLot(lot);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLot(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center">
      {/* Pink-Purple gradient background */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600" />
      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto py-10 px-4 w-full">
        <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow-lg">Select a Parking Lot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {lots.map((lot) => (
            <div
              key={lot.id}
              className={`relative group overflow-hidden rounded-2xl shadow-3xl shadow-white/30 border border-white/30 bg-white/30 backdrop-blur-xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-2xl ${lot.available === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => handleSelectLot(lot)}
              style={{ minHeight: 240 }}
            >
              {/* Gradient overlay for glass effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none" />
              {/* Icon */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/80 mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="7" width="18" height="10" rx="2" fill="#e0e7ff" stroke="#fff" strokeWidth="2" />
                  <rect x="7" y="10" width="2" height="4" rx="1" fill="#2563eb" />
                  <rect x="15" y="10" width="2" height="4" rx="1" fill="#2563eb" />
                  <rect x="11" y="10" width="2" height="4" rx="1" fill="#2563eb" />
                </svg>
              </div>
              {/* Title */}
              <h3 className="relative z-10 font-bold text-xl mb-2 text-white drop-shadow-lg text-center">{lot.name}</h3>
              {/* Location */}
              <p className="relative z-10 text-blue-100 mb-4 text-center text-sm font-medium drop-shadow">{lot.location}</p>
              {/* Availability */}
              <span className={`relative z-10 px-4 py-1 rounded-full text-xs font-semibold shadow ${lot.available > 0 ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>{lot.available > 0 ? `${lot.available} slots available` : 'Full'}</span>
            </div>
          ))}
        </div>
        {modalOpen && selectedLot && (
          <div className="fixed inset-0 z-50 h-full w-full flex items-center justify-center backdrop-brightness-50 backdrop-blur-sm p-4">
            <BookingForm lot={selectedLot} onClose={handleCloseModal} />
          </div>
        )}
      </div>
    </div>
  );
} 