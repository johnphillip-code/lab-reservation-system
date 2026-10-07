// src/App.tsx

import React, { useState, useEffect } from 'react';
import { LocalStorageReservationRepository } from './data/repositories/LocalStorageReservationRepository';
import { Reservation } from './domain/entities/Reservation';
import { Dashboard } from './presentation/components/Dashboard';
import { ScheduleView } from './presentation/components/ScheduleView';
import { ReservationForm } from './presentation/components/ReservationForm';

// Initialize the repository outside the component so it persists across re-renders
const repository = new LocalStorageReservationRepository();

export default function App() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Function to pull the latest data from our LocalStorage repository
  const loadData = () => {
    const latestData = repository.getAll();
    setReservations(latestData);
  };

  // Initial load when the application first starts
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      color: '#333'
    }}>
      <header style={{ 
        padding: '20px 0', 
        marginBottom: '20px', 
        borderBottom: '3px solid #0056b3' 
      }}>
        <h1 style={{ margin: 0, color: '#0056b3' }}>DNSC Lab Reservation System</h1>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>IT415 - Frontend Application</p>
      </header>
      
      {/* Top Section: Dashboard */}
      <section style={{ marginBottom: '30px' }}>
        <Dashboard reservations={reservations} />
      </section>
      
      {/* Bottom Section: Form and Schedule side-by-side */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '30px' 
      }}>
        {/* Left Column: Form */}
        <section style={{ 
          flex: '1 1 350px', 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <ReservationForm repository={repository} onSuccess={loadData} />
        </section>

        {/* Right Column: Schedule */}
        <section style={{ 
          flex: '2 1 600px', 
          background: '#ffffff', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <ScheduleView reservations={reservations} />
        </section>
      </div>
    </div>
  );
}