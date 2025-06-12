import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { useAuth } from './useAuth';

type QRCode = Database['public']['Tables']['qr_codes']['Row'];
type QRCodeInsert = Database['public']['Tables']['qr_codes']['Insert'];
type QRCodeUpdate = Database['public']['Tables']['qr_codes']['Update'];

export function useQRCodes() {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        // This part is for when no user is logged in. 
        // We will assume for now that saving requires a user.
        query = query.is('user_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      setQRCodes(data || []);

    } catch (err) {
      console.error('Error fetching QR codes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  };

  const createQRCode = async (qrCodeData: Omit<QRCodeInsert, 'user_id'>) => {
    try {
      setError(null);
      const insertData: QRCodeInsert = { ...qrCodeData, user_id: user?.id || null };

      const { data, error } = await supabase
        .from('qr_codes')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // ---- THIS IS THE FIX ----
      // Instead of manually adding the new item to the list,
      // we will refetch the entire list from the database.
      // This guarantees the UI is perfectly in sync.
      await fetchQRCodes(); 
      
      return { data, error: null };
    } catch (err) {
      console.error('Error creating QR code:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create QR code';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const updateQRCode = async (id: string, updates: QRCodeUpdate) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('qr_codes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      
      // Also refetch after update for consistency
      await fetchQRCodes();
      return { data, error: null };

    } catch (err) {
      console.error('Error updating QR code:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update QR code';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const deleteQRCode = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase.from('qr_codes').delete().eq('id', id);
      if (error) throw error;

      // Also refetch after delete
      await fetchQRCodes();
      return { error: null };
      
    } catch (err) {
      console.error('Error deleting QR code:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete QR code';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, [user]);

  return {
    qrCodes,
    loading,
    error,
    createQRCode,
    updateQRCode,
    deleteQRCode,
    refetch: fetchQRCodes,
  };
}