import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Card, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Skeleton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { CATEGORIES_QUERY, CREATE_CATEGORY_MUTATION, UPDATE_CATEGORY_MUTATION, DELETE_CATEGORY_MUTATION } from '../../graphql/operations';
import toast from 'react-hot-toast';

const emptyCategory = { name: '', description: '', image: '' };

const Categories = () => {
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'create' | 'edit'; category: any }>({ open: false, mode: 'create', category: emptyCategory });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; category: any }>({ open: false, category: null });

  const { data, loading, refetch } = useQuery(CATEGORIES_QUERY);

  const [createCategory] = useMutation(CREATE_CATEGORY_MUTATION, { onCompleted: () => { toast.success('Category created'); refetch(); setDialog({ ...dialog, open: false }); }, onError: (e) => toast.error(e.message) });
  const [updateCategory] = useMutation(UPDATE_CATEGORY_MUTATION, { onCompleted: () => { toast.success('Category updated'); refetch(); setDialog({ ...dialog, open: false }); }, onError: (e) => toast.error(e.message) });
  const [deleteCategory] = useMutation(DELETE_CATEGORY_MUTATION, { onCompleted: () => { toast.success('Category deleted'); refetch(); setDeleteDialog({ open: false, category: null }); }, onError: (e) => toast.error(e.message) });

  const handleSave = () => {
    const input = { name: dialog.category.name, description: dialog.category.description || undefined, image: dialog.category.image || undefined };
    if (dialog.mode === 'create') createCategory({ variables: { input } });
    else updateCategory({ variables: { id: dialog.category.id, input } });
  };

  if (loading) return <Box><Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>Categories</Typography><Skeleton variant="rounded" height={300} /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Categories</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialog({ open: true, mode: 'create', category: emptyCategory })}>Add Category</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Books</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.categories?.map((cat: any) => (
                <TableRow key={cat.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar variant="rounded" src={cat.image}>{cat.name[0]}</Avatar>
                      <Typography fontWeight={600}>{cat.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography color="text.secondary" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.description || '-'}</Typography></TableCell>
                  <TableCell>{cat.bookCount}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setDialog({ open: true, mode: 'edit', category: cat })}><Edit /></IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, category: cat })}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog.mode === 'create' ? 'Add Category' : 'Edit Category'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Name" value={dialog.category.name} onChange={e => setDialog({ ...dialog, category: { ...dialog.category, name: e.target.value } })} required />
            <TextField label="Description" value={dialog.category.description || ''} onChange={e => setDialog({ ...dialog, category: { ...dialog.category, description: e.target.value } })} multiline rows={2} />
            <TextField label="Image URL" value={dialog.category.image || ''} onChange={e => setDialog({ ...dialog, category: { ...dialog.category, image: e.target.value } })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{dialog.mode === 'create' ? 'Create' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, category: null })}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{deleteDialog.category?.name}"?</Typography>
          {deleteDialog.category?.bookCount > 0 && <Typography color="error" sx={{ mt: 1 }}>This category has {deleteDialog.category.bookCount} books. You cannot delete it.</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, category: null })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => deleteCategory({ variables: { id: deleteDialog.category?.id } })} disabled={deleteDialog.category?.bookCount > 0}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;
