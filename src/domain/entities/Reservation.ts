// src/domain/entities/Reservation.ts

export type LabType = 'ComLab 1' | 'ComLab 2' | 'AES';
export type ReservationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type UserRole = 'Teacher' | 'Coordinator';

export interface Reservation {
  id: string;
  teacherName: string;
  lab: LabType;
  date: string;       // Format: YYYY-MM-DD
  startTime: string;  // Format: HH:mm (24-hour)
  endTime: string;    // Format: HH:mm (24-hour)
  purpose: string;
  studentsCount: number;
  status: ReservationStatus;
  rejectionReason?: string; // Only populated if status is Rejected
}

export const LAB_CAPACITIES: Record<LabType, number> = {
  'ComLab 1': 40,
  'ComLab 2': 30,
  'AES': 25
};

/**
 * Business Rule: Validates if the requested student count fits in the selected lab.
 */
export function isCapacityValid(lab: LabType, studentsCount: number): boolean {
  return studentsCount > 0 && studentsCount <= LAB_CAPACITIES[lab];
}