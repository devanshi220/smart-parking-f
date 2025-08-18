import React, { useState } from "react";

export default function BookingForm({ lot, onClose }) {
  const [form, setForm] = useState({
    owner: "",
    mobile: "",
    VehicleNumber: "",
    VehicleModel: "",
    timeSlot: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(form).every((field) => field.trim() !== "")) {
      const newBooking = {
        id: Date.now(),
        owner: form.owner,
        mobile: form.mobile,
        VehicleNumber: form.VehicleNumber,
        VehicleModel: form.VehicleModel,
        timeSlot: form.timeSlot,
        lot,
        bookingDate: new Date().toISOString(),
        status: "Confirmed",
      };
      try {
        const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
        const updated = [newBooking, ...existing];
        localStorage.setItem("bookings", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save booking:", err);
      }
      console.log(newBooking);
      alert("Slot booked!");
      setForm({
        owner: "",
        mobile: "",
        VehicleNumber: "",
        VehicleModel: "",
        timeSlot: "",
      });
      setSubmitted(false);
      if (onClose) onClose();
    }
  };

  return (
    <div className="flex flex-col w-full p-8 max-w-lg rounded-lg bg-gray-200">
      <div className="mb-8 text-center">
        <h1 className="my-3 text-3xl font-bold text-gray-800">Book Slot</h1>
        <p className="text-sm text-gray-600">Reserve a parking space at {lot?.name}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Owner's Full Name</label>
            <input
              type="text"
              name="owner"
              value={form.owner}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${submitted && !form.owner ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              pattern="[0-9]{10,15}"
              value={form.mobile}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${submitted && !form.mobile ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
              placeholder="Enter your mobile number"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Vehicle Number</label>
            <input
              type="text"
              name="VehicleNumber"
              value={form.VehicleNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${submitted && !form.VehicleNumber ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
              placeholder="Enter your Vehicle number"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Vehicle Model</label>
            <input
              type="text"
              name="VehicleModel"
              value={form.VehicleModel}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${submitted && !form.VehicleModel ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
              placeholder="Enter your Vehicle model"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Time Slot</label>
            <select
              name="timeSlot"
              value={form.timeSlot}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${submitted && !form.timeSlot ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
            >
              <option value="" disabled>Select a time slot</option>
              <option value="9AM-11AM">9AM - 11AM</option>
              <option value="11AM-1PM">11AM - 1PM</option>
              <option value="1PM-3PM">1PM - 3PM</option>
              <option value="3PM-5PM">3PM - 5PM</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
          <button 
            type="submit" 
            className="w-full sm:w-auto px-8 py-3 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Book Slot
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Choose Another
          </button>
        </div>
      </form>
    </div>
  );
}