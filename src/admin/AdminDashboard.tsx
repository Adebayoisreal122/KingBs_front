import { useEffect, useState } from 'react';

import { fetchCars, fetchEnquiries } from '../services/api';

import type {
  Car,
  Enquiry,
} from '@types';
import StatsWidget from '../components/ui/widgets/stats/StatsWidget';
import EnquiryWidget from '../components/ui/widgets/enquiries/EnquiryWidget';
import InventoryWidget from '../components/ui/widgets/inventory/InventoryWidget';
import WidgetGrid from '../components/ui/widgets/WidgetGrid';

export default function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    Promise.all([
      fetchCars({ limit: 1000 }),
      fetchEnquiries(),
    ]).then(([carsRes, enqRes]) => {
      setCars(carsRes.data || []);
      setEnquiries(enqRes.data || []);
    });
  }, []);

  const stats = {
    total: cars.length,
    available: cars.filter(c => c.isAvailable).length,
    sold: cars.filter(c => !c.isAvailable).length,
    featured: cars.filter(c => c.isFeatured).length,
    deals: cars.filter(c => c.dealType).length,
    newCars: cars.filter(c => c.condition === 'New').length,
    usedCars: cars.filter(c => c.condition === 'Used').length,
  };

  return (
    <div className="space-y-8">

      <StatsWidget stats={stats} />

      <WidgetGrid >
        <EnquiryWidget enquiries={enquiries} />
        <InventoryWidget cars={cars} />
      </WidgetGrid >

    </div>
  );
}