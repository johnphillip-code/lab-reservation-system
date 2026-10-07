// src/App.tsx

import React, { useState, useEffect } from 'react';
import { LocalStorageReservationRepository } from './data/repositories/LocalStorageReservationRepository';
import { Reservation, ReservationStatus } from './domain/entities/Reservation';
import { Dashboard } from './presentation/components/Dashboard';
import { ScheduleView } from './presentation/components/ScheduleView';
import { ReservationForm } from './presentation/components/ReservationForm';
import { ReservationList } from './presentation/components/ReservationList';

const repository = new LocalStorageReservationRepository();

export default function App() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const loadData = () => {
    setReservations(repository.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (id: string, newStatus: ReservationStatus, reason?: string) => {
    const reservation = repository.getById(id);
    if (reservation) {
      // Apply strict status rules (Rule 6)
      if (reservation.status === 'Rejected' || reservation.status === 'Cancelled') {
        alert("A Rejected or Cancelled reservation cannot be changed again.");
        return;
      }
      
      reservation.status = newStatus;
      if (reason) {
        reservation.rejectionReason = reason;
      }
      repository.update(reservation);
      loadData(); // Refresh UI
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#333' }}>
      <header style={{ padding: '20px 0', marginBottom: '20px', borderBottom: '3px solid #0056b3' }}>
        <h1 style={{ margin: 0, color: '#0056b3' }}>DNSC Lab Reservation System</h1>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>IT415 - Frontend Application</p>
      </header>
      
      <section style={{ marginBottom: '30px' }}>
        <Dashboard reservations={reservations} />
      </section>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '30px' }}>
        <section style={{ flex: '1 1 350px', background: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <ReservationForm repository={repository} onSuccess={loadData} />
        </section>

        <section style={{ flex: '2 1 600px', background: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <ScheduleView reservations={reservations} />
        </section>
      </div>

      <section>
        <ReservationList reservations={reservations} onStatusChange={handleStatusChange} />
      </section>
    </div>
  );
}