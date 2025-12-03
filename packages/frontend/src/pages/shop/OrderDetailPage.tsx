import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Container, Typography, Grid, Card, Chip, Stepper, Step, StepLabel, Skeleton, Button, Divider } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { ORDER_QUERY } from '../../graphql/operations';
import { OrderStatus } from '@bookstore/shared';

const statusSteps = [OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED];
const statusColors: Record<OrderStatus, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.PROCESSING]: 'info',
  [OrderStatus.SHIPPED]: 'primary',
  [OrderStatus.DELIVERED]: 'success',
  [OrderStatus.CANCELLED]: 'error',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data, loading } = useQuery(ORDER_QUERY, { variables: { id } });

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" height={50} width={300} />
      <Skeleton variant="rounded" height={100} sx={{ mt: 3 }} />
      <Skeleton variant="rounded" height={300} sx={{ mt: 3 }} />
    </Container>
  );

  const order = data?.order;
  if (!order) return <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}><Typography variant="h5">Order not found</Typography></Container>;

  const activeStep = order.status === OrderStatus.CANCELLED ? -1 : statusSteps.indexOf(order.status as OrderStatus);

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Button component={Link} to="/orders" startIcon={<ArrowBack />} sx={{ mb: 3 }}>Back to Orders</Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{order.orderNumber}</Typography>
            <Typography color="text.secondary">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
          </Box>
          <Chip label={order.status} color={statusColors[order.status as OrderStatus]} />
        </Box>

        {order.status !== OrderStatus.CANCELLED && (
          <Card sx={{ p: 3, mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {statusSteps.map((step) => <Step key={step}><StepLabel>{step}</StepLabel></Step>)}
            </Stepper>
          </Card>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Order Items</Typography>
              {order.items.map((item: any) => (
                <Box key={item.id} sx={{ display: 'flex', gap: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
                  <Box component={Link} to={`/books/${item.book.slug}`} sx={{ width: 60, height: 80, borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.book.coverImage} alt={item.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography component={Link} to={`/books/${item.book.slug}`} fontWeight={600} sx={{ textDecoration: 'none', color: 'inherit' }}>{item.book.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.book.author}</Typography>
                    <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
                  </Box>
                  <Typography fontWeight={600}>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Order Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography color="text.secondary">Subtotal</Typography><Typography>${order.subtotal.toFixed(2)}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography color="text.secondary">Shipping</Typography><Typography>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}><Typography color="text.secondary">Tax</Typography><Typography>${order.tax.toFixed(2)}</Typography></Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6" fontWeight={600}>Total</Typography><Typography variant="h6" fontWeight={600} color="primary.main">${order.total.toFixed(2)}</Typography></Box>
            </Card>
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Shipping Address</Typography>
              <Typography>{order.shippingAddress}</Typography>
              <Typography>{order.shippingCity}, {order.shippingZipCode}</Typography>
              <Typography>{order.shippingCountry}</Typography>
            </Card>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Payment Method</Typography>
              <Typography sx={{ textTransform: 'capitalize' }}>{order.paymentMethod.replace('_', ' ')}</Typography>
            </Card>
            {order.notes && <Card sx={{ p: 3, mt: 3 }}><Typography variant="h6" fontWeight={600} gutterBottom>Order Notes</Typography><Typography color="text.secondary">{order.notes}</Typography></Card>}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OrderDetailPage;
