import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// A simple reusable modal component for confirmations, alerts, and forms.
const Modal = ({ title, children, onClose, isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className={`relative bg-white rounded-xl shadow-2xl ${String(title).startsWith("Bookings")?"min-w-full":"w-full"} max-w-lg max-h-[90vh] overflow-y-auto`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Main AdminPanel component
export default function AdminPanel() {
  const navigate = useNavigate();
  
  // State for different UI views and data
  const [showBookings, setShowBookings] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showUpdateSlot, setShowUpdateSlot] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [parkingSlots, setParkingSlots] = useState([]);
  const [slotBookings, setSlotBookings] = useState([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState(null);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form states
  const [slotForm, setSlotForm] = useState({ name: '', address: '', totalSlots: '', isOpen: true });
  const [slotFormErrors, setSlotFormErrors] = useState({});
  const [updateSlotForm, setUpdateSlotForm] = useState({ id: '', name: '', totalSlots: '', isOpen: true });
  const [updateSlotFormErrors, setUpdateSlotFormErrors] = useState({});

  // Use a key to force a re-fetch of data
  const [fetchKey, setFetchKey] = useState(0);

  // Function to show a custom message modal
  const showModalMessage = (title, message) => {
    setModalMessage({ title, message, type: 'info' });
  };
  
  // Function to show a custom confirmation modal
  const showConfirm = (title, message, onConfirm) => {
    setModalMessage({ title, message, type: 'confirm' });
    setConfirmAction(() => onConfirm);
  };
  
  // Function to close all modals
  const closeModal = () => {
    setShowBookings(false);
    setShowAddSlot(false);
    setShowUpdateSlot(false);
    setModalMessage(null);
    setConfirmAction(null);
    setSelectedSlot(null);
    setSlotBookings([]);
  };

  // Effect hook to fetch admin data and parking slots on component mount or `fetchKey` change
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!adminToken || !isAdmin) {
      navigate('/admin-login', { replace: true });
      return;
    }

    // Fetch admin details
    const fetchAdminDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('http://localhost:8080/auth/admin', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setAdminData({ ...data, name: `${data.firstName} ${data.lastName}` });
      } catch (err) {
        console.error('Failed to fetch admin details:', err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          navigate('/admin-login', { replace: true });
        } else {
          setError('Could not load admin details. Please try refreshing.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Fetch all parking slots
    const fetchParkingSlots = async () => {
      setSlotsLoading(true);
      setSlotsError(null);
      try {
        const { data } = await axios.get('http://localhost:8080/api/parking-lots', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setParkingSlots(data);
      } catch (err) {
        console.error('Failed to fetch parking slots:', err);
        setSlotsError('Could not load parking slots. Please try refreshing.');
      } finally {
        setSlotsLoading(false);
      }
    };
    
    fetchAdminDetails();
    fetchParkingSlots();
  }, [navigate, fetchKey]);

  // --- Functions for Parking Slots ---

  function openAddSlotModal() {
    setSlotForm({ name: '', address: '', totalSlots: '', isOpen: true });
    setSlotFormErrors({});
    setShowAddSlot(true);
  }

  function handleSlotFormChange(e) {
    const { name, value } = e.target;
    setSlotForm(prev => ({ ...prev, [name]: value }));
    if (slotFormErrors[name]) {
      setSlotFormErrors(prev => ({ ...prev, [name]: null }));
    }
  }
  
  async function handleAddSlotSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (!slotForm.name.trim()) errors.name = 'Name is required';
    if (!slotForm.address.trim()) errors.address = 'Address is required';
    if (!slotForm.totalSlots) errors.totalSlots = 'Total slots is required';
    else if (parseInt(slotForm.totalSlots) <= 0) errors.totalSlots = 'Total slots must be greater than 0';
    
    if (Object.keys(errors).length > 0) {
      setSlotFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setSlotFormErrors({});
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.post('http://localhost:8080/api/parking-lots', {
        ...slotForm,
        totalSlots: parseInt(slotForm.totalSlots),
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      showModalMessage('Success', 'Parking slot created successfully.');
      closeModal();
      setFetchKey(prev => prev + 1); // Trigger re-fetch
    } catch (err) {
      console.error('Failed to create parking slot:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create parking slot.';
      showModalMessage('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteSlot(e, slotId) {
    e.stopPropagation();
    
    showConfirm(
      'Confirm Deletion',
      'Are you sure you want to delete this parking slot? This action cannot be undone.',
      async () => {
        try {
          const adminToken = localStorage.getItem('adminToken');
          await axios.delete(`http://localhost:8080/api/parking-lots/${slotId}`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
          });
          showModalMessage('Success', 'Parking slot deleted successfully.');
          setFetchKey(prev => prev + 1); // Trigger re-fetch
        } catch (err) {
          console.error('Failed to delete parking slot:', err);
          const errorMessage = err.response?.data?.message || 'Failed to delete parking slot. Please try again.';
          showModalMessage('Error', errorMessage);
        } finally {
          setConfirmAction(null);
        }
      }
    );
  }

  function openUpdateSlotModal(e, slot) {
    e.stopPropagation();
    setUpdateSlotForm({ 
      id: slot.id,
      name: slot.name,
      totalSlots: slot.totalSlots,
      isOpen: slot.isOpen
    });
    setUpdateSlotFormErrors({});
    setShowUpdateSlot(true);
  }

  function handleUpdateSlotFormChange(e) {
    const { name, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setUpdateSlotForm(prev => ({ ...prev, [name]: newValue }));
    if (updateSlotFormErrors[name]) {
      setUpdateSlotFormErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  async function handleUpdateSlotSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (!updateSlotForm.totalSlots) errors.totalSlots = 'Total slots is required';
    else if (parseInt(updateSlotForm.totalSlots) <= 0) errors.totalSlots = 'Total slots must be greater than 0';
    
    if (Object.keys(errors).length > 0) {
      setUpdateSlotFormErrors(errors);
      return;
    }
    
    setIsUpdating(true);
    setUpdateSlotFormErrors({});
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.post(`http://localhost:8080/api/parking-lots/${updateSlotForm.id}/update`, {
        totalSlots: parseInt(updateSlotForm.totalSlots),
        isOpen: updateSlotForm.isOpen
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      showModalMessage('Success', 'Parking slot updated successfully.');
      setFetchKey(prev => prev + 1);
      closeModal();
    } catch (err) {
      console.error('Failed to update parking slot:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update parking slot. Please try again.';
      setUpdateSlotFormErrors({ general: errorMessage });
    } finally {
      setIsUpdating(false);
    }
  }

  // --- Functions for Bookings ---

  function openSlotBookings(slot) {
    setSelectedSlot(slot);
    setShowBookings(true);
    setSlotBookings([]);
    setBookingsLoading(true);
    setBookingsError(null);
    
    const fetchBookingsForSlot = async (slotId) => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const { data } = await axios.get(`http://localhost:8080/api/parking-lots/${slotId}/bookings`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setSlotBookings(data);
      } catch (err) {
        console.error('Failed to fetch bookings for slot:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load bookings. Please try again.';
        setBookingsError(errorMessage);
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchBookingsForSlot(slot.id);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header and Logout button */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Welcome, {adminData?.name || 'Admin'}</p>
          </div>
        </div>

        {/* Admin Info Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Admin Info</h2>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-2">{error}</div>
          ) : (
            <ul className="text-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <li><span className="font-medium">Name:</span> {adminData?.name || 'System Admin'}</li>
              <li><span className="font-medium">Email:</span> {adminData?.email || '-'}</li>
            </ul>
          )}
        </div>

        {/* Parking Slots Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Parking Slots</h2>
            <button onClick={openAddSlotModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">Add Parking Slot</button>
          </div>
          {slotsLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : slotsError ? (
            <div className="text-red-500 py-2">{slotsError}</div>
          ) : parkingSlots?.length === 0 ? (
            <div className="text-gray-600 text-sm">No parking slots added yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Total Slots</th>
                    <th className="px-4 py-3">Booked Slots</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parkingSlots.map(slot => (
                    <tr key={slot.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => openSlotBookings(slot)}>
                      <td className="px-4 py-3 font-medium">{slot.name}</td>
                      <td className="px-4 py-3 font-medium">{slot.isOpen ? "Open" : "Closed"}</td>
                      <td className="px-4 py-3">{slot.address}</td>
                      <td className="px-4 py-3">{slot.totalSlots ?? '-'}</td>
                      <td className="px-4 py-3">{slot.bookedSlots ?? '-'}</td>
                      <td className="px-4 py-3 space-x-2 flex justify-center">
                        <button onClick={(e) => handleDeleteSlot(e, slot.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                        <button onClick={(e) => openUpdateSlotModal(e, slot)} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {modalMessage && (
        <Modal
          title={modalMessage.title}
          isOpen={!!modalMessage}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <p className="text-gray-700">{modalMessage.message}</p>
            <div className="flex justify-end space-x-2">
              {modalMessage.type === 'confirm' && (
                <button 
                  onClick={() => {
                    if (confirmAction) {
                      confirmAction();
                    }
                    closeModal();
                  }} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm
                </button>
              )}
              <button onClick={closeModal} className="px-4 py-2 rounded-md border text-gray-700">
                {modalMessage.type === 'confirm' ? 'Cancel' : 'OK'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Bookings Modal */}
      <Modal 
        title={`Bookings for: ${selectedSlot?.name} (${selectedSlot?.address})`}
        isOpen={showBookings} 
        onClose={closeModal}
      >
        <div className="overflow-auto max-h-[60vh] -mx-6">
          {bookingsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : bookingsError ? (
            <div className="py-8 text-center">
              <div className="text-red-500 mb-2">{bookingsError}</div>
              <button onClick={() => openSlotBookings(selectedSlot)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Retry</button>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Vehicle No</th>
                  <th className="px-4 py-3">Vehicle Type</th>
                  <th className="px-4 py-3">Time Slot</th>
                  <th className="px-4 py-3">Booking Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {slotBookings.map(b => (
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{b.id}</td>
                    <td className="px-4 py-3">{b.ownerName}</td>
                    <td className="px-4 py-3">{b.mobileNo}</td>
                    <td className="px-4 py-3 font-mono">{b.vehicalNo}</td>
                    <td className="px-4 py-3">{b.vehicalType}</td>
                    <td className="px-4 py-3">{b.timingSlot}</td>
                    <td className="px-4 py-3">{new Date(b.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full border text-xs font-semibold ${b.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-900 border-gray-200'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {slotBookings?.length === 0 && !bookingsLoading && (
                  <tr>
                    <td colSpan="8" className="px-4 py-10 text-center text-gray-500">No bookings found for this slot.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Modal>

      {/* Add Slot Modal */}
      <Modal
        title="Add Parking Slot"
        isOpen={showAddSlot}
        onClose={closeModal}
      >
        <form className="space-y-4" onSubmit={handleAddSlotSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
            <input name="name" value={slotForm.name} onChange={handleSlotFormChange} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${slotFormErrors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., Central City Lot" />
            {slotFormErrors.name && <p className="text-red-500 text-xs mt-1">{slotFormErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
            <input name="address" value={slotForm.address} onChange={handleSlotFormChange} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${slotFormErrors.address ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., Downtown, Main St." />
            {slotFormErrors.address && <p className="text-red-500 text-xs mt-1">{slotFormErrors.address}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots*</label>
            <input type="number" min="1" name="totalSlots" value={slotForm.totalSlots} onChange={handleSlotFormChange} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${slotFormErrors.totalSlots ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 120" />
            {slotFormErrors.totalSlots && <p className="text-red-500 text-xs mt-1">{slotFormErrors.totalSlots}</p>}
          </div>
          <div className="flex items-center">
            <input 
              id="isOpen" type="checkbox" name="isOpen" checked={slotForm.isOpen} 
              onChange={(e) => setSlotForm(prev => ({...prev, isOpen: e.target.checked}))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isOpen" className="ml-2 block text-sm text-gray-900">Open for bookings</label>
          </div>
          {slotFormErrors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm">{slotFormErrors.general}</div>
          )}
          <div className="pt-2 flex justify-end space-x-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md border text-gray-700">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating...</span>
              ) : 'Add Slot'}
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Update Slot Modal */}
      <Modal
        title={`Update Slot: ${updateSlotForm.name}`}
        isOpen={showUpdateSlot}
        onClose={closeModal}
      >
        <form className="space-y-4" onSubmit={handleUpdateSlotSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots*</label>
            <input type="number" min="1" name="totalSlots" value={updateSlotForm.totalSlots} onChange={handleUpdateSlotFormChange} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${updateSlotFormErrors.totalSlots ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 150" />
            {updateSlotFormErrors.totalSlots && <p className="text-red-500 text-xs mt-1">{updateSlotFormErrors.totalSlots}</p>}
          </div>
          <div className="flex items-center">
            <input 
              id="updateIsOpen" type="checkbox" name="isOpen" checked={updateSlotForm.isOpen} 
              onChange={handleUpdateSlotFormChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="updateIsOpen" className="ml-2 block text-sm text-gray-900">Open for bookings</label>
          </div>
          {updateSlotFormErrors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm">{updateSlotFormErrors.general}</div>
          )}
          <div className="pt-2 flex justify-end space-x-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md border text-gray-700">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400" disabled={isUpdating}>
              {isUpdating ? (
                <span className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Updating...</span>
              ) : 'Update Slot'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
