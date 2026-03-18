import React from 'react';

function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">Dentist</span>
          <span className="text-xl font-bold text-blue-600">DentCare</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActivePage('home')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activePage === 'home'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Find Dentists
          </button>
          <button
            onClick={() => setActivePage('admin')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activePage === 'admin'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Admin Panel
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;