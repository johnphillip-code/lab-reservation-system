// src/presentation/components/ScheduleView.tsx

import React, { useState } from 'react';
import { Reservation, LabType } from '../../domain/entities/Reservation';

interface ScheduleViewProps {
  reservations: Reservation[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ reservations }) => {
  const [selectedLab, setSelectedLab] = useState<LabType>('ComLab 1');
  
  // Default to today's date formatted as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const filteredReservations = reservations
    .filter(r => r.lab === selectedLab && r.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sort chronologically

  return (
    <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
      <h2>Lab Schedule View</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
        <label>
          Lab:
          <select value={selectedLab} onChange={e => setSelectedLab(e.target.value as LabType)} style={{ marginLeft: '10px' }}>
            <option value="ComLab 1">ComLab 1</option>
            <option value="ComLab 2">ComLab 2</option>
            <option value="AES">AES</option>
          </select>
        </label>
        <label>
          Date:
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ marginLeft: '10px' }} />
        </label>
      </div>

      {filteredReservations.length === 0 ? (
        <p>No reservations for this date and lab.</p>
      ) : (
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Time</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Teacher</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Purpose</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map(res => (
              <tr key={res.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{res.startTime} - {res.endTime}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{res.teacherName}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{res.purpose}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{res.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
