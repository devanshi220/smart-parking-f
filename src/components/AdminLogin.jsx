import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  function validate() {
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email and password are required')
      return false
    }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)

    try {
      const {data} = await axios.post('http://localhost:8080/auth/admin/login', {
        email: formData.email,
        password: formData.password
      });

      // If successful, save token and admin data
      if (data.role && data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdmin', 'true');
        
        // Redirect to admin dashboard
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        // Check if the error response contains a string message
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        setError('Network error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c.5304 0 1.0391-.2107 1.4142-.5858C13.7893 10.0391 14 9.5304 14 9s-.2107-1.0391-.5858-1.4142C13.0391 7.2107 12.5304 7 12 7s-1.0391.2107-1.4142.5858C10.2107 7.9609 10 8.4696 10 9s.2107 1.0391.5858 1.4142C10.9609 10.7893 11.4696 11 12 11zm0 2c-1.0609 0-2.0783.4214-2.8284 1.1716C8.4214 14.9217 8 15.9391 8 17h8c0-1.0609-.4214-2.0783-1.1716-2.8284C14.0783 13.4214 13.0609 13 12 13z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">Press Ctrl + A anywhere to open this page</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors border-gray-300"
                placeholder="admin@smartparking.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors border-gray-300"
                placeholder="Enter admin password"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign in as Admin'}
            </button>
            <div className="text-center text-sm text-gray-600">
              <Link to="/login" className="text-blue-600 hover:text-blue-500">Go to user login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


