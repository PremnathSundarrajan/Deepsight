import { Detection, Alert, DashboardStats, AuthorizedAd } from '@/types';

export const mockDetections: Detection[] = [
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
    id: 'B456',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    text: 'City Tourism Board - Visit NYC',
    confidence: '89%',
    status: 'Authorized',
    timestamp: '2025-08-22T13:22:00Z',
    boundingBoxes: [
      {
        id: 'bb2',
        x: 200,
        y: 100,
        width: 400,
        height: 200,
        confidence: 0.89,
        text: 'City Tourism Board - Visit NYC',
        status: 'Authorized'
      }
    ],
    reviewed: true,
    reviewedBy: 'Sarah Chen'
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

export const mockAlerts: Alert[] = [
  {
    id: 'alert1',
    detection: mockDetections[0],
    type: 'violation',
    priority: 'high',
    timestamp: '2025-08-22T14:35:00Z'
  },
  {
    id: 'alert2',
    detection: mockDetections[2],
    type: 'violation',
    priority: 'high',
    timestamp: '2025-08-22T12:15:00Z'
  },
  {
    id: 'alert3',
    detection: mockDetections[3],
    type: 'suspicious',
    priority: 'medium',
    timestamp: '2025-08-22T11:45:00Z'
  }
];

export const mockAuthorizedAds: AuthorizedAd[] = [
  {
    id: 'auth1',
    text: 'City Tourism Board - Visit NYC',
    description: 'Official NYC tourism campaign',
    addedBy: 'Sarah Chen',
    dateAdded: '2025-08-01T09:00:00Z',
    expiryDate: '2025-12-31T23:59:59Z',
    active: true
  },
  {
    id: 'auth2',
    text: 'Public Health Safety Notice',
    description: 'COVID-19 safety guidelines',
    addedBy: 'Marcus Rodriguez',
    dateAdded: '2025-07-15T10:30:00Z',
    active: true
  },
  {
    id: 'auth3',
    text: 'Metro Transit Schedule Update',
    description: 'Updated subway schedules',
    addedBy: 'Sarah Chen',
    dateAdded: '2025-08-10T14:00:00Z',
    expiryDate: '2025-09-30T23:59:59Z',
    active: true
  }
];

export const mockDashboardStats: DashboardStats = {
  totalDetections: 247,
  unauthorizedAds: 43,
  detectionRate: 87.3,
  alertsToday: 8,
  trendsData: [
    { date: '2025-08-15', detections: 23, violations: 4 },
    { date: '2025-08-16', detections: 31, violations: 7 },
    { date: '2025-08-17', detections: 28, violations: 5 },
    { date: '2025-08-18', detections: 35, violations: 9 },
    { date: '2025-08-19', detections: 29, violations: 6 },
    { date: '2025-08-20', detections: 42, violations: 12 },
    { date: '2025-08-21', detections: 38, violations: 8 },
    { date: '2025-08-22', detections: 21, violations: 3 }
  ]
};

// Simulated API functions
export const api = {
  uploadImage: async (file: File): Promise<Detection> => {
    // Simulate upload delay
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
    
    return mockResult;
  },
  
  getDetections: async (): Promise<Detection[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDetections;
  },
  
  getAlerts: async (): Promise<Alert[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAlerts;
  },
  
  getDashboardStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockDashboardStats;
  }
};