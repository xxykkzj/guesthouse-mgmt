import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import RoomList from './pages/rooms/RoomList';
import RoomDetail from './pages/rooms/RoomDetail';
import RoomForm from './pages/rooms/RoomForm';
import GuestList from './pages/guests/GuestList';
import GuestDetail from './pages/guests/GuestDetail';
import GuestForm from './pages/guests/GuestForm';
import StayLogList from './pages/staylogs/StayLogList';
import StayLogDetail from './pages/staylogs/StayLogDetail';
import StayLogForm from './pages/staylogs/StayLogForm';
import PaymentList from './pages/payments/PaymentList';
import PaymentDetail from './pages/payments/PaymentDetail';
import PaymentForm from './pages/payments/PaymentForm';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          
          {/* Room Routes */}
          <Route path="rooms" element={<RoomList />} />
          <Route path="rooms/new" element={<RoomForm />} />
          <Route path="rooms/:id" element={<RoomDetail />} />
          <Route path="rooms/:id/edit" element={<RoomForm />} />
          
          {/* Guest Routes */}
          <Route path="guests" element={<GuestList />} />
          <Route path="guests/new" element={<GuestForm />} />
          <Route path="guests/:id" element={<GuestDetail />} />
          <Route path="guests/:id/edit" element={<GuestForm />} />
          
          {/* StayLog Routes */}
          <Route path="staylogs" element={<StayLogList />} />
          <Route path="staylogs/new" element={<StayLogForm />} />
          <Route path="staylogs/:id" element={<StayLogDetail />} />
          <Route path="staylogs/:id/edit" element={<StayLogForm />} />
          
          {/* Payment Routes */}
          <Route path="payments" element={<PaymentList />} />
          <Route path="payments/new" element={<PaymentForm />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="payments/:id/edit" element={<PaymentForm />} />
          
          {/* Not Found */}
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 