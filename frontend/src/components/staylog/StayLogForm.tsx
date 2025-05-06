import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Room, Guest, StayLog } from '../../types';
import { roomAPI, guestAPI, stayLogAPI } from '../../services/api';
import { format } from 'date-fns';

interface StayLogFormProps {
  onSuccess: (stayLog: StayLog) => void;
  initialData?: Partial<StayLog>;
  isEdit?: boolean;
}

type FormData = {
  roomId: string;
  bedId?: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalAmount: number;
  specialRequests?: string;
  notes?: string;
};

const StayLogForm: React.FC<StayLogFormProps> = ({ onSuccess, initialData, isEdit = false }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      roomId: initialData?.roomId || '',
      bedId: initialData?.bedId || '',
      guestId: initialData?.guestId || '',
      checkInDate: initialData?.checkInDate ? format(new Date(initialData.checkInDate), 'yyyy-MM-dd') : '',
      checkOutDate: initialData?.checkOutDate ? format(new Date(initialData.checkOutDate), 'yyyy-MM-dd') : '',
      guestCount: initialData?.guestCount || 1,
      totalAmount: initialData?.totalAmount || 0,
      specialRequests: initialData?.specialRequests || '',
      notes: initialData?.notes || '',
    }
  });

  const roomId = watch('roomId');
  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');
  const guestCount = watch('guestCount');

  useEffect(() => {
    const fetchRoomsAndGuests = async () => {
      try {
        setLoading(true);
        // If editing, get all rooms
        if (isEdit) {
          const roomsData = await roomAPI.getAllRooms();
          setRooms(roomsData);
        } 
        // If creating new, get only available rooms
        else if (checkInDate && checkOutDate) {
          const availableRooms = await roomAPI.getAvailableRooms(checkInDate, checkOutDate);
          setRooms(availableRooms);
        }
        
        const guestsData = await guestAPI.getAllGuests();
        setGuests(guestsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchRoomsAndGuests();
  }, [checkInDate, checkOutDate, isEdit]);

  // Load selected room details
  useEffect(() => {
    if (roomId) {
      const room = rooms.find(r => r.id === roomId);
      setSelectedRoom(room || null);
      
      // Set default price based on room
      if (room && checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        setValue('totalAmount', room.pricePerNight * nights);
      }
    }
  }, [roomId, rooms, checkInDate, checkOutDate, setValue]);

  // Handle date change to update total amount
  useEffect(() => {
    if (selectedRoom && checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        setValue('totalAmount', selectedRoom.pricePerNight * nights);
      }
    }
  }, [selectedRoom, checkInDate, checkOutDate, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      let result;
      
      if (isEdit && initialData?.id) {
        result = await stayLogAPI.updateStayLog(initialData.id, data);
      } else {
        result = await stayLogAPI.createStayLog(data);
      }
      
      onSuccess(result);
      setLoading(false);
    } catch (err) {
      setError('Failed to save booking');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check-in & Check-out dates */}
        <div>
          <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">Check-in Date</label>
          <input
            id="checkInDate"
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('checkInDate', { required: 'Check-in date is required' })}
          />
          {errors.checkInDate && <p className="mt-1 text-sm text-red-600">{errors.checkInDate.message}</p>}
        </div>
        
        <div>
          <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">Check-out Date</label>
          <input
            id="checkOutDate"
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('checkOutDate', { required: 'Check-out date is required' })}
          />
          {errors.checkOutDate && <p className="mt-1 text-sm text-red-600">{errors.checkOutDate.message}</p>}
        </div>
        
        {/* Room Selection */}
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">Room</label>
          <select
            id="roomId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('roomId', { required: 'Room is required' })}
          >
            <option value="">Select a room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                Room {room.roomNumber} - {room.type} (${room.pricePerNight}/night)
              </option>
            ))}
          </select>
          {errors.roomId && <p className="mt-1 text-sm text-red-600">{errors.roomId.message}</p>}
        </div>
        
        {/* Bed Selection (if room has beds) */}
        {selectedRoom && selectedRoom.beds && selectedRoom.beds.length > 0 && (
          <div>
            <label htmlFor="bedId" className="block text-sm font-medium text-gray-700">Bed (Optional)</label>
            <select
              id="bedId"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('bedId')}
            >
              <option value="">No specific bed</option>
              {selectedRoom.beds.map(bed => (
                <option key={bed.id} value={bed.id}>
                  Bed {bed.bedNumber} - {bed.type}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Guest Selection */}
        <div>
          <label htmlFor="guestId" className="block text-sm font-medium text-gray-700">Guest</label>
          <select
            id="guestId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('guestId', { required: 'Guest is required' })}
          >
            <option value="">Select a guest</option>
            {guests.map(guest => (
              <option key={guest.id} value={guest.id}>
                {guest.firstName} {guest.lastName} ({guest.email})
              </option>
            ))}
          </select>
          {errors.guestId && <p className="mt-1 text-sm text-red-600">{errors.guestId.message}</p>}
        </div>
        
        {/* Guest Count */}
        <div>
          <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">Number of Guests</label>
          <input
            id="guestCount"
            type="number"
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('guestCount', { 
              required: 'Guest count is required',
              min: { value: 1, message: 'At least 1 guest is required' },
              valueAsNumber: true
            })}
          />
          {errors.guestCount && <p className="mt-1 text-sm text-red-600">{errors.guestCount.message}</p>}
        </div>
        
        {/* Total Amount */}
        <div>
          <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount ($)</label>
          <input
            id="totalAmount"
            type="number"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('totalAmount', { 
              required: 'Total amount is required',
              valueAsNumber: true
            })}
          />
          {errors.totalAmount && <p className="mt-1 text-sm text-red-600">{errors.totalAmount.message}</p>}
        </div>
      </div>
      
      {/* Special Requests */}
      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">Special Requests</label>
        <textarea
          id="specialRequests"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          {...register('specialRequests')}
        />
      </div>
      
      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          {...register('notes')}
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Booking' : 'Create Booking'}
        </button>
      </div>
    </form>
  );
};

export default StayLogForm; 