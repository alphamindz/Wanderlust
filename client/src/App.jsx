import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import SideChatbot from './components/SideChatbot';

import HomePage from './pages/HomePage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <>
      <Toast />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<Navigate to="/" replace />} />
        <Route path="/listings/new" element={<CreateListingPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/listings/:id/edit" element={<EditListingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/properties" element={<DashboardPage />} />
        <Route path="/dashboard/bookings" element={<DashboardPage />} />
        <Route path="/dashboard/trips" element={<DashboardPage />} />
        <Route path="/dashboard/wishlist" element={<DashboardPage />} />
        <Route path="/dashboard/settings" element={<DashboardPage />} />
        <Route path="/my-listings" element={<Navigate to="/dashboard/properties" replace />} />
        <Route path="/my-bookings" element={<Navigate to="/dashboard/trips" replace />} />
        <Route
          path="*"
          element={
            <div
              className="container"
              style={{ padding: '120px 0', textAlign: 'center', flex: 1 }}
            >
              <h1 style={{ fontSize: '3rem', marginBottom: 12 }}>404</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
                We couldn't find the page you're searching for.
              </p>
              <a href="/" className="btn btn-primary">
                Return Home
              </a>
            </div>
          }
        />
      </Routes>
      <Footer />
      <SideChatbot />
    </>
  );
}

export default App;
