import React from 'react';
import Header from './components/Header';
import QRGenerator from './components/QRGenerator';
import SavedQRCodes from './components/SavedQRCodes';
import Footer from './components/Footer';
import VerifyEmailBanner from './components/VerifyEmailBanner'; // <-- Import the new component

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <VerifyEmailBanner /> {/* <-- Add the banner here */}
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* QR Generator Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate QR Code</h2>
            <p className="text-gray-600">
              Create QR codes for websites or contact information
            </p>
          </div>
          <QRGenerator />
        </section>

        {/* Saved QR Codes Section */}
        <section>
          <SavedQRCodes />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;