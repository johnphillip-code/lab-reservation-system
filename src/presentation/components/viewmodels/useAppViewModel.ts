import { useState, useCallback } from 'react';
import { LocalStorageReservationRepository } from '../../../data/repositories/LocalStorageReservationRepository';
import { UpdateReservationStatusUseCase } from '../../../domain/usecases/UpdateReservationStatusUseCase';
import type { Reservation, ReservationStatus } from '../../../domain/entities/Reservation';

// IoC Initialization (In a larger app, this would be injected via a Dependency Injection container)
const repository = new LocalStorageReservationRepository();
const updateStatusUseCase = new UpdateReservationStatusUseCase(repository);

const getInitialState = () => {
  try {
    return { reservations: repository.getAll(), error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown data loading error';
    console.error('Failed to load reservations:', err);
    return { reservations: [], error: errorMessage };
  }
};

export const useAppViewModel = () => {
  const [initialState] = useState(getInitialState);
  const [reservations, setReservations] = useState<Reservation[]>(initialState.reservations);
  const [error, setError] = useState<string | null>(initialState.error);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadData = useCallback(() => {
    try {
      setIsLoading(true);
      const data = repository.getAll();
      setReservations(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown data loading error';
      setError(errorMessage);
      console.error('Failed to load reservations:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeReservationStatus = useCallback((id: string, newStatus: ReservationStatus, reason?: string) => {
    try {
      const result = updateStatusUseCase.execute(id, newStatus, reason);
      
      if (!result.success) {
        setError(result.error || 'Failed to update reservation status.');
        return false;
      }
      
      loadData();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown status update error';
      setError(errorMessage);
      return false;
    }
  }, [loadData]);

  const clearError = useCallback(() => setError(null), []);

  return {
    reservations,
    isLoading,
    error,
    clearError,
    repository, // Passed down for ReservationForm injection; ideally abstracted further.
    loadData,
    changeReservationStatus
  };
};