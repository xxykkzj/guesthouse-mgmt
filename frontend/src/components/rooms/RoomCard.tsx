import React from 'react';
import { Link } from 'react-router-dom';
import { Room, RoomStatus } from '../../types';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  // Function to determine status color
  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'bg-green-100 text-green-800';
      case RoomStatus.OCCUPIED:
        return 'bg-red-100 text-red-800';
      case RoomStatus.MAINTENANCE:
        return 'bg-yellow-100 text-yellow-800';
      case RoomStatus.CLEANING:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get room type display
  const getRoomTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Room {room.roomNumber}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
            {room.status}
          </span>
        </div>
        
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">Type: </span>
          <span className="text-sm text-gray-600">{getRoomTypeDisplay(room.type)}</span>
        </div>
        
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">Floor: </span>
          <span className="text-sm text-gray-600">{room.floor}</span>
        </div>
        
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">Price: </span>
          <span className="text-sm text-gray-600">${room.pricePerNight}/night</span>
        </div>
        
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">Beds: </span>
          <span className="text-sm text-gray-600">{room.beds?.length || 0}</span>
        </div>
        
        {room.description && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">Description: </span>
            <span className="text-sm text-gray-600">
              {room.description.length > 50 ? room.description.substring(0, 50) + '...' : room.description}
            </span>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/rooms/${room.id}`} 
            className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard; 