import { Link } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, Button, IconButton, Divider } from '@mui/material';
import { Add, Remove, Delete, ShoppingBag } from '@mui/icons-material';
import { useCart } from '../../hooks/useCart';
import { useAuthStore } from '../../stores/auth';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuthStore();
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);

  if (cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Add some books to get started!</Typography>
        <Button component={Link} to="/books" variant="contained" size="large">Start Shopping</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>Shopping Cart</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cart.items.map((item) => (
              <Card key={item.id} sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box component={Link} to={`/books/${item.book.slug}`} sx={{ width: 80, height: 100, bgcolor: 'pastel.lavender', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={item.book.coverImage} alt={item.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography component={Link} to={`/books/${item.book.slug}`} fontWeight={600} sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>{item.book.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.book.author}</Typography>
                  <Typography color="primary.main" fontWeight={600}>${item.book.price.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <IconButton size="small" onClick={() => updateQuantity(item.book.id, item.quantity - 1)} disabled={item.quantity <= 1}><Remove fontSize="small" /></IconButton>
                  <Typography sx={{ px: 2, minWidth: 32, textAlign: 'center' }}>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => updateQuantity(item.book.id, item.quantity + 1)} disabled={item.quantity >= item.book.stock}><Add fontSize="small" /></IconButton>
                </Box>
                <Typography fontWeight={600} sx={{ minWidth: 70, textAlign: 'right' }}>${item.subtotal.toFixed(2)}</Typography>
                <IconButton color="error" onClick={() => removeFromCart(item.book.id)}><Delete /></IconButton>
              </Card>
            ))}
            <Button component={Link} to="/books" sx={{ mt: 2 }}>Continue Shopping</Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Order Summary</Typography>
              {remainingForFreeShipping > 0 && (
                <Box sx={{ p: 2, bgcolor: 'pastel.mint', borderRadius: 2, mb: 3 }}>
                  <Typography variant="body2">Add ${remainingForFreeShipping.toFixed(2)} more for free shipping!</Typography>
                  <Box sx={{ mt: 1, height: 6, bgcolor: 'white', borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ width: `${(cart.subtotal / freeShippingThreshold) * 100}%`, height: '100%', bgcolor: 'success.main', transition: 'width 0.3s' }} />
                  </Box>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography color="text.secondary">Subtotal ({cart.itemCount} items)</Typography><Typography>${cart.subtotal.toFixed(2)}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography color="text.secondary">Shipping</Typography><Typography>{cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}><Typography color="text.secondary">Tax (10%)</Typography><Typography>${cart.tax.toFixed(2)}</Typography></Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}><Typography variant="h6" fontWeight={600}>Total</Typography><Typography variant="h6" fontWeight={600} color="primary.main">${cart.total.toFixed(2)}</Typography></Box>
              <Button component={Link} to={isAuthenticated ? '/checkout' : '/login'} variant="contained" fullWidth size="large">{isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}</Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;
