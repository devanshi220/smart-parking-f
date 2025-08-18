import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {
  const navigate = useNavigate()
  const [showBookings, setShowBookings] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showAddSlot, setShowAddSlot] = useState(false)
  const [slotForm, setSlotForm] = useState({ name: '', location: '', capacity: '' })
  const [showEditSlot, setShowEditSlot] = useState(false)
  const [slotToEdit, setSlotToEdit] = useState(null)
  const [editCapacity, setEditCapacity] = useState('')
  const [slots, setSlots] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('parkingSlots') || '[]')
    } catch {
      return []
    }
  })

  // Seed sample data for slots and bookings on first load if empty
  useEffect(() => {
    try {
      const storedSlots = JSON.parse(localStorage.getItem('parkingSlots') || '[]')
      const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]')

      if (!storedSlots || storedSlots.length === 0) {
        const seededSlots = [
          { id: Date.now() - 30000, name: 'Central City Lot', location: 'Downtown, Main St.', capacity: 120, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
          { id: Date.now() - 20000, name: 'Mall Parking', location: 'City Mall, 2nd Ave.', capacity: 80, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
          { id: Date.now() - 10000, name: 'Tech Park Lot', location: 'Tech Park, Silicon Blvd.', capacity: 150, createdAt: new Date(Date.now() - 86400000).toISOString() },
        ]
        localStorage.setItem('parkingSlots', JSON.stringify(seededSlots))
        setSlots(seededSlots)
      }

      if (!storedBookings || storedBookings.length === 0) {
        const now = Date.now()
        const seededBookings = [
          {
            id: now - 5000,
            owner: 'John Smith',
            mobile: '9876543210',
            VehicleNumber: 'MH-12-AB-1234',
            VehicleModel: 'Honda City',
            timeSlot: '9AM-11AM',
            lot: { name: 'Central City Lot', location: 'Downtown, Main St.' },
            bookingDate: new Date(now - 86400000 * 2).toISOString(),
            status: 'Confirmed',
          },
          {
            id: now - 4000,
            owner: 'Sarah Johnson',
            mobile: '8765432109',
            VehicleNumber: 'DL-01-CD-5678',
            VehicleModel: 'Maruti Swift',
            timeSlot: '11AM-1PM',
            lot: { name: 'Mall Parking', location: 'City Mall, 2nd Ave.' },
            bookingDate: new Date(now - 86400000 * 1.5).toISOString(),
            status: 'Confirmed',
          },
          {
            id: now - 3000,
            owner: 'Michael Brown',
            mobile: '7654321098',
            VehicleNumber: 'KA-05-EF-9012',
            VehicleModel: 'Hyundai i20',
            timeSlot: '1PM-3PM',
            lot: { name: 'Tech Park Lot', location: 'Tech Park, Silicon Blvd.' },
            bookingDate: new Date(now - 86400000).toISOString(),
            status: 'Pending',
          },
          {
            id: now - 2000,
            owner: 'Emily Davis',
            mobile: '6543210987',
            VehicleNumber: 'TN-07-GH-3456',
            VehicleModel: 'Tata Nexon',
            timeSlot: '3PM-5PM',
            lot: { name: 'Central City Lot', location: 'Downtown, Main St.' },
            bookingDate: new Date(now - 43200000).toISOString(),
            status: 'Confirmed',
          },
          {
            id: now - 1000,
            owner: 'Aisha Khan',
            mobile: '9123456780',
            VehicleNumber: 'GJ-01-XY-7890',
            VehicleModel: 'Suzuki Baleno',
            timeSlot: '11AM-1PM',
            lot: { name: 'Mall Parking', location: 'City Mall, 2nd Ave.' },
            bookingDate: new Date(now - 21600000).toISOString(),
            status: 'Confirmed',
          },
        ]
        localStorage.setItem('bookings', JSON.stringify(seededBookings))
      }
    } catch (e) {
      // ignore
    }
  }, [])
  let adminUser = null
  try {
    adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null')
  } catch {
    adminUser = null
  }

  function handleLogout() {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminUser')
    navigate('/', { replace: true })
  }

  const allBookings = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('bookings') || '[]')
    } catch {
      return []
    }
  }, [showBookings, selectedSlot])

  const slotBookings = useMemo(() => {
    if (!selectedSlot) return []
    return allBookings.filter(b => b?.lot?.name === selectedSlot.name && b?.lot?.location === selectedSlot.location)
  }, [allBookings, selectedSlot])

  function openSlotBookings(slot) {
    setSelectedSlot(slot)
    setSelectedBooking(null)
    setShowBookings(true)
  }

  function closeModal() {
    setShowBookings(false)
    setSelectedBooking(null)
    setSelectedSlot(null)
  }

  function viewBooking(booking) {
    setSelectedBooking(booking)
  }

  function openAddSlotModal() {
    setSlotForm({ name: '', location: '', capacity: '' })
    setShowAddSlot(true)
  }

  function closeAddSlotModal() {
    setShowAddSlot(false)
  }

  function handleSlotFormChange(e) {
    const { name, value } = e.target
    setSlotForm(prev => ({ ...prev, [name]: value }))
  }

  function saveSlots(next) {
    localStorage.setItem('parkingSlots', JSON.stringify(next))
    setSlots(next)
  }

  function addSlot(e) {
    e?.preventDefault?.()
    if (!slotForm.name.trim() || !slotForm.location.trim()) return
    const newSlot = {
      id: Date.now(),
      name: slotForm.name.trim(),
      location: slotForm.location.trim(),
      capacity: Number(slotForm.capacity) > 0 ? Number(slotForm.capacity) : null,
      createdAt: new Date().toISOString(),
    }
    const next = [newSlot, ...slots]
    saveSlots(next)
    setShowAddSlot(false)
  }

  function deleteSlot(id) {
    const next = slots.filter(s => s.id !== id)
    saveSlots(next)
  }

  function openEditSlot(e, slot) {
    e?.stopPropagation?.()
    setSlotToEdit(slot)
    setEditCapacity(slot.capacity ?? '')
    setShowEditSlot(true)
  }

  function closeEditSlotModal() {
    setShowEditSlot(false)
    setSlotToEdit(null)
    setEditCapacity('')
  }

  function saveEditedSlot(e) {
    e?.preventDefault?.()
    if (!slotToEdit) return
    const capacityValue = String(editCapacity).trim() === '' ? null : Math.max(0, Number(editCapacity))
    const next = slots.map(s => s.id === slotToEdit.id ? { ...s, capacity: capacityValue } : s)
    saveSlots(next)
    closeEditSlotModal()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Welcome, {adminUser?.name || 'Admin'} ({adminUser?.email})</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Admin Info</h2>
          <ul className="text-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <li><span className="font-medium">Name:</span> {adminUser?.name || 'System Admin'}</li>
            <li><span className="font-medium">Email:</span> {adminUser?.email || '-'}</li>
            <li><span className="font-medium">Role:</span> {adminUser?.role || 'admin'}</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Parking Slots</h2>
            <button onClick={openAddSlotModal} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Parking Slot</button>
          </div>
          {slots.length === 0 ? (
            <div className="text-gray-600 text-sm">No parking slots added yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Capacity</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map(slot => (
                    <tr key={slot.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => openSlotBookings(slot)}>
                      <td className="px-4 py-3 font-medium">{slot.name}</td>
                      <td className="px-4 py-3">{slot.location}</td>
                      <td className="px-4 py-3">{slot.capacity ?? '-'}</td>
                      <td className="px-4 py-3">{new Date(slot.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button onClick={(e) => openEditSlot(e, slot)} className="px-3 py-1 bg-gray-200 text-gray-900 rounded hover:bg-gray-300">Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); deleteSlot(slot.id) }} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showBookings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
            <div className="relative bg-white rounded-xl shadow-2xl w-[95vw] max-w-5xl max-h-[85vh] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">
                  Bookings for: {selectedSlot?.name} ({selectedSlot?.location}) — {slotBookings.length}
                </h3>
                <button onClick={closeModal} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Close</button>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="text-left text-gray-600">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Owner</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Vehicle</th>
                      <th className="px-4 py-3">Model</th>
                      <th className="px-4 py-3">Lot</th>
                      <th className="px-4 py-3">Time Slot</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slotBookings.map(b => (
                      <tr key={b.id} className="border-t">
                        <td className="px-4 py-3 font-medium">{b.id}</td>
                        <td className="px-4 py-3">{b.owner}</td>
                        <td className="px-4 py-3">{b.mobile}</td>
                        <td className="px-4 py-3 font-mono">{b.VehicleNumber}</td>
                        <td className="px-4 py-3">{b.VehicleModel}</td>
                        <td className="px-4 py-3">
                          <div className="text-gray-900">{b.lot?.name}</div>
                          <div className="text-gray-500 text-xs">{b.lot?.location}</div>
                        </td>
                        <td className="px-4 py-3">{b.timeSlot}</td>
                        <td className="px-4 py-3">{new Date(b.bookingDate).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded border text-xs ${b.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>{b.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => viewBooking(b)} className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded">View</button>
                        </td>
                      </tr>
                    ))}
                    {slotBookings.length === 0 && (
                      <tr>
                        <td colSpan="10" className="px-4 py-10 text-center text-gray-500">No bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {selectedBooking && (
                <div className="border-t p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Booking Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div><span className="font-medium">Owner:</span> {selectedBooking.owner}</div>
                      <div><span className="font-medium">Mobile:</span> {selectedBooking.mobile}</div>
                      <div><span className="font-medium">Vehicle:</span> {selectedBooking.VehicleNumber} ({selectedBooking.VehicleModel})</div>
                    </div>
                    <div>
                      <div><span className="font-medium">Lot:</span> {selectedBooking.lot?.name}</div>
                      <div><span className="font-medium">Location:</span> {selectedBooking.lot?.location}</div>
                      <div><span className="font-medium">Time:</span> {selectedBooking.timeSlot}</div>
                      <div><span className="font-medium">Date:</span> {new Date(selectedBooking.bookingDate).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showAddSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeAddSlotModal} />
            <div className="relative bg-white rounded-xl shadow-2xl w-[95vw] max-w-md overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Add Parking Slot</h3>
                <button onClick={closeAddSlotModal} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Close</button>
              </div>
              <form onSubmit={addSlot} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input name="name" value={slotForm.name} onChange={handleSlotFormChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Central City Lot" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input name="location" value={slotForm.location} onChange={handleSlotFormChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Downtown, Main St." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (optional)</label>
                  <input type="number" min="0" name="capacity" value={slotForm.capacity} onChange={handleSlotFormChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 120" />
                </div>
                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={closeAddSlotModal} className="px-4 py-2 rounded-md border">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Add Slot</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeEditSlotModal} />
            <div className="relative bg-white rounded-xl shadow-2xl w-[95vw] max-w-md overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Edit Slot Capacity</h3>
                <button onClick={closeEditSlotModal} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Close</button>
              </div>
              <form onSubmit={saveEditedSlot} className="p-6 space-y-4">
                <div className="text-sm text-gray-600">
                  <div><span className="font-medium text-gray-800">Name:</span> {slotToEdit?.name}</div>
                  <div><span className="font-medium text-gray-800">Location:</span> {slotToEdit?.location}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input type="number" min="0" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter capacity or leave blank to unset" />
                </div>
                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={closeEditSlotModal} className="px-4 py-2 rounded-md border">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


