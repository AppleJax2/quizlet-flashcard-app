import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <TopNavbar />

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
} 