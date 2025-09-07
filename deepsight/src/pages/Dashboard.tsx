import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardStats, Detection } from '@/types';
import { api, mockDetections } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';

const statsCards = [
  {
    title: 'Total Detections',
    key: 'totalDetections' as keyof DashboardStats,
    icon: Eye,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  {
    title: 'Unauthorized Ads',
    key: 'unauthorizedAds' as keyof DashboardStats,
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950'
  },
  {
    title: 'Detection Rate',
    key: 'detectionRate' as keyof DashboardStats,
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
    suffix: '%'
  },
  {
    title: 'Alerts Today',
    key: 'alertsToday' as keyof DashboardStats,
    icon: Shield,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950'
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, detectionsData] = await Promise.all([
          api.getDashboardStats(),
          api.getDetections()
        ]);
        
        setStats(statsData);
        setRecentDetections(detectionsData.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to mock data
        setRecentDetections(mockDetections.slice(0, 5));
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusColor = (status: Detection['status']) => {
    switch (status) {
      case 'Authorized':
        return 'status-authorized';
      case 'Unauthorized':
        return 'status-unauthorized';
      case 'Pending':
        return 'status-pending';
      default:
        return 'bg-muted';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening with urban enforcement today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const value = stats?.[card.key] || 0;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="shadow-card hover:shadow-primary transition-all duration-300 h-full flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {card.title}
                      </p>
                      <div className="text-2xl font-bold mt-2 text-foreground">
                        {typeof value === 'number' 
                          ? value.toLocaleString() + (card.suffix || '')
                          : String(value) + (card.suffix || '')
                        }
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${card.bgColor}`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detection Rate Graph */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="w-5 h-5" />
                Detection Rate Progress
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Current system detection accuracy: {stats.detectionRate}%
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Progress 
                value={typeof stats.detectionRate === 'number' ? stats.detectionRate : 0} 
                className="h-4"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">0%</span>
                <span className="text-sm font-medium text-foreground">
                  {stats.detectionRate}%
                </span>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Detections */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Detections
              </CardTitle>
              <CardDescription>
                Latest advertisement detections and analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDetections.map((detection, index) => (
                <motion.div
                  key={detection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg glass-card hover:shadow-glass transition-all duration-300"
                >
                  <img
                    src={detection.image}
                    alt="Detection"
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getStatusColor(detection.status)}>
                        {detection.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {detection.confidence}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {detection.text}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(detection.timestamp)}
                      </span>
                      {detection.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {detection.location.address}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Status
              </CardTitle>
              <CardDescription>
                Real-time monitoring and health checks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'OCR Engine', status: 'operational', uptime: '99.9%' },
                { name: 'Detection Model', status: 'operational', uptime: '99.7%' },
                { name: 'Database', status: 'operational', uptime: '100%' },
                { name: 'Alert System', status: 'operational', uptime: '99.8%' },
              ].map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg glass-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      {service.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {service.uptime} uptime
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}