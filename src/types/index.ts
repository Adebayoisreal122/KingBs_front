export interface Car {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: 'New' | 'Used' | 'Certified Pre-Owned';
  category: 'Sedan' | 'SUV' | 'Truck' | 'Coupe' | 'Convertible' | 'Van' | 'Electric' | 'Luxury';
  transmission: 'Automatic' | 'Manual' | 'CVT';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid';
  bodyColor: string;
  engine: string;
  horsepower: number;
  doors: number;
  seats: number;
  description: string;
  features: string[];
  images: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  dealType: 'Hot Deal' | 'New Arrival' | 'Price Drop' | '';
  previousPrice?: number;
  location: string;
  vin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CarFilters {
  search: string;
  category: string;
  condition: string;
  make: string;
  minPrice: number | '';
  maxPrice: number | '';
  minYear: number | '';
  maxYear: number | '';
  transmission: string;
  fuelType: string;
  sortBy: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
  pages?: number;
  page?: number;
  message?: string;
}

export interface Enquiry {
  _id: string;
  carId: string;
  carTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  type: 'General' | 'Test Drive' | 'Finance' | 'Trade-in';
  isRead: boolean;
  createdAt: string;
}
