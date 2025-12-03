import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Typography, Grid, Card, Chip, Skeleton, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { LibraryBooks, People, ShoppingCart, AttachMoney, TrendingUp } from '@mui/icons-material';
import { ADMIN_DASHBOARD_QUERY } from '../../graphql/operations';
import { OrderStatus } from '@bookstore/shared';

const statusColors: Record<OrderStatus, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
  [OrderStatus.PENDING]: 'warning', [OrderStatus.PROCESSING]: 'info', [OrderStatus.SHIPPED]: 'primary', [OrderStatus.DELIVERED]: 'success', [OrderStatus.CANCELLED]: 'error',
};

const Dashboard = () => {
  const { data, loading } = useQuery(ADMIN_DASHBOARD_QUERY);

  if (loading) return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>Dashboard</Typography>
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, i) => <Grid item xs={12} sm={6} md={3} key={i}><Skeleton variant="rounded" height={140} /></Grid>)}
      </Grid>
    </Box>
  );

  const stats = data?.adminDashboard;
  const statCards = [
    { title: 'Total Books', value: stats?.totalBooks, icon: <LibraryBooks />, color: '#FFD6E0', iconColor: '#db637c' },
    { title: 'Total Users', value: stats?.totalUsers, icon: <People />, color: '#E2D9F3', iconColor: '#7c4dff' },
    { title: 'Total Orders', value: stats?.totalOrders, icon: <ShoppingCart />, color: '#D1ECF1', iconColor: '#0097a7' },
    { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || 0}`, icon: <AttachMoney />, color: '#D4EDDA', iconColor: '#2e7d32' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Dashboard</Typography>
        {stats?.pendingOrders > 0 && <Chip label={`${stats.pendingOrders} pending orders`} color="warning" />}
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ p: 3, background: stat.color }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.iconColor }}>{stat.icon}</Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                  <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Recent Orders</Typography>
            {stats?.recentOrders?.length > 0 ? (
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600 }}>Order</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600 }}>Customer</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600 }}>Status</th>
                      <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order: any) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px 8px' }}>
                          <Link to={`/admin/orders`} style={{ color: '#db637c', textDecoration: 'none' }}>{order.orderNumber}</Link>
                        </td>
                        <td style={{ padding: '12px 8px' }}>{order.user.firstName} {order.user.lastName}</td>
                        <td style={{ padding: '12px 8px' }}><Chip label={order.status} color={statusColors[order.status as OrderStatus]} size="small" /></td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            ) : (
              <Typography color="text.secondary">No recent orders</Typography>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingUp color="primary" />
              <Typography variant="h6" fontWeight={600}>Top Selling Books</Typography>
            </Box>
            <List disablePadding>
              {stats?.topSellingBooks?.map((book: any, i: number) => (
                <ListItem key={book.id} disablePadding sx={{ py: 1 }}>
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={book.coverImage} sx={{ width: 40, height: 55 }}>{i + 1}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</Typography>}
                    secondary={<><span>{book.author}</span> • <strong>{book.sold} sold</strong></>}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
