import React, { useState } from 'react';
import { QrCode, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
             {/*<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <QrCode className="h-6 w-6 text-white" />
              </div>*/}
              <div>
                <h1 className="text-xl font-bold text-gray-900">QR Generator Pro</h1>
                <p className="text-sm text-gray-500">Create & manage QR codes</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        <div className="text-xs text-gray-500">Signed in</div>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Sign In</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Header;