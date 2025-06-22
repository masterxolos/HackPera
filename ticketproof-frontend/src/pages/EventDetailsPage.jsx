import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Clock, Users, DollarSign,
  ArrowLeft, Ticket, Share2, Heart
} from 'lucide-react';
import { useWallet } from './WalletContext';


const EventDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const { buyTickets } = useWallet();

  const event = state?.event;

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
        <button
          onClick={() => navigate('/events')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleBuyTickets = async () => {
  try {
    const txResult = await buyTickets({
      eventId: 1,
      quantity: ticketQuantity,
      totalPrice: event.price * ticketQuantity
    });

    alert(`Success! Hash: ${txResult.hash}`);
  } catch (err) {
    alert('Transaction failed: ' + err.message);
  }
};

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/events')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="absolute top-6 left-6">
            <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>
          <div className="absolute top-6 right-6 flex space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{event.description}</p>
                <p className="text-gray-700 leading-relaxed">{event.longDescription}</p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Attendees</p>
                    <p className="font-medium">{event.attendees} / {event.capacity}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {event.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                    ))}
                </div>
              </div>

              {/* Organizer */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Organizer</h3>
                <p className="text-gray-600">{event.organizer}</p>
              </div>
            </div>

            {/* Ticket Purchase Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                                {(event.price / 1000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 })} XLM
                    
                  </div>
                  <p className="text-gray-600">per ticket</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of tickets
                    </label>
                    <select
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} ticket{i > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                                    {(event.price / 1000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 })} XLM
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBuyTickets}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Ticket className="w-5 h-5" />
                    <span>Buy Tickets</span>
                  </button>
                </div>

                {/* Availability Status */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      {event.capacity - event.attendees} tickets remaining
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
