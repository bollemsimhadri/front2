import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DentistList from './components/DentistList';
import AdminPanel from './components/AdminPanel';

function App() {
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      {activePage === 'home' && <DentistList />}
      {activePage === 'admin' && <AdminPanel />}
    </div>
  );
}

export default App;