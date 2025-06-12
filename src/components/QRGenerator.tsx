import React, { useState } from 'react';
import { Link, Download, AlertCircle, CheckCircle, Copy, Sparkles, User, Phone, FileText, QrCode as QrCodeIcon, Save } from 'lucide-react';
import { generateQRCode, downloadQRCode, isValidUrl, formatUrl } from '../utils/qrUtils';
import { useQRCodesContext } from '../context/QRCodesContext';
import { useAuth } from '../hooks/useAuth';

const QRGenerator: React.FC = () => {
  const [url, setUrl] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [label, setLabel] = useState('');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { createQRCode } = useQRCodesContext();
  const { user } = useAuth();

  const handleGenerateQR = async () => {
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    const formattedUrl = formatUrl(url.trim());
    if (!isValidUrl(formattedUrl)) {
      setError('Please enter a valid URL');
      return;
    }
    if (!contactName.trim() || !phoneNumber.trim()) {
      setError('Please enter both name and phone number');
      return;
    }

    setIsLoading(true);
    try {
      const dataUrl = await generateQRCode(formattedUrl);
      setQrCodeDataUrl(dataUrl);
      setUrl(formattedUrl);
      setShowSaveForm(false);
      setLabel('');
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    const labelToSave = label.trim() || contactName.trim();
    
    const { error: saveError } = await createQRCode({
      url,
      label: labelToSave,
      qr_code_data_url: qrCodeDataUrl,
      qr_type: 'contact',
      contact_name: contactName.trim(),
      phone_number: phoneNumber.trim(),
    });

    if (saveError) {
      setError(saveError);
      return;
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setLabel('');
      setShowSaveForm(false);
      setUrl('');
      setContactName('');
      setPhoneNumber('');
      setQrCodeDataUrl('');
      setError('');
      setSaveSuccess(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (qrCodeDataUrl) {
      const defaultLabel = label.trim() || contactName.trim();
      const filename = defaultLabel ? `${defaultLabel.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qrcode.png` : 'qrcode.png';
      downloadQRCode(qrCodeDataUrl, filename);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="space-y-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Link className="h-5 w-5 text-gray-400" /></div>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-website.com (QR will point here)" className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" disabled={isLoading}/>
            {url && (<button onClick={copyToClipboard} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-500" title="Copy URL">{copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}</button>)}
          </div>
          <div className="space-y-4 bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-3"><strong>Note:</strong> Contact details below will be saved for PDF export.</div>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div><input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full Name" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" disabled={isLoading}/></div>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-400" /></div><input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number (can be comma-separated)" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" disabled={isLoading}/></div>
          </div>
          <button onClick={handleGenerateQR} disabled={isLoading || !url.trim() || !contactName.trim() || !phoneNumber.trim()} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Generating...</>) : (<><QrCodeIcon className="h-4 w-4" />Generate QR Code</>)}
          </button>
        </div>

        {!user && !qrCodeDataUrl && (<div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-center gap-2 text-amber-800 text-sm"><Sparkles className="h-4 w-4" /><span>Sign in to save your QR codes to the cloud!</span></div>)}
        {error && (<div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200 mb-6"><AlertCircle className="h-4 w-4 flex-shrink-0" /><span className="text-sm">{error}</span></div>)}
        {saveSuccess && (<div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200 mb-6"><CheckCircle className="h-4 w-4 flex-shrink-0" /><span className="text-sm">QR code saved successfully!</span></div>)}

        {qrCodeDataUrl && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-block p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <img src={qrCodeDataUrl} alt="Generated QR Code" className="w-48 h-48 mx-auto" />
                <p className="text-sm text-gray-600 mt-3">QR Code points to: <span className="font-medium">{url}</span></p>
              </div>
            </div>
            <div className="space-y-4">
              {!showSaveForm && (
                <div className="flex gap-2">
                  <button onClick={() => setShowSaveForm(true)} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"><Save className="h-4 w-4" />Save</button>
                  <button onClick={handleDownload} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700"><Download className="h-4 w-4" />Download PNG</button>
                </div>
              )}
              {showSaveForm && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2"><FileText className="h-4 w-4 text-gray-600" /><h3 className="font-medium text-gray-900">Save QR Code</h3></div>
                  <div>
                    <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Enter an optional label" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" autoFocus/>
                    <p className="text-xs text-gray-500 mt-1 pl-1">If left blank, the contact's name will be used.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">{user ? 'Save to Cloud' : 'Save Locally'}</button>
                    <button onClick={handleDownload} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700"><Download className="h-4 w-4" />PNG</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;