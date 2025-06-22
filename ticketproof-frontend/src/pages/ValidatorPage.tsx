import React, { useState } from 'react';
import { QrCode, CheckCircle, XCircle, Search, Scan, AlertCircle, Clock, Users } from 'lucide-react';

interface TicketValidation {
  id: string;
  eventTitle: string;
  ticketId: string;
  holderName: string;
  seatNumber?: string;
  status: 'valid' | 'invalid' | 'used';
  eventDate: string;
  eventTime: string;
  validationTime?: string;
}

const mockValidations: TicketValidation[] = [
  {
    id: 'V001',
    eventTitle: 'Summer Music Festival',
    ticketId: 'T001',
    holderName: 'John Doe',
    seatNumber: 'A-142',
    status: 'valid',
    eventDate: '2024-07-15',
    eventTime: '18:00',
    validationTime: '2024-07-15T17:30:00'
  },
  {
    id: 'V002',
    eventTitle: 'Tech Innovation Summit',
    ticketId: 'T002',
    holderName: 'Jane Smith',
    status: 'used',
    eventDate: '2024-07-20',
    eventTime: '09:00',
    validationTime: '2024-07-20T08:45:00'
  },
  {
    id: 'V003',
    eventTitle: 'Art Gallery Opening',
    ticketId: 'T003',
    holderName: 'Mike Johnson',
    status: 'invalid',
    eventDate: '2024-06-10',
    eventTime: '19:00',
    validationTime: '2024-06-10T18:30:00'
  }
];

const ValidatorPage: React.FC = () => {
  const [scanMode, setScanMode] = useState<'manual' | 'camera'>('manual');
  const [ticketInput, setTicketInput] = useState('');
  const [currentValidation, setCurrentValidation] = useState<TicketValidation | null>(null);
  const [validationHistory, setValidationHistory] = useState<TicketValidation[]>(mockValidations);
  const [isScanning, setIsScanning] = useState(false);

  const handleManualValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    // Simulate ticket validation
    const mockTicket: TicketValidation = {
      id: `V${Date.now()}`,
      eventTitle: 'Mock Event',
      ticketId: ticketInput,
      holderName: 'Test User',
      status: Math.random() > 0.3 ? 'valid' : 'invalid',
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: '20:00',
      validationTime: new Date().toISOString()
    };

    setCurrentValidation(mockTicket);
    setValidationHistory([mockTicket, ...validationHistory]);
    setTicketInput('');
  };

  const handleCameraValidation = () => {
    setIsScanning(true);
    // Simulate camera scanning
    setTimeout(() => {
      const mockTicket: TicketValidation = {
        id: `V${Date.now()}`,
        eventTitle: 'Scanned Event',
        ticketId: 'QR_SCANNED_001',
        holderName: 'Camera User',
        status: 'valid',
        eventDate: new Date().toISOString().split('T')[0],
        eventTime: '19:00',
        validationTime: new Date().toISOString()
      };
      
      setCurrentValidation(mockTicket);
      setValidationHistory([mockTicket, ...validationHistory]);
      setIsScanning(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'used':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'invalid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'used':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const validTickets = validationHistory.filter(v => v.status === 'valid').length;
  const invalidTickets = validationHistory.filter(v => v.status === 'invalid').length;
  const usedTickets = validationHistory.filter(v => v.status === 'used').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ticket Validator</h1>
        <p className="text-gray-600 mt-1">Scan or enter ticket codes to validate entry</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Scanned</p>
              <p className="text-2xl font-bold text-gray-900">{validationHistory.length}</p>
            </div>
            <QrCode className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Valid Tickets</p>
              <p className="text-2xl font-bold text-green-600">{validTickets}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Invalid Tickets</p>
              <p className="text-2xl font-bold text-red-600">{invalidTickets}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Already Used</p>
              <p className="text-2xl font-bold text-yellow-600">{usedTickets}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validation Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Validate Ticket</h2>
          
          {/* Mode Selection */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setScanMode('manual')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                scanMode === 'manual'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setScanMode('camera')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                scanMode === 'camera'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Camera Scan
            </button>
          </div>

          {scanMode === 'manual' ? (
            <form onSubmit={handleManualValidation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket ID or QR Code
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={ticketInput}
                    onChange={(e) => setTicketInput(e.target.value)}
                    placeholder="Enter ticket ID..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Validate Ticket
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-8 mb-4">
                {isScanning ? (
                  <div className="animate-pulse">
                    <Scan className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Scanning...</p>
                  </div>
                ) : (
                  <>
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Position QR code within camera view</p>
                  </>
                )}
              </div>
              <button
                onClick={handleCameraValidation}
                disabled={isScanning}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? 'Scanning...' : 'Start Camera Scan'}
              </button>
            </div>
          )}

          {/* Current Validation Result */}
          {currentValidation && (
            <div className={`mt-6 p-4 rounded-lg border-2 ${getStatusColor(currentValidation.status)}`}>
              <div className="flex items-center space-x-3 mb-3">
                {getStatusIcon(currentValidation.status)}
                <h3 className="font-bold text-lg capitalize">{currentValidation.status}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Event:</strong> {currentValidation.eventTitle}</p>
                <p><strong>Ticket ID:</strong> {currentValidation.ticketId}</p>
                <p><strong>Holder:</strong> {currentValidation.holderName}</p>
                {currentValidation.seatNumber && (
                  <p><strong>Seat:</strong> {currentValidation.seatNumber}</p>
                )}
                <p><strong>Event Date:</strong> {currentValidation.eventDate} at {currentValidation.eventTime}</p>
              </div>
            </div>
          )}
        </div>

        {/* Validation History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Validations</h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {validationHistory.map((validation) => (
              <div key={validation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(validation.status)}
                  <div>
                    <p className="font-medium text-sm">{validation.ticketId}</p>
                    <p className="text-xs text-gray-500">{validation.holderName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {validation.validationTime && formatDateTime(validation.validationTime)}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(validation.status)}`}>
                    {validation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {validationHistory.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No validations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidatorPage;