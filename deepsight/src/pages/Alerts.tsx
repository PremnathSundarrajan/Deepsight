import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Eye,
  Filter,
  Search,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert } from '@/types';
import { api, mockAlerts } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Alerts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const alertsData = await api.getAlerts();
        setAlerts(alertsData);
        setFilteredAlerts(alertsData);
      } catch (error) {
        console.error('Failed to load alerts:', error);
        setAlerts(mockAlerts);
        setFilteredAlerts(mockAlerts);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, []);

  useEffect(() => {
    let filtered = alerts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.detection.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.detection.location?.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.priority === priorityFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.type === typeFilter);
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchQuery, priorityFilter, typeFilter]);

  const acknowledgeAlert = (alertId: string) => {
    if (user?.role !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'Only administrators can acknowledge alerts.'
      });
      return;
    }

    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true, acknowledgedBy: user.name }
        : alert
    ));

    toast({
      title: 'Alert Acknowledged',
      description: 'The alert has been marked as reviewed.'
    });
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'violation':
        return <AlertTriangle className="w-4 h-4" />;
      case 'suspicious':
        return <Eye className="w-4 h-4" />;
      case 'info':
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return alertTime.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Alert Center</h1>
            <p className="text-muted-foreground">
              Monitor and respond to security alerts
            </p>
          </div>
        </div>
        <Badge variant="destructive" className="text-sm">
          {filteredAlerts.filter(a => !a.acknowledged).length} Active
        </Badge>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="violation">Violations</SelectItem>
                    <SelectItem value="suspicious">Suspicious</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setPriorityFilter('all');
                    setTypeFilter('all');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No alerts found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later.
              </p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <Card className={`
                  shadow-card transition-all duration-300 hover:shadow-glass
                  ${alert.acknowledged ? 'opacity-60' : 'shadow-primary/10'}
                `}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Alert Header */}
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            alert.priority === 'high' 
                              ? 'bg-red-100 dark:bg-red-900' 
                              : alert.priority === 'medium' 
                              ? 'bg-yellow-100 dark:bg-yellow-900'
                              : 'bg-blue-100 dark:bg-blue-900'
                          }`}>
                            {getTypeIcon(alert.type)}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {alert.type}
                            </Badge>
                            {alert.acknowledged && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Reviewed
                              </Badge>
                            )}
                          </div>
                          
                          <span className="text-sm text-muted-foreground ml-auto">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                        </div>

                        {/* Detection Details */}
                        <div className="flex gap-4">
                          <img
                            src={alert.detection.image}
                            alt="Detection"
                            className="w-20 h-20 rounded object-cover"
                          />
                          
                          <div className="flex-1 space-y-2">
                            <h3 className="font-medium">
                              {alert.detection.text}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {alert.detection.confidence} confidence
                              </span>
                              
                              {alert.detection.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {alert.detection.location.address}
                                </span>
                              )}
                              
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(alert.detection.timestamp).toLocaleTimeString()}
                              </span>
                            </div>

                            {alert.acknowledgedBy && (
                              <p className="text-sm text-muted-foreground">
                                Reviewed by {alert.acknowledgedBy}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        {!alert.acknowledged && user?.role === 'admin' && (
                          <Button
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="whitespace-nowrap"
                          >
                            Mark Reviewed
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}