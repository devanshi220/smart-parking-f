import React, { useState } from "react";
import axios from 'axios';

export default function BookingForm({ lot, onClose,updateKey }) {
  const [form, setForm] = useState({
    owner: "",
    mobile: "",
    VehicleNumber: "",
    VehicleType: "",
    timeSlot: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Check if all fields are filled
    if (!form.owner || !form.mobile || !form.VehicleNumber || !form.VehicleType || !form.timeSlot) {
      return;
    }


    // Create the booking data
    const bookingData = {
      parkingLotId: lot.id,
      ownerName: form.owner,
      mobileNo: form.mobile,
      vehicalNo: form.VehicleNumber,
      vehicalType: form.VehicleType,
      timingSlot: form.timeSlot
    };

    const authToken = localStorage.getItem('authToken');

    axios.post('http://localhost:8080/api/bookings', bookingData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(()=> {
      alert("Booking Successfull");
      updateKey((prev)=>prev+1);
      onClose();
    })
    .catch(error => {
      console.error('Error:', error);
      setSubmitted(false);
    });
  };

  return (
    <div className="flex flex-col w-full max-w-lg bg-white rounded-sm shadow-lg p-6 
                    max-h-[90vh] overflow-y-auto mt-20">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-blue-800">Book Slot</h1>
        <p className="text-sm text-gray-600">
          Reserve a parking space at {lot?.name}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          {/* Owner */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Owner&apos;s Full Name
            </label>
            <input
              type="text"
              name="owner"
              value={form.owner}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-colors ${
                  submitted && !form.owner
                    ? "border-red-500 ring-red-500"
                    : "border-gray-300"
                }`}
              placeholder="Enter your full name"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              pattern="[0-9]{10,15}"
              value={form.mobile}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-colors ${
                  submitted && !form.mobile
                    ? "border-red-500 ring-red-500"
                    : "border-gray-300"
                }`}
              placeholder="Enter your mobile number"
            />
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Vehicle Number
            </label>
            <input
              type="text"
              name="VehicleNumber"
              value={form.VehicleNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-colors ${
                  submitted && !form.VehicleNumber
                    ? "border-red-500 ring-red-500"
                    : "border-gray-300"
                }`}
              placeholder="Enter your Vehicle number"
            />
          </div>

          {/* Vehicle Model */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Vehicle Type
            </label>
            <input
              type="text"
              name="VehicleType"
              value={form.VehicleType}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-colors ${
                  submitted && !form.VehicleType
                    ? "border-red-500 ring-red-500"
                    : "border-gray-300"
                }`}
              placeholder="Enter your Vehicle Type(car/bike)"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Time Slot
            </label>
            <select
              name="timeSlot"
              value={form.timeSlot}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-colors ${
                  submitted && !form.timeSlot
                    ? "border-red-500 ring-red-500"
                    : "border-gray-300"
                }`}
            >
              <option value="" disabled>
                Select a time slot
              </option>
              <option value="9AM-11AM">9AM - 11AM</option>
              <option value="11AM-1PM">11AM - 1PM</option>
              <option value="1PM-3PM">1PM - 3PM</option>
              <option value="3PM-5PM">3PM - 5PM</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 font-semibold rounded-lg 
              bg-blue-600 text-white hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              transition-colors"
          >
            Book Slot
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 font-semibold rounded-lg 
              border border-gray-300 text-gray-700 hover:bg-gray-100 
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 
              transition-colors"
          >
            Choose Another
          </button>
        </div>
      </form>
    </div>
  );
}
