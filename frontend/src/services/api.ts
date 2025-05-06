import axios from 'axios';
import { Room, Bed, Guest, StayLog, Payment } from '../types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Room API
export const roomAPI = {
  getAllRooms: async () => {
    const response = await api.get<Room[]>('/rooms');
    return response.data;
  },
  
  getRoomById: async (id: string) => {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },
  
  getAvailableRooms: async (checkInDate: string, checkOutDate: string, roomType?: string) => {
    const params = { checkInDate, checkOutDate, roomType };
    const response = await api.get<Room[]>('/rooms/available', { params });
    return response.data;
  },
  
  createRoom: async (roomData: Omit<Room, 'id' | 'beds' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Room>('/rooms', roomData);
    return response.data;
  },
  
  updateRoom: async (id: string, roomData: Partial<Room>) => {
    const response = await api.put<Room>(`/rooms/${id}`, roomData);
    return response.data;
  },
  
  deleteRoom: async (id: string) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
};

// Bed API
export const bedAPI = {
  getAllBeds: async () => {
    const response = await api.get<Bed[]>('/beds');
    return response.data;
  },
  
  getBedById: async (id: string) => {
    const response = await api.get<Bed>(`/beds/${id}`);
    return response.data;
  },
  
  createBed: async (bedData: Omit<Bed, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Bed>('/beds', bedData);
    return response.data;
  },
  
  updateBed: async (id: string, bedData: Partial<Bed>) => {
    const response = await api.put<Bed>(`/beds/${id}`, bedData);
    return response.data;
  },
  
  deleteBed: async (id: string) => {
    const response = await api.delete(`/beds/${id}`);
    return response.data;
  },
};

// Guest API
export const guestAPI = {
  getAllGuests: async () => {
    const response = await api.get<Guest[]>('/guests');
    return response.data;
  },
  
  getGuestById: async (id: string) => {
    const response = await api.get<Guest>(`/guests/${id}`);
    return response.data;
  },
  
  createGuest: async (guestData: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Guest>('/guests', guestData);
    return response.data;
  },
  
  updateGuest: async (id: string, guestData: Partial<Guest>) => {
    const response = await api.put<Guest>(`/guests/${id}`, guestData);
    return response.data;
  },
  
  deleteGuest: async (id: string) => {
    const response = await api.delete(`/guests/${id}`);
    return response.data;
  },
};

// StayLog API
export const stayLogAPI = {
  getAllStayLogs: async () => {
    const response = await api.get<StayLog[]>('/staylogs');
    return response.data;
  },
  
  getStayLogById: async (id: string) => {
    const response = await api.get<StayLog>(`/staylogs/${id}`);
    return response.data;
  },
  
  createStayLog: async (stayLogData: {
    roomId: string;
    bedId?: string;
    guestId: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
    totalAmount: number;
    specialRequests?: string;
    notes?: string;
  }) => {
    const response = await api.post<StayLog>('/staylogs', stayLogData);
    return response.data;
  },
  
  updateStayLog: async (id: string, stayLogData: Partial<StayLog>) => {
    const response = await api.put<StayLog>(`/staylogs/${id}`, stayLogData);
    return response.data;
  },
  
  checkIn: async (id: string) => {
    const response = await api.put<StayLog>(`/staylogs/${id}/checkin`);
    return response.data;
  },
  
  checkOut: async (id: string) => {
    const response = await api.put<StayLog>(`/staylogs/${id}/checkout`);
    return response.data;
  },
  
  cancelBooking: async (id: string) => {
    const response = await api.put<StayLog>(`/staylogs/${id}/cancel`);
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  getAllPayments: async () => {
    const response = await api.get<Payment[]>('/payments');
    return response.data;
  },
  
  getPaymentById: async (id: string) => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },
  
  createPayment: async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Payment>('/payments', paymentData);
    return response.data;
  },
  
  updatePayment: async (id: string, paymentData: Partial<Payment>) => {
    const response = await api.put<Payment>(`/payments/${id}`, paymentData);
    return response.data;
  },
  
  deletePayment: async (id: string) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },
};

export default api; 