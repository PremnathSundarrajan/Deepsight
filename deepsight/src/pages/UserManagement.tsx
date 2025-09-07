import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Shield,
  ShieldCheck,
  Clock,
  Mail,
  Phone
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Mock data for users
const mockUsers = [
  {
    id: 'USR001',
    name: 'Admin Johnson',
    email: 'admin.johnson@deepsight.gov',
    role: 'admin',
    status: 'Active',
    lastLogin: '2024-08-23T10:30:00Z',
    dateCreated: '2024-01-15',
    phone: '+1 (555) 123-4567',
    department: 'IT Administration',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 'USR002',
    name: 'Officer Sarah Chen',
    email: 's.chen@deepsight.gov',
    role: 'officer',
    status: 'Active',
    lastLogin: '2024-08-23T09:15:00Z',
    dateCreated: '2024-02-20',
    phone: '+1 (555) 234-5678',
    department: 'Urban Enforcement',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 'USR003',
    name: 'Officer Mike Rodriguez',
    email: 'm.rodriguez@deepsight.gov',
    role: 'officer',
    status: 'Active',
    lastLogin: '2024-08-22T16:45:00Z',
    dateCreated: '2024-03-10',
    phone: '+1 (555) 345-6789',
    department: 'Urban Enforcement',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 'USR004',
    name: 'Admin Lisa Park',
    email: 'l.park@deepsight.gov',
    role: 'admin',
    status: 'Active',
    lastLogin: '2024-08-23T08:20:00Z',
    dateCreated: '2024-01-30',
    phone: '+1 (555) 456-7890',
    department: 'System Administration',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 'USR005',
    name: 'Officer Tom Wilson',
    email: 't.wilson@deepsight.gov',
    role: 'officer',
    status: 'Inactive',
    lastLogin: '2024-08-15T14:30:00Z',
    dateCreated: '2024-04-05',
    phone: '+1 (555) 567-8901',
    department: 'Urban Enforcement',
    avatar: '/api/placeholder/40/40'
  }
];

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState(mockUsers);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-authorized';
      case 'Inactive':
        return 'status-unauthorized';
      case 'Pending':
        return 'status-pending';
      default:
        return 'bg-muted';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-primary text-primary-foreground';
      case 'officer':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatLastLogin = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'Active').length;
  const adminUsers = users.filter(user => user.role === 'admin').length;
  const officerUsers = users.filter(user => user.role === 'officer').length;

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
              User Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage system users, roles, and access permissions.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-glow">
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Users',
            value: totalUsers,
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950'
          },
          {
            title: 'Active Users',
            value: activeUsers,
            icon: ShieldCheck,
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-950'
          },
          {
            title: 'Administrators',
            value: adminUsers,
            icon: Shield,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-950'
          },
          {
            title: 'Officers',
            value: officerUsers,
            icon: Users,
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
              Search Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>
              Manage user accounts, roles, and system access.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {formatLastLogin(user.lastLogin)}
                        </div>
                      </TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}