import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Ticket, QrCode, Plus, LogIn, LogOut } from 'lucide-react';
import { useWallet } from '../pages/WalletContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { walletAddress, connectWallet, disconnectWallet } = useWallet();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EventHub</span>
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/events"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/events') && !isActive('/events/create')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Events</span>
                </Link>

                <Link
                  to="/my-tickets"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/my-tickets')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>My Tickets</span>
                </Link>

                <Link
                  to="/validator"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/validator')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Validator</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {walletAddress ? (
                <>
                  <span className="text-sm text-gray-600 truncate max-w-xs">
                    {walletAddress}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 border border-red-500 rounded-lg hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={connectWallet}
                  className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
              )}

              <Link
                to="/events/create"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
