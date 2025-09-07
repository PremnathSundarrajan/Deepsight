// DeepSight Type Definitions

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'officer';
  name: string;
  avatar?: string;
}

export interface Detection {
  id: string;
  image: string;
  text: string;
  confidence: string;
  status: 'Authorized' | 'Unauthorized' | 'Pending';
  timestamp: string;
  boundingBoxes?: BoundingBox[];
  reviewed?: boolean;
  reviewedBy?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  text: string;
  status: 'Authorized' | 'Unauthorized' | 'Pending';
}

export interface Alert {
  id: string;
  detection: Detection;
  type: 'violation' | 'suspicious' | 'info';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  acknowledged?: boolean;
  acknowledgedBy?: string;
}

export interface AuthorizedAd {
  id: string;
  text: string;
  description?: string;
  addedBy: string;
  dateAdded: string;
  expiryDate?: string;
  active: boolean;
}

export interface UploadProgress {
  id: string;
  filename: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface DashboardStats {
  totalDetections: number;
  unauthorizedAds: number;
  detectionRate: number;
  alertsToday: number;
  trendsData: {
    date: string;
    detections: number;
    violations: number;
  }[];
}