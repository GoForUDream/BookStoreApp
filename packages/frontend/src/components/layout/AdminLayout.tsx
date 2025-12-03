import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, IconButton } from '@mui/material';
import { Dashboard, LibraryBooks, Category, ShoppingCart, People, RateReview, ArrowBack, Logout } from '@mui/icons-material';
import { useAuthStore } from '../../stores/auth';

const DRAWER_WIDTH = 260;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { text: 'Books', icon: <LibraryBooks />, path: '/admin/books' },
  { text: 'Categories', icon: <Category />, path: '/admin/categories' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
  { text: 'Users', icon: <People />, path: '/admin/users' },
  { text: 'Reviews', icon: <RateReview />, path: '/admin/reviews' },
];

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer variant="permanent" sx={{
        width: DRAWER_WIDTH,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: 'white', borderRight: 1, borderColor: 'divider' },
      }}>
        <Box sx={{ p: 3, background: 'linear-gradient(135deg, #e98a9d 0%, #db637c 100%)' }}>
          <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'white' }}>
            Admin Panel
          </Typography>
        </Box>

        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{user?.firstName?.[0]}</Avatar>
          <Box>
            <Typography fontWeight={600}>{user?.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">Administrator</Typography>
          </Box>
        </Box>

        <List sx={{ flex: 1, px: 2, py: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '& .MuiListItemIcon-root': { color: 'white' } },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <ListItemButton component={Link} to="/" sx={{ borderRadius: 2, mb: 1 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><ArrowBack /></ListItemIcon>
            <ListItemText primary="Back to Shop" />
          </ListItemButton>
          <ListItemButton onClick={logout} sx={{ borderRadius: 2, color: 'error.main' }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flex: 1, p: 4, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
