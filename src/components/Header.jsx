import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [isAdmin,setIsAdmin] = useState(false);
  const navLinks = isVerified?isAdmin?[
  { name: "Home", href: "/" },
  { name: "Admin", href: "/admin" },
  ]:[
  { name: "Home", href: "/" },
  { name: "Book Slot", href: "/book-slot" },
  { name: "My Bookings", href: "/my-bookings" },
]:[
  { name: "Home", href: "/" },
  { name: "Login", href: "/login" },
  { name: "Admin", href: "/admin" },
];

const handleLogout = () =>{
  localStorage.removeItem("authToken");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("isAdmin");
  setIsVerified(false);
  navigate("/login");
}

  useEffect(()=>{
    const authToken = localStorage.getItem("authToken");
    const adminToken = localStorage.getItem("adminToken");
    const isAdmin = localStorage.getItem("isAdmin")==="true";
    if((authToken && authToken.length > 0) ||
       (adminToken && adminToken.length > 0)) {
      setIsVerified(true);
    }
    if(isAdmin) {
      setIsAdmin(true);
    }
  },[navigate])
  return (
    <header className="bg-white shadow-md w-full sticky top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center text-xl font-bold text-blue-600">
          <Link to="/">SmartParking</Link>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
         {isVerified && <button className="text-gray-200 transition-colors duration-200 bg-red-500 font-medium px-3 py-2 rounded-md hover:bg-red-600" onClick={handleLogout}>LogOut</button>}
        </nav>
        {/* Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-blue-50"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
} 