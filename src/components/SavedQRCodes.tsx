import React, { useState } from 'react';
import { Search, Download, Trash2, Edit3, ExternalLink, Calendar, Copy, CheckCircle, AlertCircle, Cloud, HardDrive, Archive, Grid3X3, List, FileText, User, Phone, Package } from 'lucide-react';
import { downloadQRCode, exportToPDF, exportAllToPDF } from '../utils/qrUtils';
import { useQRCodesContext } from '../context/QRCodesContext';
import { useAuth } from '../hooks/useAuth';
import type { Database } from '../lib/database.types';

type QRCodeRow = Database['public']['Tables']['qr_codes']['Row'];

const SavedQRCodes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { qrCodes, loading, error, updateQRCode, deleteQRCode } = useQRCodesContext();
  const { user } = useAuth();

  const filteredCodes = qrCodes.filter(code =>
    (code.label?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (code.url?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (code.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (code.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (id: string, currentLabel: string) => {
    setEditingId(id);
    setEditLabel(currentLabel);
  };

  const handleSaveEdit = async () => {
    if (editingId && editLabel.trim()) {
      await updateQRCode(editingId, { label: editLabel.trim() });
      setEditingId(null);
      setEditLabel('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditLabel('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      await deleteQRCode(id);
    }
  };

  const copyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="bg-white rounded-2xl shadow-sm border p-8 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div><p className="mt-4 text-gray-600">Loading QR codes...</p></div>;
  if (error) return <div className="bg-white rounded-2xl shadow-sm border p-8 text-center"><div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"><AlertCircle className="h-5 w-5" /><span>{error}</span></div></div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1"><h2 className="text-xl font-semibold text-gray-900">Your QR Codes</h2>{user ? (<div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"><Cloud className="h-3 w-3" /><span>Cloud</span></div>) : (<div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium"><HardDrive className="h-3 w-3" /><span>Local</span></div>)}</div>
            <p className="text-sm text-gray-600">{qrCodes.length} QR code{qrCodes.length !== 1 ? 's' : ''} saved</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-48" /></div>
            <div className="flex bg-gray-100 rounded-lg p-1"><button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><Grid3X3 className="h-4 w-4" /></button><button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><List className="h-4 w-4" /></button></div>
            <button onClick={() => exportAllToPDF(filteredCodes)} disabled={filteredCodes.length === 0} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50" title="Export all visible codes to PDF"><FileText className="h-4 w-4" /><span>Export All</span></button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {qrCodes.length === 0 ? (
          <div className="text-center py-12"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Archive className="h-8 w-8 text-gray-400" /></div><h3 className="text-xl font-semibold text-gray-900 mb-2">No QR codes yet</h3><p className="text-gray-600">Generate your first QR code to get started.</p></div>
        ) : filteredCodes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No QR codes match your search.</p>
        ) : (
          // --- FIX: THIS IS THE CRUCIAL RENDER LOGIC THAT WAS MISSING ---
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCodes.map((code) => (
                <div key={code.id} className="group bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                  <div className="text-center mb-4"><div className="inline-block p-3 bg-white rounded-lg shadow-sm"><img src={code.qr_code_data_url} alt={`QR Code for ${code.label}`} className="w-24 h-24" /></div></div>
                  <div className="space-y-3">
                    {editingId === code.id ? (
                      <div className="space-y-2">
                        <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" autoFocus />
                        <div className="flex gap-2"><button onClick={handleSaveEdit} className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">Save</button><button onClick={handleCancelEdit} className="flex-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm">Cancel</button></div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{code.label}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2"><Calendar className="h-3 w-3" /><span>{formatDate(code.created_at)}</span></div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-blue-600"><ExternalLink className="h-3 w-3" /><span className="truncate">{code.url}</span></div>
                          <div className="flex items-center gap-2 text-xs text-purple-600"><User className="h-3 w-3" /><span>{code.contact_name}</span></div>
                          <div className="flex items-center gap-2 text-xs text-purple-600"><Phone className="h-3 w-3" /><span>{code.phone_number}</span></div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2">
                      <button onClick={() => copyUrl(code.url, code.id)} className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-xs">{copiedId === code.id ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
                      <button onClick={() => downloadQRCode(code.qr_code_data_url, `${code.label}_qrcode.png`)} className="flex-1 flex items-center justify-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg text-xs"><Download className="h-4 w-4" /></button>
                      <button onClick={() => handleEdit(code.id, code.label)} className="flex-1 flex items-center justify-center bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-lg text-xs"><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(code.id)} className="flex-1 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg text-xs"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCodes.map((code) => (
                <div key={code.id} className="group bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-center gap-4">{/* List Item Content */}</div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SavedQRCodes;