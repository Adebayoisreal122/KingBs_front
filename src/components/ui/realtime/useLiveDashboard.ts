import { useEffect, useState } from 'react';
import { socket } from './socket';
import type { Car } from '@types';

export function useLiveDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  useEffect(() => {
    socket.on('cars:update', setCars);
    socket.on('enquiries:update', setEnquiries);

    return () => {
      socket.off('cars:update');
      socket.off('enquiries:update');
    };
  }, []);

  return { cars, enquiries };
}