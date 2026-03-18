import React, { useState, useEffect } from 'react';

const BASE_URL = 'https://dentcare-backend-2hfu.onrender.com';

const STATUS_COLORS = {
  Booked: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

function AdminPanel() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/appointments/allappointments`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setAppointments(data);
      setError('');
    } catch {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };


  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${BASE_URL}/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      fetchAppointments();
    } catch {
      alert('Failed to update status.');
    }
  };

  const filtered = filter === 'All' ? appointments : appointments.filter(a => a.status === filter);

  const counts = {
    All: appointments.length,
    Booked: appointments.filter(a => a.status === 'Booked').length,
    Completed: appointments.filter(a => a.status === 'Completed').length,
    Cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">


      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Manage all appointments</p>
      </div>

 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {['All', 'Booked', 'Completed', 'Cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-xl p-4 text-left border transition ${
              filter === s ? 'border-blue-500 bg-blue-50' : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <p className={`text-2xl font-bold ${
              s === 'Booked' ? 'text-blue-600'
              : s === 'Completed' ? 'text-green-600'
              : s === 'Cancelled' ? 'text-red-600'
              : 'text-gray-800'
            }`}>{counts[s]}</p>
            <p className="text-sm text-gray-500 mt-1">{s}</p>
          </button>
        ))}
      </div>

  
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchAppointments}
          className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && <div className="text-center text-red-500 py-10">{error}</div>}

      {!loading && filtered.length === 0 && !error && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">📋</div>
          <p>No {filter !== 'All' ? filter.toLowerCase() : ''} appointments yet.</p>
        </div>
      )}

   
      {!loading && filtered.length > 0 && (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['#', 'Patient', 'Age', 'Gender', 'Date', 'Dentist', 'Clinic', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((apt, i) => (
                  <tr key={apt._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-400 text-sm">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{apt.patientName}</td>
                    <td className="px-4 py-3 text-gray-600">{apt.age}</td>
                    <td className="px-4 py-3 text-gray-600">{apt.gender}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(apt.appointmentDate).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{apt.dentistName}</td>
                    <td className="px-4 py-3 text-gray-600">{apt.clinicName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[apt.status]}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                   
                      <select
                        value={apt.status}
                        onChange={e => updateStatus(apt._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none"
                      >
                        <option value="Booked">Booked</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        
          <div className="md:hidden space-y-4">
            {filtered.map(apt => (
              <div key={apt._id} className="bg-white rounded-xl shadow p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{apt.patientName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[apt.status]}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p>Age: {apt.age} · {apt.gender}</p>
                  <p>{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                  <p>{apt.dentistName}</p>
                  <p>{apt.clinicName}</p>
                </div>
                <select
                  value={apt.status}
                  onChange={e => updateStatus(apt._id, e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Booked">Booked</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;