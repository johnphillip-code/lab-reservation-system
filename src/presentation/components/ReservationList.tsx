// src/presentation/components/ReservationList.tsx

import React, { useState } from 'react';
import type { Reservation, ReservationStatus, LabType } from '../../domain/entities/Reservation';

interface ReservationListProps {
  reservations: Reservation[];
  onStatusChange: (id: string, newStatus: ReservationStatus, reason?: string) => void;
}

export const ReservationList: React.FC<ReservationListProps> = ({ reservations, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLab, setFilterLab] = useState<LabType | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'All'>('All');
  const [filterDate, setFilterDate] = useState('');

  // Apply search and filters
  const filteredReservations = reservations.filter(res => {
    const matchesSearch = res.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLab = filterLab === 'All' || res.lab === filterLab;
    const matchesStatus = filterStatus === 'All' || res.status === filterStatus;
    const matchesDate = filterDate === '' || res.date === filterDate;
    
    return matchesSearch && matchesLab && matchesStatus && matchesDate;
  });

  const handleReject = (id: string) => {
    const reason = window.prompt("Please enter a reason for rejection:");
    if (reason && reason.trim() !== "") {
      onStatusChange(id, 'Rejected', reason);
    } else if (reason !== null) {
      alert("A reason is required to reject a reservation.");
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Reservation Management</h2>
      
      {/* Filters */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search teacher or purpose..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          style={{ padding: '8px' }}
        />
        <select value={filterLab} onChange={e => setFilterLab(e.target.value as LabType | 'All')} style={{ padding: '8px' }}>
          <option value="All">All Labs</option>
          <option value="ComLab 1">ComLab 1</option>
          <option value="ComLab 2">ComLab 2</option>
          <option value="AES">AES</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as ReservationStatus | 'All')} style={{ padding: '8px' }}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ padding: '8px' }} />
        <button onClick={() => { setSearchTerm(''); setFilterLab('All'); setFilterStatus('All'); setFilterDate(''); }} style={{ padding: '8px' }}>Clear</button>
      </div>

      {/* Table */}
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Details</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Lab & Time</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map(res => (
            <tr key={res.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>
                <strong>{res.teacherName}</strong><br/>
                <small>{res.purpose} ({res.studentsCount} students)</small>
              </td>
              <td style={{ padding: '10px' }}>
                {res.lab}<br/>
                <small>{res.date} | {res.startTime} - {res.endTime}</small>
              </td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.9em',
                  background: res.status === 'Approved' ? '#d4edda' : res.status === 'Rejected' ? '#f8d7da' : res.status === 'Pending' ? '#fff3cd' : '#e2e3e5'
                }}>
                  {res.status}
                </span>
                {res.rejectionReason && <div style={{ fontSize: '0.8em', color: 'red', marginTop: '4px' }}>Reason: {res.rejectionReason}</div>}
              </td>
              <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                {res.status === 'Pending' && (
                  <>
                    <button onClick={() => onStatusChange(res.id, 'Approved')} style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Approve</button>
                    <button onClick={() => handleReject(res.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Reject</button>
                  </>
                )}
                {(res.status === 'Pending' || res.status === 'Approved') && (
                  <button onClick={() => onStatusChange(res.id, 'Cancelled')} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};