import React, { useState } from 'react';

const BASE_URL = 'https://dentcare-backend-2hfu.onrender.com';

function BookAppointment({ dentist, onClose }) {
  const [form, setForm] = useState({ patientName: '', age: '', gender: '', appointmentDate: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = 'Name is required';
    if (!form.age || form.age < 1 || form.age > 120) e.age = 'Enter a valid age';
    if (!form.gender) e.gender = 'Select a gender';
    if (!form.appointmentDate) e.appointmentDate = 'Select a date';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      setLoading(true);
      setApiError('');

      const payload = {
        patientName: form.patientName,
        age: Number(form.age),
        gender: form.gender,
        appointmentDate: form.appointmentDate,
        dentistId: dentist._id,          
        dentistName: dentist.name,
        clinicName: dentist.clinicName,
      };

      const res = await fetch(`${BASE_URL}/api/appointments/createappointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Booking failed');
      }

      setSuccess(true);
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">

    
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl p-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-xl font-bold"
          >✕</button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl font-bold">
              {dentist.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm opacity-75">Booking appointment with</p>
              <h3 className="font-bold text-lg">{dentist.name}</h3>
              <p className="text-sm opacity-75">{dentist.clinicName}</p>
            </div>
          </div>
        </div>

   
        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Booked Successfully!</h3>
              <p className="text-gray-500 mb-1">Your appointment with</p>
              <p className="font-semibold text-gray-700 mb-1">{dentist.name}</p>
              <p className="text-gray-500 mb-6">has been confirmed.</p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-xl hover:bg-blue-700 font-medium"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Patient Details</h3>

              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                  {apiError}
                </div>
              )}


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={e => { setForm({ ...form, patientName: e.target.value }); setErrors({ ...errors, patientName: '' }); }}
                  placeholder="Enter full name"
                  className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.patientName ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
              </div>

       
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={e => { setForm({ ...form, age: e.target.value }); setErrors({ ...errors, age: '' }); }}
                    placeholder="Age"
                    min="1" max="120"
                    className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.age ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.gender}
                    onChange={e => { setForm({ ...form, gender: e.target.value }); setErrors({ ...errors, gender: '' }); }}
                    className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.gender ? 'border-red-400' : 'border-gray-300'}`}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
              </div>

           
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.appointmentDate}
                  onChange={e => { setForm({ ...form, appointmentDate: e.target.value }); setErrors({ ...errors, appointmentDate: '' }); }}
                  min={today}
                  className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.appointmentDate ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;