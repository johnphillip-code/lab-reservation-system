// src/domain/repositories/ReservationRepository.ts

import type { Reservation } from '../entities/Reservation';

export interface ReservationRepository {
  getAll(): Reservation[];
  getById(id: string): Reservation | undefined;
  save(reservation: Reservation): void;
  update(reservation: Reservation): void;
}