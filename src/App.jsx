import React, { useEffect } from 'react'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import HomePage from './HomePage'
import ParkingLotSelection from './components/ParkingLotSelection'
import MyBookings from './components/MyBookings'
import Login from './components/Login'
import Register from './components/Register'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'

function isAdminAuthenticated() {
  try {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminToken = localStorage.getItem('adminToken');
    return Boolean(isAdmin && adminToken)
  } catch {
    return false
  }
}

function RequireAdmin({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin-login" replace />
  }
  return children
}

function GlobalShortcuts() {
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(e) {
      const active = document.activeElement
      const tag = active?.tagName?.toLowerCase()
      const isTyping = tag === 'input' || tag === 'textarea' || active?.isContentEditable
      if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
        if (!isTyping) {
          e.preventDefault()
          navigate('/admin-login')
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  return null
}

export default function App() {
  return (
    <Router>
      <Header />
      <GlobalShortcuts />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book-slot" element={<ParkingLotSelection />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          }
        />
      </Routes>
    </Router>
  )
}

