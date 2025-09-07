import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for authorized ads
const mockAuthorizedAds = [
  {
    id: 'AUTH001',
    adText: 'City Tourism Board - Visit Downtown',
    advertiser: 'City Tourism Department',
    category: 'Government',
    dateAuthorized: '2024-08-15',
    expiryDate: '2024-12-31',
    status: 'Active',
    location: 'Downtown District',
    approvedBy: 'Admin Johnson'
  },
  {
    id: 'AUTH002',
    adText: 'Metro Transit - New Bus Routes',
    advertiser: 'Metropolitan Transit Authority',
    category: 'Public Service',
    dateAuthorized: '2024-08-10',
    expiryDate: '2024-11-30',
    status: 'Active',
    location: 'Citywide',
    approvedBy: 'Admin Johnson'
  },
  {
    id: 'AUTH003',
    adText: 'Green Energy Initiative - Solar Program',
    advertiser: 'Environmental Department',
    category: 'Government',
    dateAuthorized: '2024-08-01',
    expiryDate: '2024-10-31',
    status: 'Expiring Soon',
    location: 'Residential Areas',
    approvedBy: 'Admin Smith'
  },
  {
    id: 'AUTH004',
    adText: 'Local Business Association - Shop Local',
    advertiser: 'Chamber of Commerce',
    category: 'Commercial',
    dateAuthorized: '2024-07-20',
    expiryDate: '2024-09-30',
    status: 'Expiring Soon',
    location: 'Business District',
    approvedBy: 'Admin Johnson'
  },
  {
    id: 'AUTH005',
    adText: 'Public Health - Vaccination Drive',
    advertiser: 'Health Department',
    category: 'Public Health',
    dateAuthorized: '2024-08-05',
    expiryDate: '2025-01-15',
    status: 'Active',
    location: 'Healthcare Centers',
    approvedBy: 'Admin Smith'
  }
];

export default function AuthorizedAds() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [authorizedAds] = useState(mockAuthorizedAds);

  const filteredAds = authorizedAds.filter(ad =>
    ad.adText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.advertiser.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-authorized';
      case 'Expiring Soon':
        return 'status-pending';
      case 'Expired':
        return 'status-unauthorized';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return CheckCircle;
      case 'Expiring Soon':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const activeAds = authorizedAds.filter(ad => ad.status === 'Active').length;
  const expiringSoon = authorizedAds.filter(ad => ad.status === 'Expiring Soon').length;
  const totalAds = authorizedAds.length;

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
              Authorized Advertisements
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor approved advertisement content across the city.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-glow">
            <Plus className="w-4 h-4 mr-2" />
            Add New Ad
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Total Authorized',
            value: totalAds,
            icon: Shield,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950'
          },
          {
            title: 'Currently Active',
            value: activeAds,
            icon: CheckCircle,
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-950'
          },
          {
            title: 'Expiring Soon',
            value: expiringSoon,
            icon: AlertCircle,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-950'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-primary transition-all duration-300">
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
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by ad text, advertiser, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Authorized Ads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Authorized Advertisements Database</CardTitle>
            <CardDescription>
              Complete list of approved advertisement content with status and details.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Advertisement Text</TableHead>
                    <TableHead>Advertiser</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAds.map((ad, index) => {
                    const StatusIcon = getStatusIcon(ad.status);
                    return (
                      <motion.tr
                        key={ad.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">{ad.id}</TableCell>
                        <TableCell className="max-w-xs truncate">{ad.adText}</TableCell>
                        <TableCell>{ad.advertiser}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ad.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            <Badge className={getStatusColor(ad.status)}>
                              {ad.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(ad.expiryDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{ad.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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