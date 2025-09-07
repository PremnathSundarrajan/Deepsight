import { Detection, Alert, DashboardStats, AuthorizedAd } from '@/types';

// Initial mock data
export const initialDetections: Detection[] = [
  {
    id: 'A123',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    text: 'Unauthorized Fast Food Advertisement',
    confidence: '92%',
    status: 'Unauthorized',
    timestamp: '2025-08-22T14:35:00Z',
    boundingBoxes: [
      {
        id: 'bb1',
        x: 120,
        y: 80,
        width: 300,
        height: 150,
        confidence: 0.92,
        text: 'Unauthorized Fast Food Advertisement',
        status: 'Unauthorized'
      }
    ],
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '5th Avenue, Manhattan, NY'
    }
  },
  {
    id: 'C789',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop',
    text: 'Crypto Investment Scam Alert',
    confidence: '96%',
    status: 'Unauthorized',
    timestamp: '2025-08-22T12:15:00Z',
    boundingBoxes: [
      {
        id: 'bb3',
        x: 50,
        y: 50,
        width: 500,
        height: 300,
        confidence: 0.96,
        text: 'Crypto Investment Scam Alert',
        status: 'Unauthorized'
      }
    ]
  },
  {
    id: 'D012',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop',
    text: 'Public Health Safety Notice',
    confidence: '85%',
    status: 'Pending',
    timestamp: '2025-08-22T11:45:00Z',
    boundingBoxes: [
      {
        id: 'bb4',
        x: 100,
        y: 120,
        width: 350,
        height: 180,
        confidence: 0.85,
        text: 'Public Health Safety Notice',
        status: 'Pending'
      }
    ]
  }
];

// Mock Data Store
const data = {
  detections: [...initialDetections],
  alerts: [] as Alert[],
  authorizedAds: [] as AuthorizedAd[],
  results: [] as Array<{ id: string; detection: Detection; result: string; timestamp: string }>
};

// Mock API Implementation
export const api = {
  uploadImage: async (file: File): Promise<Detection> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock detection result
    const mockResult: Detection = {
      id: `det_${Date.now()}`,
      image: URL.createObjectURL(file),
      text: 'Detected Advertisement Text',
      confidence: `${Math.floor(Math.random() * 20 + 75)}%`,
      status: Math.random() > 0.7 ? 'Unauthorized' : 'Authorized',
      timestamp: new Date().toISOString(),
      boundingBoxes: [
        {
          id: `bb_${Date.now()}`,
          x: Math.floor(Math.random() * 100 + 50),
          y: Math.floor(Math.random() * 100 + 50),
          width: Math.floor(Math.random() * 200 + 200),
          height: Math.floor(Math.random() * 100 + 100),
          confidence: Math.random() * 0.3 + 0.7,
          text: 'Detected Advertisement Text',
          status: Math.random() > 0.7 ? 'Unauthorized' : 'Authorized'
        }
      ]
    };
    
    data.detections.push(mockResult);
    return mockResult;
  },

  getDetections: async (): Promise<Detection[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return data.detections;
  },

  getAlerts: async (): Promise<Alert[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return data.alerts;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const stats: DashboardStats = {
      totalDetections: data.detections.length,
      unauthorizedAds: data.alerts.length,
      detectionRate: 85,
      alertsToday: data.alerts.filter(a => 
        new Date(a.timestamp).toDateString() === new Date().toDateString()
      ).length,
      trendsData: [
        { date: '2025-08-20', detections: 12, violations: 3 },
        { date: '2025-08-21', detections: 15, violations: 4 },
        { date: '2025-08-22', detections: 10, violations: 2 }
      ]
    };
    await new Promise(resolve => setTimeout(resolve, 400));
    return stats;
  },

  addAuthorizedAd: async (ad: AuthorizedAd): Promise<void> => {
    data.authorizedAds.push(ad);
    // Also add to detections for consistency
    data.detections.push({
      id: ad.id,
      text: ad.text,
      image: 'https://picsum.photos/800/600', // Placeholder image
      confidence: '100%',
      status: 'Authorized',
      timestamp: ad.dateAdded
    });
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  addAlert: async (alert: Alert): Promise<void> => {
    data.alerts.push(alert);
    // Add detection to list if not already present
    if (!data.detections.some(d => d.id === alert.detection.id)) {
      data.detections.push(alert.detection);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  addDetectionResult: async (result: { id: string; detection: Detection; result: string; timestamp: string }): Promise<void> => {
    data.results.push(result);
    // Add detection to list if not already present
    if (!data.detections.some(d => d.id === result.detection.id)) {
      data.detections.push(result.detection);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};