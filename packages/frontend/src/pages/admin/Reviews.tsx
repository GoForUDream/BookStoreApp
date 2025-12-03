import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, FormControl, InputLabel, Select, MenuItem, Rating, Dialog, DialogTitle, DialogContent, DialogActions, Button, Skeleton } from '@mui/material';
import { Check, Delete } from '@mui/icons-material';
import { ADMIN_REVIEWS_QUERY, APPROVE_REVIEW_MUTATION, DELETE_REVIEW_MUTATION } from '../../graphql/operations';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [filter, setFilter] = useState<boolean | ''>('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; review: any }>({ open: false, review: null });

  const { data, loading, refetch } = useQuery(ADMIN_REVIEWS_QUERY, { variables: { approved: filter === '' ? undefined : filter } });
  const [approveReview] = useMutation(APPROVE_REVIEW_MUTATION, { onCompleted: () => { toast.success('Review approved'); refetch(); }, onError: (e) => toast.error(e.message) });
  const [deleteReview] = useMutation(DELETE_REVIEW_MUTATION, { onCompleted: () => { toast.success('Review deleted'); refetch(); setDeleteDialog({ open: false, review: null }); }, onError: (e) => toast.error(e.message) });

  if (loading) return <Box><Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>Reviews</Typography><Skeleton variant="rounded" height={400} /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Reviews</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} label="Filter" onChange={e => setFilter(e.target.value as boolean | '')}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Approved</MenuItem>
            <MenuItem value="false">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.adminReviews?.map((review: any) => (
                <TableRow key={review.id} hover>
                  <TableCell><Typography fontWeight={500}>{review.book.title}</Typography></TableCell>
                  <TableCell>
                    <Typography>{review.user.firstName} {review.user.lastName}</Typography>
                    <Typography variant="body2" color="text.secondary">{review.user.email}</Typography>
                  </TableCell>
                  <TableCell><Rating value={review.rating} size="small" readOnly /></TableCell>
                  <TableCell>
                    <Typography sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review.comment}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={review.isApproved ? 'Approved' : 'Pending'} size="small" color={review.isApproved ? 'success' : 'warning'} />
                  </TableCell>
                  <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    {!review.isApproved && <IconButton size="small" color="success" onClick={() => approveReview({ variables: { id: review.id } })}><Check /></IconButton>}
                    <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, review })}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, review: null })}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this review?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, review: null })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => deleteReview({ variables: { id: deleteDialog.review?.id } })}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews;
