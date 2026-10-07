// src/presentation/components/Dashboard.tsx

import React from 'react';
import { Reservation } from '../../domain/entities/Reservation';

interface DashboardProps {
  reservations: Reservation[];
}

export const Dashboard: React.FC<DashboardProps> = ({ reservations }) => {
  const pending = reservations.filter(r => r.status === 'Pending').length;
  const approved = reservations.filter(r => r.status === 'Approved').length;
  const rejected = reservations.filter(r => r.status === 'Rejected').length;
  const cancelled = reservations.filter(r => r.status === 'Cancelled').length;

  return (
    <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
      <h2>System Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
          <strong>Pending:</strong> {pending}
        </div>
        <div style={{ padding: '15px', background: '#d4edda', borderRadius: '8px' }}>
          <strong>Approved:</strong> {approved}
        </div>
        <div style={{ padding: '15px', background: '#f8d7da', borderRadius: '8px' }}>
          <strong>Rejected:</strong> {rejected}
        </div>
        <div style={{ padding: '15px', background: '#e2e3e5', borderRadius: '8px' }}>
          <strong>Cancelled:</strong> {cancelled}
        </div>
      </div>
    </div>
  );
};