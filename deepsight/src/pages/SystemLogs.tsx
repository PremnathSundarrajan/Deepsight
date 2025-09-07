import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Download, 
  Filter, 
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Database,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Mock data for system logs
const mockLogs = [
  {
    id: 'LOG001',
    timestamp: '2024-08-23T10:30:15Z',
    level: 'INFO',
    component: 'OCR_ENGINE',
    message: 'Successfully processed image detection request',
    userId: 'USR002',
    ipAddress: '192.168.1.45',
    details: 'Image ID: IMG_20240823_103015.jpg, Processing time: 2.3s'
  },
  {
    id: 'LOG002',
    timestamp: '2024-08-23T10:28:42Z',
    level: 'WARNING',
    component: 'DETECTION_MODEL',
    message: 'Low confidence detection result',
    userId: 'USR002',
    ipAddress: '192.168.1.45',
    details: 'Confidence: 45%, Threshold: 50%, Manual review required'
  },
  {
    id: 'LOG003',
    timestamp: '2024-08-23T10:25:33Z',
    level: 'ERROR',
    component: 'DATABASE',
    message: 'Connection timeout while saving detection result',
    userId: 'USR003',
    ipAddress: '192.168.1.67',
    details: 'Retry attempt 3/3 failed, Request ID: REQ_2024_003'
  },
  {
    id: 'LOG004',
    timestamp: '2024-08-23T10:22:18Z',
    level: 'SUCCESS',
    component: 'ALERT_SYSTEM',
    message: 'Unauthorized ad alert sent successfully',
    userId: 'SYSTEM',
    ipAddress: '127.0.0.1',
    details: 'Alert ID: ALT_001, Notification channels: Email, SMS'
  },
  {
    id: 'LOG005',
    timestamp: '2024-08-23T10:20:07Z',
    level: 'INFO',
    component: 'USER_AUTH',
    message: 'User login successful',
    userId: 'USR001',
    ipAddress: '192.168.1.23',
    details: 'Role: admin, Session ID: sess_xyz789'
  },
  {
    id: 'LOG006',
    timestamp: '2024-08-23T10:18:45Z',
    level: 'WARNING',
    component: 'UPLOAD_SERVICE',
    message: 'Large file upload detected',
    userId: 'USR002',
    ipAddress: '192.168.1.45',
    details: 'File size: 15.2MB, Limit: 10MB, Processing may be slow'
  },
  {
    id: 'LOG007',
    timestamp: '2024-08-23T10:15:22Z',
    level: 'ERROR',
    component: 'OCR_ENGINE',
    message: 'Text extraction failed for uploaded image',
    userId: 'USR003',
    ipAddress: '192.168.1.67',
    details: 'Error: Invalid image format, Expected: JPG/PNG'
  },
  {
    id: 'LOG008',
    timestamp: '2024-08-23T10:12:55Z',
    level: 'INFO',
    component: 'SYSTEM',
    message: 'Daily backup completed successfully',
    userId: 'SYSTEM',
    ipAddress: '127.0.0.1',
    details: 'Backup size: 2.4GB, Duration: 12 minutes'
  }
];

export default function SystemLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [componentFilter, setComponentFilter] = useState('all');
  const [logs] = useState(mockLogs);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesComponent = componentFilter === 'all' || log.component === componentFilter;
    
    return matchesSearch && matchesLevel && matchesComponent;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return XCircle;
      case 'WARNING':
        return AlertTriangle;
      case 'SUCCESS':
        return CheckCircle;
      case 'INFO':
      default:
        return Info;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'status-unauthorized';
      case 'WARNING':
        return 'status-pending';
      case 'SUCCESS':
        return 'status-authorized';
      case 'INFO':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getComponentIcon = (component: string) => {
    switch (component) {
      case 'DATABASE':
        return Database;
      case 'USER_AUTH':
        return Shield;
      case 'SYSTEM':
        return Server;
      default:
        return Server;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const errorLogs = logs.filter(log => log.level === 'ERROR').length;
  const warningLogs = logs.filter(log => log.level === 'WARNING').length;
  const infoLogs = logs.filter(log => log.level === 'INFO').length;
  const successLogs = logs.filter(log => log.level === 'SUCCESS').length;

  const uniqueComponents = [...new Set(logs.map(log => log.component))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              System Logs
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor system activities, errors, and performance metrics.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-glow">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Error Logs',
            value: errorLogs,
            icon: XCircle,
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-950'
          },
          {
            title: 'Warning Logs',
            value: warningLogs,
            icon: AlertTriangle,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-950'
          },
          {
            title: 'Info Logs',
            value: infoLogs,
            icon: Info,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950'
          },
          {
            title: 'Success Logs',
            value: successLogs,
            icon: CheckCircle,
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-950'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-primary transition-all duration-300 h-32">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="text-2xl font-bold mt-2 text-foreground">
                      {stat.value}
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search logs by message, component, or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Log Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={componentFilter} onValueChange={setComponentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Component" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Components</SelectItem>
                  {uniqueComponents.map(component => (
                    <SelectItem key={component} value={component}>
                      {component.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>
              Real-time system logs with detailed information and filtering options.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log, index) => {
                    const LevelIcon = getLevelIcon(log.level);
                    const ComponentIcon = getComponentIcon(log.component);
                    return (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-mono">
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <LevelIcon className="w-4 h-4" />
                            <Badge className={getLevelColor(log.level)}>
                              {log.level}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ComponentIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-sm">
                              {log.component.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate">{log.message}</p>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{log.userId}</p>
                            <p className="text-muted-foreground font-mono text-xs">
                              {log.ipAddress}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-sm">
                          <p className="text-sm text-muted-foreground truncate">
                            {log.details}
                          </p>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}