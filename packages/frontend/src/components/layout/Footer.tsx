import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'white', borderTop: 1, borderColor: 'divider', mt: 'auto', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'primary.main', mb: 2 }}>
              Bookstore
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Your destination for the best books at great prices.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[Facebook, Twitter, Instagram, YouTube].map((Icon, i) => (
                <IconButton key={i} size="small" sx={{ bgcolor: 'pastel.lavender' }}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography fontWeight={600} gutterBottom>Quick Links</Typography>
            {['Home', 'Books', 'About Us'].map((link) => (
              <Typography key={link} component={Link} to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`}
                color="text.secondary" display="block" sx={{ textDecoration: 'none', mb: 1, '&:hover': { color: 'primary.main' } }}>
                {link}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography fontWeight={600} gutterBottom>Support</Typography>
            {['Contact', 'FAQ', 'Shipping'].map((link) => (
              <Typography key={link} color="text.secondary" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                {link}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography fontWeight={600} gutterBottom>Contact Us</Typography>
            <Typography color="text.secondary">123 Book Street, Reading City</Typography>
            <Typography color="text.secondary">contact@bookstore.com</Typography>
            <Typography color="text.secondary">+1 234 567 890</Typography>
          </Grid>
        </Grid>
        <Typography color="text.secondary" textAlign="center" sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          © {new Date().getFullYear()} Bookstore. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
