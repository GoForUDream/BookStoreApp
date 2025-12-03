import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Select, MenuItem, IconButton, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button, Skeleton } from '@mui/material';
import { Delete, Search } from '@mui/icons-material';
import { ADMIN_USERS_QUERY, UPDATE_USER_ROLE_MUTATION, DELETE_USER_MUTATION } from '../../graphql/operations';
import { Role } from '@bookstore/shared';
import toast from 'react-hot-toast';

const Users = () => {
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: any }>({ open: false, user: null });

  const { data, loading, refetch } = useQuery(ADMIN_USERS_QUERY, { variables: { search: search || undefined } });
  const [updateRole] = useMutation(UPDATE_USER_ROLE_MUTATION, { onCompleted: () => { toast.success('Role updated'); refetch(); }, onError: (e) => toast.error(e.message) });
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, { onCompleted: () => { toast.success('User deleted'); refetch(); setDeleteDialog({ open: false, user: null }); }, onError: (e) => toast.error(e.message) });

  if (loading) return <Box><Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>Users</Typography><Skeleton variant="rounded" height={400} /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Users</Typography>
        <TextField size="small" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} sx={{ minWidth: 250 }} />
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.adminUsers?.map((user: any) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{user.firstName[0]}</Avatar>
                      <Typography fontWeight={600}>{user.firstName} {user.lastName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select value={user.role} size="small" onChange={e => updateRole({ variables: { id: user.id, role: e.target.value } })} sx={{ minWidth: 100 }}>
                      {Object.values(Role).map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, user })}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{deleteDialog.user?.firstName} {deleteDialog.user?.lastName}"?</Typography>
          <Typography color="error" sx={{ mt: 1 }}>This will also delete all their orders and reviews.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => deleteUser({ variables: { id: deleteDialog.user?.id } })}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
