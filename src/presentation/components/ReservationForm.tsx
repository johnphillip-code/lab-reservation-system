// src/presentation/components/ReservationForm.tsx

import React, { useState } from 'react';
import { isCapacityValid, type LabType, type Reservation } from '../../domain/entities/Reservation';
import type { ReservationRepository } from '../../domain/repositories/ReservationRepository';
import { CheckDoubleBookingUseCase } from '../../domain/usecases/CheckDoubleBookingUseCase';

interface ReservationFormProps {
  repository: ReservationRepository;
  onSuccess: () => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ repository, onSuccess }) => {
  const [teacherName, setTeacherName] = useState('');
  const [lab, setLab] = useState<LabType>('ComLab 1');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [studentsCount, setStudentsCount] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    if (!isCapacityValid(lab, studentsCount)) {
      setError(`Capacity exceeded. ${lab} can only hold up to 40/30/25 students respectively.`);
      return;
    }

    const doubleBookingCheck = new CheckDoubleBookingUseCase(repository);
    
    const conflictError = doubleBookingCheck.execute({
      teacherName,
      lab,
      date,
      startTime,
      endTime,
      purpose,
      studentsCount
    });

    if (conflictError) {
      setError(conflictError);
      return;
    }

    const newReservation: Reservation = {
      id: Date.now().toString(),
      teacherName,
      lab,
      date,
      startTime,
      endTime,
      purpose,
      studentsCount,
      status: 'Pending'
    };

    repository.save(newReservation);
    setSuccessMsg(`Reservation for ${lab} on ${date} submitted successfully!`);
    
    setTeacherName('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setPurpose('');
    setStudentsCount(0);
    
    onSuccess();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Reservation</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', background: '#ffe6e6', border: '1px solid red' }}>{error}</div>}
      {successMsg && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', background: '#e6ffe6', border: '1px solid green' }}>{successMsg}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', gap: '10px' }}>
        <input required placeholder="Teacher Name" value={teacherName} onChange={e => setTeacherName(e.target.value)} />
        
        <select value={lab} onChange={e => setLab(e.target.value as LabType)}>
          <option value="ComLab 1">ComLab 1</option>
          <option value="ComLab 2">ComLab 2</option>
          <option value="AES">AES</option>
        </select>

        <input required type="date" value={date} onChange={e => setDate(e.target.value)} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <label>Start: <input required type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></label>
          <label>End: <input required type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></label>
        </div>

        <input required type="number" placeholder="Number of Students" value={studentsCount || ''} onChange={e => setStudentsCount(Number(e.target.value))} />
        <textarea required placeholder="Purpose of Reservation" value={purpose} onChange={e => setPurpose(e.target.value)} />

        <button type="submit" style={{ padding: '10px', background: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>Submit Reservation</button>
      </form>
    </div>
  );
};