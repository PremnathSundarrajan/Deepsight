import { 
  LayoutDashboard, 
  Upload, 
  AlertTriangle, 
  Settings, 
  Shield,
  BarChart3,
  Database,
  Users
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const navigationItems = [
  { 
    title: 'Dashboard', 
    url: '/', 
    icon: LayoutDashboard,
    roles: ['admin', 'officer']
  },
  { 
    title: 'Upload & Detect', 
    url: '/upload', 
    icon: Upload,
    roles: ['admin', 'officer']
  },
  { 
    title: 'Alerts', 
    url: '/alerts', 
    icon: AlertTriangle,
    badge: 3,
    roles: ['admin', 'officer']
  },
  { 
    title: 'Detection Results', 
    url: '/results', 
    icon: BarChart3,
    roles: ['admin', 'officer']
  },
  { 
    title: 'Authorized Ads', 
    url: '/authorized-ads', 
    icon: Shield,
    roles: ['admin']
  },
  { 
    title: 'User Management', 
    url: '/users', 
    icon: Users,
    roles: ['admin']
  },
  { 
    title: 'System Logs', 
    url: '/logs', 
    icon: Database,
    roles: ['admin']
  },
  { 
    title: 'Settings', 
    url: '/settings', 
    icon: Settings,
    roles: ['admin', 'officer']
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  if (!user) return null;

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-r">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    ease: 'easeOut'
                  }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild
                      className={`
                        transition-all duration-200 group
                        ${isActive(item.url) 
                          ? 'bg-sidebar-accent text-sidebar-primary font-medium shadow-sm' 
                          : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                        }
                      `}
                    >
                      <NavLink to={item.url} end={item.url === '/'}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center w-full"
                        >
                          <item.icon className={`
                            h-5 w-5 transition-colors
                            ${isActive(item.url) 
                              ? 'text-sidebar-primary' 
                              : 'text-sidebar-foreground group-hover:text-sidebar-primary'
                            }
                          `} />
                          {!isCollapsed && (
                            <>
                              <span className="ml-3 flex-1">{item.title}</span>
                              {item.badge && (
                                <Badge 
                                  variant="destructive" 
                                  className="ml-auto h-5 px-2 text-xs"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </motion.div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role Badge */}
        {!isCollapsed && (
          <motion.div
            className="absolute bottom-6 left-4 right-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="glass-card p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Signed in as</p>
              <Badge 
                variant={user.role === 'admin' ? 'default' : 'secondary'}
                className="capitalize bg-teal-700 text-white"
              >
                {user.role}
              </Badge>
            </div>
          </motion.div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}