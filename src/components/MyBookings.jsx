import React from "react";

// Example booking data that matches the form structure
const exampleBookings = [
  {
    id: 1,
    owner: "John Smith",
    mobile: "9876543210",
    VehicleNumber: "MH-12-AB-1234",
    VehicleModel: "Honda City",
    timeSlot: "9AM-11AM",
    lot: {
      name: "Central City Lot",
      location: "Downtown, Main St."
    },
    bookingDate: "2024-01-15",
    status: "Confirmed"
  },
  {
    id: 2,
    owner: "Sarah Johnson",
    mobile: "8765432109",
    VehicleNumber: "DL-01-CD-5678",
    VehicleModel: "Maruti Swift",
    timeSlot: "11AM-1PM",
    lot: {
      name: "Mall Parking",
      location: "City Mall, 2nd Ave."
    },
    bookingDate: "2024-01-16",
    status: "Confirmed"
  },
  {
    id: 3,
    owner: "Michael Brown",
    mobile: "7654321098",
    VehicleNumber: "KA-05-EF-9012",
    VehicleModel: "Hyundai i20",
    timeSlot: "1PM-3PM",
    lot: {
      name: "Tech Park Lot",
      location: "Tech Park, Silicon Blvd."
    },
    bookingDate: "2024-01-17",
    status: "Pending"
  },
  {
    id: 4,
    owner: "Emily Davis",
    mobile: "6543210987",
    VehicleNumber: "TN-07-GH-3456",
    VehicleModel: "Tata Nexon",
    timeSlot: "3PM-5PM",
    lot: {
      name: "Central City Lot",
      location: "Downtown, Main St."
    },
    bookingDate: "2024-01-18",
    status: "Confirmed"
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Confirmed":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    case "Pending":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    case "Cancelled":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
};

export default function MyBookings() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage your parking reservations</p>
      </div>

      {exampleBookings.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">You haven't made any parking reservations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              {/* Header with status */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Booking #{booking.id}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">{booking.status}</span>
                  </span>
                </div>
                
                {/* Parking lot info */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">{booking.lot.name}</h4>
                  <p className="text-sm text-gray-600">{booking.lot.location}</p>
                </div>
              </div>

              {/* Booking details */}
              <div className="p-6 space-y-4">
                {/* Owner and Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Owner Name
                    </label>
                    <p className="text-sm text-gray-900 font-medium">{booking.owner}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Mobile
                    </label>
                    <p className="text-sm text-gray-900">{booking.mobile}</p>
                  </div>
                </div>

                {/* Car details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Car Number
                    </label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{booking.VehicleNumber}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Car Model
                    </label>
                    <p className="text-sm text-gray-900">{booking.VehicleModel}</p>
                  </div>
                </div>

                {/* Time slot and date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Time Slot
                    </label>
                    <p className="text-sm text-gray-900 font-medium">{booking.timeSlot}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Booking Date
                    </label>
                    <p className="text-sm text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                    View Details
                  </button>
                  {booking.status === "Confirmed" && (
                    <button className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 