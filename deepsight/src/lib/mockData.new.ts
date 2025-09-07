import { Detection, Alert, DashboardStats, AuthorizedAd } from '@/types';

// Initial mock data
const initialDetections: Detection[] = [
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
  }
];

// Storage for dynamic data
let detections = [...initialDetections];
let alerts: Alert[] = [];
let authorizedAds: AuthorizedAd[] = [];
let results: Array<{ id: string; detection: Detection; result: string; timestamp: string }> = [];

// Mock API with improved functionality
export const api = {
  uploadImage: async (file: File): Promise<Detection> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: Math.random().toString(36).slice(2),
      image: URL.createObjectURL(file),
      text: `Sample text from ${file.name}`,
      confidence: '85%',
      status: 'Pending',
      timestamp: new Date().toISOString(),
      boundingBoxes: [
        {
          id: 'bb' + Math.random().toString(36).slice(2),
          x: 100,
          y: 100,
          width: 200,
          height: 100,
          confidence: 0.85,
          text: `Sample text from ${file.name}`,
          status: 'Pending'
        }
      ]
    };
  },

  getDetections: async (): Promise<Detection[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return detections;
  },

  getAlerts: async (): Promise<Alert[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return alerts;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const stats: DashboardStats = {
      totalDetections: detections.length,
      unauthorizedAds: alerts.length,
      detectionRate: 85,
      alertsToday: alerts.filter(a => 
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
    authorizedAds.push(ad);
    // Also add to detections for consistency
    detections.push({
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
    alerts.push(alert);
    // Add detection to list
    detections.push(alert.detection);
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  addDetectionResult: async (result: { id: string; detection: Detection; result: string; timestamp: string }): Promise<void> => {
    results.push(result);
    // Add detection to list
    detections.push(result.detection);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};
