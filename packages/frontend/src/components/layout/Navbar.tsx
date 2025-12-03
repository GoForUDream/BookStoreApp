import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  InputBase,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Person,
  Menu as MenuIcon,
  Search,
  Close,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/auth';
import { useCart } from '../../hooks/useCart';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const { cart } = useCart();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/');
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar sx={{ gap: 2 }}>
          <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            Bookstore
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 4 }}>
            <Button component={Link} to="/" color="inherit">Home</Button>
            <Button component={Link} to="/books" color="inherit">Books</Button>
          </Box>

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flex: 1,
              display: { xs: 'none', sm: 'flex' },
              maxWidth: 400,
              mx: 'auto',
              bgcolor: 'pastel.lavender',
              borderRadius: 3,
              px: 2,
            }}
          >
            <InputBase
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, py: 1 }}
            />
            <IconButton type="submit" size="small"><Search /></IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated && (
              <IconButton component={Link} to="/wishlist" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Favorite />
              </IconButton>
            )}

            <IconButton component={Link} to="/cart">
              <Badge badgeContent={cart.itemCount} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user?.firstName?.[0]}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  <MenuItem component={Link} to="/profile" onClick={() => setAnchorEl(null)}>Profile</MenuItem>
                  <MenuItem component={Link} to="/orders" onClick={() => setAnchorEl(null)}>My Orders</MenuItem>
                  {isAdmin && (
                    <MenuItem component={Link} to="/admin" onClick={() => setAnchorEl(null)}>Admin Dashboard</MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                <Button component={Link} to="/login" variant="outlined" size="small">Login</Button>
                <Button component={Link} to="/register" variant="contained" size="small">Sign Up</Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
              Bookstore
            </Typography>
            <IconButton onClick={() => setMobileOpen(false)}><Close /></IconButton>
          </Box>
          <List>
            <ListItem component={Link} to="/" onClick={() => setMobileOpen(false)}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem component={Link} to="/books" onClick={() => setMobileOpen(false)}>
              <ListItemText primary="Books" />
            </ListItem>
            {isAuthenticated ? (
              <>
                <ListItem component={Link} to="/wishlist" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Wishlist" />
                </ListItem>
                <ListItem component={Link} to="/orders" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Orders" />
                </ListItem>
                <ListItem component={Link} to="/profile" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Profile" />
                </ListItem>
                {isAdmin && (
                  <ListItem component={Link} to="/admin" onClick={() => setMobileOpen(false)}>
                    <ListItemText primary="Admin" />
                  </ListItem>
                )}
                <Divider sx={{ my: 1 }} />
                <ListItem onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem component={Link} to="/login" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem component={Link} to="/register" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Sign Up" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
