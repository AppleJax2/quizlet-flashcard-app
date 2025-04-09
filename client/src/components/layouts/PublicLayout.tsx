import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';

/**
 * Layout for public-facing pages like the landing page, pricing, etc.
 * Includes the main navigation header and footer
 */
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout; 