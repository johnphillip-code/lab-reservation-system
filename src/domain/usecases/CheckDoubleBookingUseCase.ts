// src/domain/usecases/CheckDoubleBookingUseCase.ts

import type { Reservation } from '../entities/Reservation';
import type { ReservationRepository } from '../repositories/ReservationRepository';

export class CheckDoubleBookingUseCase {
  private readonly repository: ReservationRepository;

  constructor(repository: ReservationRepository) {
    this.repository = repository;
  }

  /**
   * Checks if a proposed reservation overlaps with any existing Pending or Approved reservations.
   * @returns An error message string if there is a conflict, or null if the time slot is free.
   */
  execute(newReservation: Omit<Reservation, 'id' | 'status' | 'rejectionReason'>): string | null {
    const allReservations = this.repository.getAll();

    const conflictingReservation = allReservations.find(existing => {
      // 1. Filter: Only check the exact same lab and same date
      if (existing.lab !== newReservation.lab || existing.date !== newReservation.date) {
        return false;
      }

      // 2. Filter: Cancelled or Rejected reservations free up the slot, so we ignore them
      if (existing.status === 'Rejected' || existing.status === 'Cancelled') {
        return false;
      }

      // 3. Logic: Check for overlapping times
      const existingStart = this.timeToMinutes(existing.startTime);
      const existingEnd = this.timeToMinutes(existing.endTime);
      const newStart = this.timeToMinutes(newReservation.startTime);
      const newEnd = this.timeToMinutes(newReservation.endTime);

      // Standard overlap formula: (Start A < End B) AND (End A > Start B)
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflictingReservation) {
      return `Time conflict: ${conflictingReservation.lab} is already booked on ${conflictingReservation.date} from ${conflictingReservation.startTime} to ${conflictingReservation.endTime} by ${conflictingReservation.teacherName} (Status: ${conflictingReservation.status}).`;
    }

    return null; // Null means no conflicts were found; it is safe to book.
  }

  /**
   * Helper method to convert 24-hour time strings (e.g., "14:30") into integers (e.g., 870)
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
  }
}