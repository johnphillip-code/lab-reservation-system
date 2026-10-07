// src/data/repositories/LocalStorageReservationRepository.ts

import type { Reservation } from '../../domain/entities/Reservation';
import type { ReservationRepository } from '../../domain/repositories/ReservationRepository';

const STORAGE_KEY = 'it415_lab_reservations_db';

export class LocalStorageReservationRepository implements ReservationRepository {
  
  getAll(): Reservation[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    
    try {
      return JSON.parse(data) as Reservation[];
    } catch (error) {
      console.error("Data integrity error: Failed to parse reservations from localStorage", error);
      return [];
    }
  }

  getById(id: string): Reservation | undefined {
    const reservations = this.getAll();
    return reservations.find(reservation => reservation.id === id);
  }

  save(reservation: Reservation): void {
    const reservations = this.getAll();
    reservations.push(reservation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  }

  update(reservation: Reservation): void {
    const reservations = this.getAll();
    const index = reservations.findIndex(r => r.id === reservation.id);
    
    if (index !== -1) {
      reservations[index] = reservation;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } else {
      throw new Error(`Repository Error: Cannot update. Reservation with ID ${reservation.id} not found.`);
    }
  }
}