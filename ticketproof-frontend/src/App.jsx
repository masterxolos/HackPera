import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ValidatorPage from './pages/ValidatorPage';
import EventDetailsPage from './pages/EventDetailsPage';
import { WalletProvider } from './pages/WalletContext.jsx';

function App() {
  return (
    <WalletProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/create" element={<CreateEventPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
            <Route path="/validator" element={<ValidatorPage />} />
          </Routes>
        </Layout>
      </Router>
    </WalletProvider>
  );
}

export default App;
