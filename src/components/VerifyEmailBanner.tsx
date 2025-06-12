import React, { useState } from 'react';
import { MailWarning, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const VerifyEmailBanner: React.FC = () => {
  const { user, resendConfirmationEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    if (!user || !user.email) return;

    setLoading(true);
    setError('');
    setSent(false);

    const { error } = await resendConfirmationEmail(user.email);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  // Only show the banner if the user is logged in but their email is not confirmed.
  if (!user || user.email_confirmed_at) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MailWarning className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div className="text-sm">
              {sent ? (
                <p className="font-medium text-green-700">
                  Verification email sent! Please check your inbox (and spam folder).
                </p>
              ) : (
                <>
                  <p className="font-medium text-yellow-800">Please verify your email address.</p>
                  <p className="text-yellow-700">Click the link in the email we sent to {user.email}.</p>
                </>
              )}
               {error && <p className="text-red-600 mt-1">{error}</p>}
            </div>
          </div>
          
          {!sent && (
            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full sm:w-auto bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailBanner;