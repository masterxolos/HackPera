import React, { useState } from 'react';
import { Calendar, MapPin, Clock, QrCode, Download, Share2, Filter } from 'lucide-react';

interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventImage: string;
  ticketPrice: number;
  purchaseDate: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  qrCode: string;
  seatNumber?: string;
}

const mockTickets: Ticket[] = [
  {
    id: 'T001',
    eventId: '1',
    eventTitle: 'Summer Music Festival',
    eventDate: '2024-07-15',
    eventTime: '18:00',
    eventLocation: 'Central Park Amphitheater',
    eventImage: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600',
    ticketPrice: 75,
    purchaseDate: '2024-06-20',
    status: 'upcoming',
    qrCode: 'QR_CODE_DATA_001',
    seatNumber: 'A-142'
  },
  {
    id: 'T002',
    eventId: '2',
    eventTitle: 'Tech Innovation Summit',
    eventDate: '2024-07-20',
    eventTime: '09:00',
    eventLocation: 'Convention Center',
    eventImage: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=600',
    ticketPrice: 120,
    purchaseDate: '2024-06-18',
    status: 'upcoming',
    qrCode: 'QR_CODE_DATA_002'
  },
  {
    id: 'T003',
    eventId: '3',
    eventTitle: 'Art Gallery Opening',
    eventDate: '2024-06-10',
    eventTime: '19:00',
    eventLocation: 'Modern Art Gallery',
    eventImage: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=600',
    ticketPrice: 45,
    purchaseDate: '2024-05-25',
    status: 'completed',
    qrCode: 'QR_CODE_DATA_003'
  },
  {
    id: 'T004',
    eventId: '4',
    eventTitle: 'Food & Wine Festival',
    eventDate: '2024-08-01',
    eventTime: '17:00',
    eventLocation: 'Riverside Park',
    eventImage: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600',
    ticketPrice: 95,
    purchaseDate: '2024-06-22',
    status: 'upcoming',
    qrCode: 'QR_CODE_DATA_004'
  }
];

const MyTicketsPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [showQRCode, setShowQRCode] = useState<string | null>(null);

  const filteredTickets = mockTickets.filter(ticket => 
    selectedStatus === 'all' || ticket.status === selectedStatus
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadTicket = (ticket: Ticket) => {
    // In a real app, this would generate and download a PDF ticket
    alert(`Downloading ticket for ${ticket.eventTitle}`);
  };

  const handleShareTicket = (ticket: Ticket) => {
    if (navigator.share) {
      navigator.share({
        title: `My ticket for ${ticket.eventTitle}`,
        text: `I'm attending ${ticket.eventTitle} on ${formatDate(ticket.eventDate)}`,
        url: window.location.href,
      });
    } else {
      alert('Sharing feature not available in this browser');
    }
  };

  const QRCodeModal = ({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{ticket.eventTitle}</h3>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 inline-block">
            {/* QR Code placeholder - in a real app, you'd use a QR code library */}
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
              <QrCode className="w-24 h-24 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-600 mb-2">Ticket ID: {ticket.id}</p>
          {ticket.seatNumber && (
            <p className="text-gray-600 mb-4">Seat: {ticket.seatNumber}</p>
          )}
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-600 mt-1">Manage your event tickets</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Tickets</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <img 
                src={ticket.eventImage} 
                alt={ticket.eventTitle}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{ticket.eventTitle}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(ticket.eventDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{ticket.eventTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{ticket.eventLocation}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Ticket ID</p>
                    <p className="font-medium">{ticket.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-bold text-lg">${ticket.ticketPrice}</p>
                  </div>
                </div>

                {ticket.seatNumber && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Seat Number</p>
                    <p className="font-medium">{ticket.seatNumber}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowQRCode(ticket.id)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Show QR</span>
                  </button>
                  <button
                    onClick={() => handleDownloadTicket(ticket)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleShareTicket(ticket)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600">You don't have any tickets matching the selected filter</p>
        </div>
      )}

      {showQRCode && (
        <QRCodeModal
          ticket={filteredTickets.find(t => t.id === showQRCode)!}
          onClose={() => setShowQRCode(null)}
        />
      )}
    </div>
  );
};

export default MyTicketsPage;