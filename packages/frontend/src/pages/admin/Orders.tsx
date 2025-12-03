import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Pagination, Dialog, DialogTitle, DialogContent, Avatar, Skeleton } from '@mui/material';
import { ADMIN_ORDERS_QUERY, UPDATE_ORDER_STATUS_MUTATION } from '../../graphql/operations';
import { OrderStatus } from '@bookstore/shared';
import toast from 'react-hot-toast';

const Orders = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [detailDialog, setDetailDialog] = useState<{ open: boolean; order: any }>({ open: false, order: null });

  const { data, loading, refetch } = useQuery(ADMIN_ORDERS_QUERY, { variables: { page, limit: 10, status: statusFilter || undefined } });
  const [updateStatus] = useMutation(UPDATE_ORDER_STATUS_MUTATION, { onCompleted: () => { toast.success('Status updated'); refetch(); }, onError: (e) => toast.error(e.message) });

  if (loading) return <Box><Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>Orders</Typography><Skeleton variant="rounded" height={400} /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Orders</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={e => { setStatusFilter(e.target.value as OrderStatus | ''); setPage(1); }}>
            <MenuItem value="">All</MenuItem>
            {Object.values(OrderStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.adminOrders?.orders?.map((order: any) => (
                <TableRow key={order.id} hover sx={{ cursor: 'pointer' }} onClick={() => setDetailDialog({ open: true, order })}>
                  <TableCell><Typography fontWeight={600} color="primary.main">{order.orderNumber}</Typography></TableCell>
                  <TableCell>
                    <Typography>{order.user.firstName} {order.user.lastName}</Typography>
                    <Typography variant="body2" color="text.secondary">{order.user.email}</Typography>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <Select value={order.status} size="small" onChange={e => updateStatus({ variables: { id: order.id, status: e.target.value } })} sx={{ minWidth: 130 }}>
                      {Object.values(OrderStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                  </TableCell>
                  <TableCell align="right"><Typography fontWeight={600}>${order.total.toFixed(2)}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {data?.adminOrders?.totalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><Pagination count={data.adminOrders.totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" /></Box>}
      </Card>

      <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, order: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details - {detailDialog.order?.orderNumber}</DialogTitle>
        <DialogContent>
          {detailDialog.order && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                <Typography>{detailDialog.order.user.firstName} {detailDialog.order.user.lastName}</Typography>
                <Typography variant="body2" color="text.secondary">{detailDialog.order.user.email}</Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Items</Typography>
                {detailDialog.order.items.map((item: any) => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                    <Avatar variant="rounded" src={item.book.coverImage} sx={{ width: 40, height: 55 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={500}>{item.book.title}</Typography>
                      <Typography variant="body2" color="text.secondary">Qty: {item.quantity} × ${item.price.toFixed(2)}</Typography>
                    </Box>
                    <Typography fontWeight={600}>${(item.quantity * item.price).toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary.main">${detailDialog.order.total.toFixed(2)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Orders;
