import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const getStatusColor = (status) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    case "COMPLETED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "PENDING":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "CANCELLED":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "COMPLETED":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return null;
  }
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lotDetails , setlotDetails] = useState({});
  const [statusFilter, setStatusFilter] = useState(null);
  const token = localStorage.getItem("authToken");

  const getDetailsByIds = async (lotIds) =>{
      try{
        const {data} = await axios.post("http://localhost:8080/api/parking-lots/batch-details",{
          parkingLotIds:lotIds
        },{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        setlotDetails(data);
      }catch(err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      }
    };


    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const {data} = await axios.get("http://localhost:8080/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookings(data);
        await getDetailsByIds(data.map(booking=>booking.parkingLotId));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };


  useEffect(() => {
    if (!token || token.length === 0) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [navigate,token]);

  const changeStatus = (bId,status) =>{
    const token = localStorage.getItem("authToken");
    setIsLoading(true);
    axios
      .put(`http://localhost:8080/api/bookings/${bId}/status`, {
        status
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchBookings();
      })
      .catch(() => {
        setError("Failed to update booking status. Please try again.");
        setIsLoading(false);
      });
  }
  
  // Filter bookings based on status filter
  const filteredBookings = statusFilter 
    ? bookings.filter(booking => String(booking.status).toUpperCase() === String(statusFilter).toUpperCase())
    : bookings;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-600">
          View and manage your parking reservations
        </p>
      </div>

      {/* Loading and error states */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
          <div className="flex justify-center mb-8 gap-4">
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${
                statusFilter === null 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setStatusFilter(null)}
            >
              All
            </button>
        <button 
          className={`px-4 py-2 rounded-md transition-colors ${
            statusFilter === "CONFIRMED" 
              ? 'bg-green-600 text-white' 
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
          onClick={() => setStatusFilter("CONFIRMED")}
        >
          Confirmed
        </button>
        <button 
          className={`px-4 py-2 rounded-md transition-colors ${
            statusFilter === "PENDING" 
              ? 'bg-yellow-600 text-white' 
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}
          onClick={() => setStatusFilter("PENDING")}
        >
          Pending
        </button>
    <button 
      className={`px-4 py-2 rounded-md transition-colors ${
        statusFilter === "CANCELLED" 
          ? 'bg-red-600 text-white' 
          : 'bg-red-100 text-red-800 hover:bg-red-200'
      }`}
      onClick={() => setStatusFilter("CANCELLED")}
    >
      Cancelled
    </button>
    <button 
      className={`px-4 py-2 rounded-md transition-colors ${
        statusFilter === "COMPLETED" 
          ? 'bg-blue-600 text-white' 
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      }`}
      onClick={() => setStatusFilter("COMPLETED")}
    >
      Completed
    </button>
          </div>
          
          {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter ? `No ${statusFilter} bookings found` : "No bookings found"}
          </h3>
          <p className="text-gray-500">
            {statusFilter 
              ? `You don't have any ${statusFilter.toLowerCase()} reservations.` 
              : "You haven't made any parking reservations yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking,index) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Header with status */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Booking #{index+1}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">{booking.status}</span>
                  </span>
                </div>

                {/* Parking lot info */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {lotDetails[booking.parkingLotId]?.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {lotDetails[booking.parkingLotId]?.address}
                  </p>
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
                    <p className="text-sm text-gray-900 font-medium">
                      {booking.ownerName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Mobile
                    </label>
                    <p className="text-sm text-gray-900">{booking.mobileNo}</p>
                  </div>
                </div>

                {/* Car details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Car Number
                    </label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                      {booking.vehicalNo}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Vehical Type
                    </label>
                    <p className="text-sm text-gray-900">
                      {booking.vehicalType}
                    </p>
                  </div>
                </div>

                {/* Time slot and date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Time Slot
                    </label>
                    <p className="text-sm text-gray-900 font-medium">
                      {booking.timingSlot}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Booking Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(String(booking.createdAt)).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                {(booking.status === "CONFIRMED" || booking.status === "PENDING") && (
                  <button className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors my-2"
                  onClick={()=>{changeStatus(booking.id,"CANCELLED")}}
                  >
                    Cancel
                  </button>
                )}
                {(booking.status === "CONFIRMED") && (
                  <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors my-2"
                  onClick={()=>{changeStatus(booking.id,"COMPLETED")}}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}
