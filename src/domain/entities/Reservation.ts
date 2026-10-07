// src/domain/entities/Reservation.ts

export type LabType = 'ComLab 1' | 'ComLab 2' | 'AES';
export type ReservationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type UserRole = 'Teacher' | 'Coordinator';

export interface Reservation {
  id: string;
  teacherName: string;
  lab: LabType;
  date: string;       
  startTime: string;  
  endTime: string;    
  purpose: string;
  studentsCount: number;
  status: ReservationStatus;
  rejectionReason?: string; 
}

export const LAB_CAPACITIES: Record<LabType, number> = {
  'ComLab 1': 40,
  'ComLab 2': 30,
  'AES': 25
};

export function isCapacityValid(lab: LabType, studentsCount: number): boolean {
  return studentsCount > 0 && studentsCount <= LAB_CAPACITIES[lab];
}