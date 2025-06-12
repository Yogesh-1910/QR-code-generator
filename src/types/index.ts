export interface SavedQRCode {
  id: string;
  url: string;
  label: string;
  qrCodeDataUrl: string;
  createdAt: string;
}

export interface QRCodeGeneratorProps {
  onQRGenerated: (url: string, qrCodeDataUrl: string) => void;
}

export interface SavedQRCodesProps {
  savedCodes: SavedQRCode[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newLabel: string) => void;
}