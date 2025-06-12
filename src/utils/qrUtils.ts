import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CellHookData } from 'jspdf-autotable';
import type { Database } from '../lib/database.types';

type QRCodeRow = Database['public']['Tables']['qr_codes']['Row'];

// Unchanged functions...
export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text, { width: 300, margin: 2, errorCorrectionLevel: 'M' });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const downloadQRCode = (dataUrl: string, filename: string = 'qrcode.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (qrCode: QRCodeRow) => {
  const pdf = new jsPDF();
  // ... code for single export ...
  pdf.save(`${qrCode.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qrcode.pdf`);
};

export const isValidUrl = (string: string): boolean => {
  try { new URL(string); return true; } catch (_) { return false; }
};

export const formatUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) { return `https://${url}`; }
  return url;
};

// CORRECTED "EXPORT ALL" FUNCTION
export const exportAllToPDF = (codes: QRCodeRow[]) => {
  if (!codes || codes.length === 0) {
    console.warn('Export All cancelled: No codes to export.');
    return;
  }

  const doc = new jsPDF();

  const tableData = codes.map(code => {
    const phoneNumbers = code.phone_number?.split(',').map(p => p.trim()).join('\n') || '-----';
    const contactName = code.contact_name || code.label || 'N/A';
    const textContent = `Name: ${contactName}\nPh no: ${phoneNumbers}`;
    return { rawCode: code, displayText: textContent };
  });

  const pairedData = [];
  for (let i = 0; i < tableData.length; i += 2) {
    pairedData.push([
      tableData[i], 
      tableData[i + 1] ? tableData[i + 1] : null 
    ]);
  }

  autoTable(doc, {
    body: pairedData as any,
    theme: 'grid',
    startY: 10,
    // --- FIX 2: Add a margin to ensure the table fits on the page ---
    margin: { left: 10, right: 10 },
    rowPageBreak: 'avoid',
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90 } }, // Slightly reduced width
    // --- FIX 1: Move minCellHeight into a 'styles' object ---
    styles: {
      minCellHeight: 45,
    },
    didDrawCell: (data: CellHookData) => {
      if (data.cell.raw === null) return; 

      const cellContent = data.cell.raw as { rawCode: QRCodeRow, displayText: string };
      const { rawCode, displayText } = cellContent;
      
      const qrSize = 40;
      const textStartX = data.cell.x + qrSize + 5;

      doc.setFontSize(10);
      doc.text(displayText, textStartX, data.cell.y + 10);
      
      try {
        if (rawCode.qr_code_data_url && typeof rawCode.qr_code_data_url === 'string' && rawCode.qr_code_data_url.startsWith('data:image')) {
          doc.addImage(rawCode.qr_code_data_url, 'PNG', data.cell.x + 2, data.cell.y + 2, qrSize, qrSize);
        } else {
          throw new Error('Invalid or missing QR code data URL.');
        }
      } catch (error) {
        console.error(`PDF Export Error: Could not add image for QR Code with label "${rawCode.label}".`, error);
        doc.setFontSize(8);
        doc.text('Image\nError', data.cell.x + 15, data.cell.y + 20);
      }
    },
  });

  doc.save('all_qr_codes.pdf');
};