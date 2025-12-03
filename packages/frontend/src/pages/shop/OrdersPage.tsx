import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Container, Typography, Card, Chip, Pagination, Skeleton, Button, Avatar, AvatarGroup } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import { MY_ORDERS_QUERY } from '../../graphql/operations';
import { OrderStatus } from '@bookstore/shared';

const statusColors: Record<OrderStatus, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.PROCESSING]: 'info',
  [OrderStatus.SHIPPED]: 'primary',
  [OrderStatus.DELIVERED]: 'success',
  [OrderStatus.CANCELLED]: 'error',
};

const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(MY_ORDERS_QUERY, { variables: { page, limit: 10 } });

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" height={50} width={200} />
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={120} sx={{ mt: 2 }} />)}
    </Container>
  );

  const orders = data?.myOrders?.orders || [];

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>No orders yet</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Start shopping to see your orders here</Typography>
        <Button component={Link} to="/books" variant="contained" size="large">Browse Books</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>My Orders</Typography>
        {orders.map((order: any) => (
          <Card key={order.id} sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>{order.orderNumber}</Typography>
                <Typography variant="body2" color="text.secondary">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
              </Box>
              <Chip label={order.status} color={statusColors[order.status as OrderStatus]} size="small" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 2 }}>
              <AvatarGroup max={4}>
                {order.items.map((item: any) => <Avatar key={item.id} src={item.book.coverImage} variant="rounded" sx={{ width: 50, height: 65 }} />)}
              </AvatarGroup>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography variant="h6" fontWeight={600}>${order.total.toFixed(2)}</Typography>
                <Button component={Link} to={`/orders/${order.id}`} variant="outlined" size="small">View Details</Button>
              </Box>
            </Box>
          </Card>
        ))}
        {data?.myOrders?.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination count={data.myOrders.totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default OrdersPage;
