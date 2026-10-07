// src/domain/usecases/UpdateReservationStatusUseCase.ts

import { ReservationRepository } from '../repositories/ReservationRepository';
import { ReservationStatus } from '../entities/Reservation';

export class UpdateReservationStatusUseCase {
  constructor(private repository: ReservationRepository) {}

  /**
   * Updates the status of a reservation while enforcing domain business rules.
   */
  execute(id: string, newStatus: ReservationStatus, reason?: string): { success: boolean; error?: string } {
    const reservation = this.repository.getById(id);
    
    if (!reservation) {
      return { success: false, error: "Reservation not found in the database." };
    }

    // Business Rule 6: A Rejected or Cancelled reservation cannot be changed again.
    if (reservation.status === 'Rejected' || reservation.status === 'Cancelled') {
      return { success: false, error: "Rule violation: A Rejected or Cancelled reservation cannot be changed again." };
    }

    // Apply the updates
    reservation.status = newStatus;
    if (reason) {
      reservation.rejectionReason = reason;
    }

    // Save back to repository
    this.repository.update(reservation);
    
    return { success: true };
  }
}