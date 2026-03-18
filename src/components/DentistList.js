import React, { useState, useEffect } from 'react';
import BookAppointment from './BookAppointment';

const BASE_URL = 'https://dentcare-backend-2hfu.onrender.com';

function DentistList() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDentists();
  }, []);

  const fetchDentists = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${BASE_URL}/dentist/getDentist`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDentists(data);
    } catch (err) {
      setError('Could not load dentists. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const seedDentists = async () => {
    const sampleDentists = [
      { name: "Dr. Priya Sharma", qualification: "BDS, MDS", experience: 8, clinicName: "Smile Care Dental", address: "12 MG Road, Bangalore", location: "Bangalore", specialization: "Orthodontist", photo: "" },
      { name: "Dr. Rajan Mehta", qualification: "BDS, MDS", experience: 12, clinicName: "Bright Teeth Clinic", address: "45 Linking Road, Mumbai", location: "Mumbai", specialization: "Periodontist", photo: "" },
      { name: "Dr. Anita Patel", qualification: "BDS", experience: 5, clinicName: "Perfect Smile", address: "78 CG Road, Ahmedabad", location: "Ahmedabad", specialization: "General Dentistry", photo: "" },
      { name: "Dr. Suresh Kumar", qualification: "BDS, MDS, PhD", experience: 15, clinicName: "Advanced Dental Care", address: "23 Anna Salai, Chennai", location: "Chennai", specialization: "Oral Surgeon", photo: "" },
      { name: "Dr. Neha Gupta", qualification: "BDS, MDS", experience: 7, clinicName: "Dent Pro Clinic", address: "56 Sector 18, Noida", location: "Noida", specialization: "Cosmetic Dentist", photo: "" },
    ];

    try {
      for (const d of sampleDentists) {
        await fetch(`${BASE_URL}/dentist/addDentist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(d),
        });
      }
      fetchDentists();
    } catch {
      alert('Seeding failed. Check backend.');
    }
  };

  
  const filtered = dentists.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.location.toLowerCase().includes(search.toLowerCase()) ||
    (d.specialization || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Find Your Perfect Dentist</h1>
        <p className="text-gray-500 text-lg">Book appointments with top dental professionals near you</p>
      </div>


      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, location or specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

    
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-500">Loading dentists...</span>
        </div>
      )}

     
      {error && (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchDentists}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 mr-3"
          >
            Retry
          </button>
        </div>
      )}

    
      {!loading && !error && dentists.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🦷</div>
          <p className="text-gray-400 text-lg mb-5">No dentists found. Load sample data to get started.</p>
          <button
            onClick={seedDentists}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium"
          >
            Load Sample Dentists
          </button>
        </div>
      )}

      {/* Dentist Cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(dentist => (
            <DentistCard
              key={dentist._id}  
              dentist={dentist}
              onBook={() => setSelectedDentist(dentist)}  
            />
          ))}
        </div>
      )}

      {!loading && dentists.length > 0 && filtered.length === 0 && (
        <p className="text-center text-gray-400 py-10">No dentists match your search.</p>
      )}

      {/* Booking Modal — receives dentist with _id */}
      {selectedDentist && (
        <BookAppointment
          dentist={selectedDentist}
          onClose={() => setSelectedDentist(null)}
        />
      )}
    </div>
  );
}

function DentistCard({ dentist, onBook }) {
  const photoUrl = dentist.photo
    ? `${BASE_URL}/uploads/${dentist.photo}`   
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(dentist.name)}&background=dbeafe&color=1d4ed8&size=80`;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-24 flex items-center justify-center relative">
        <img
          src={photoUrl}
          alt={dentist.name}
          className="w-20 h-20 rounded-full border-4 border-white object-cover absolute -bottom-10"
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dentist.name)}&background=dbeafe&color=1d4ed8`;
          }}
        />
      </div>
      <div className="pt-12 px-5 pb-5">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{dentist.name}</h2>
          <p className="text-blue-600 font-medium text-sm">{dentist.specialization}</p>
          <p className="text-gray-500 text-sm">{dentist.qualification}</p>
        </div>
        <div className="space-y-2 text-sm text-gray-600 mb-5">
          <div className="flex items-center gap-2">Star <span><strong>{dentist.experience}</strong> years experience</span></div>
          <div className="flex items-center gap-2">+ <span>{dentist.clinicName}</span></div>
          <div className="flex items-center gap-2">location <span>{dentist.address}</span></div>
          <div className="flex items-center gap-2">map <span>{dentist.location}</span></div>
        </div>
        <button
          onClick={onBook}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition duration-200 active:scale-95"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default DentistList;