import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Card, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Pagination, Skeleton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { BOOKS_QUERY, CATEGORIES_QUERY, CREATE_BOOK_MUTATION, UPDATE_BOOK_MUTATION, DELETE_BOOK_MUTATION } from '../../graphql/operations';
import toast from 'react-hot-toast';

const emptyBook = { title: '', author: '', description: '', price: '', originalPrice: '', isbn: '', publisher: '', pages: '', language: 'English', coverImage: '', stock: '', featured: false, isActive: true, categoryId: '' };

const Books = () => {
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'create' | 'edit'; book: any }>({ open: false, mode: 'create', book: emptyBook });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; book: any }>({ open: false, book: null });

  const { data, loading, refetch } = useQuery(BOOKS_QUERY, { variables: { page, limit: 10 } });
  const { data: catData } = useQuery(CATEGORIES_QUERY);

  const [createBook] = useMutation(CREATE_BOOK_MUTATION, { onCompleted: () => { toast.success('Book created'); refetch(); setDialog({ ...dialog, open: false }); }, onError: (e) => toast.error(e.message) });
  const [updateBook] = useMutation(UPDATE_BOOK_MUTATION, { onCompleted: () => { toast.success('Book updated'); refetch(); setDialog({ ...dialog, open: false }); }, onError: (e) => toast.error(e.message) });
  const [deleteBook] = useMutation(DELETE_BOOK_MUTATION, { onCompleted: () => { toast.success('Book deleted'); refetch(); setDeleteDialog({ open: false, book: null }); }, onError: (e) => toast.error(e.message) });

  const handleSave = () => {
    const input = {
      title: dialog.book.title, author: dialog.book.author, description: dialog.book.description, price: parseFloat(dialog.book.price), originalPrice: dialog.book.originalPrice ? parseFloat(dialog.book.originalPrice) : undefined,
      isbn: dialog.book.isbn, publisher: dialog.book.publisher || undefined, pages: dialog.book.pages ? parseInt(dialog.book.pages) : undefined, language: dialog.book.language, coverImage: dialog.book.coverImage,
      stock: parseInt(dialog.book.stock), featured: dialog.book.featured, isActive: dialog.book.isActive, categoryId: dialog.book.categoryId,
    };
    if (dialog.mode === 'create') createBook({ variables: { input } });
    else updateBook({ variables: { id: dialog.book.id, input } });
  };

  if (loading) return <Box><Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>Books</Typography><Skeleton variant="rounded" height={400} /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Books</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialog({ open: true, mode: 'create', book: emptyBook })}>Add Book</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.books?.books?.map((book: any) => (
                <TableRow key={book.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar variant="rounded" src={book.coverImage} sx={{ width: 40, height: 55 }} />
                      <Box>
                        <Typography fontWeight={600}>{book.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{book.author}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{book.category?.name}</TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>${book.price.toFixed(2)}</Typography>
                    {book.originalPrice && <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>${book.originalPrice.toFixed(2)}</Typography>}
                  </TableCell>
                  <TableCell><Chip label={book.stock} size="small" color={book.stock > 10 ? 'success' : book.stock > 0 ? 'warning' : 'error'} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {book.featured && <Chip label="Featured" size="small" sx={{ bgcolor: 'pastel.mint' }} />}
                      {!book.isActive && <Chip label="Inactive" size="small" color="error" variant="outlined" />}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setDialog({ open: true, mode: 'edit', book: { ...book, price: book.price.toString(), originalPrice: book.originalPrice?.toString() || '', stock: book.stock.toString(), pages: book.pages?.toString() || '', categoryId: book.category?.id || '' } })}><Edit /></IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, book })}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {data?.books?.totalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><Pagination count={data.books.totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" /></Box>}
      </Card>

      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="md" fullWidth>
        <DialogTitle>{dialog.mode === 'create' ? 'Add Book' : 'Edit Book'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, pt: 1 }}>
            <TextField label="Title" value={dialog.book.title} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, title: e.target.value } })} required />
            <TextField label="Author" value={dialog.book.author} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, author: e.target.value } })} required />
            <TextField label="Description" value={dialog.book.description} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, description: e.target.value } })} multiline rows={3} sx={{ gridColumn: '1 / -1' }} required />
            <TextField label="Price" type="number" value={dialog.book.price} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, price: e.target.value } })} required />
            <TextField label="Original Price" type="number" value={dialog.book.originalPrice} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, originalPrice: e.target.value } })} />
            <TextField label="ISBN" value={dialog.book.isbn} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, isbn: e.target.value } })} required />
            <TextField label="Stock" type="number" value={dialog.book.stock} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, stock: e.target.value } })} required />
            <TextField label="Cover Image URL" value={dialog.book.coverImage} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, coverImage: e.target.value } })} sx={{ gridColumn: '1 / -1' }} required />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={dialog.book.categoryId} label="Category" onChange={e => setDialog({ ...dialog, book: { ...dialog.book, categoryId: e.target.value } })} required>
                {catData?.categories?.map((cat: any) => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Publisher" value={dialog.book.publisher || ''} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, publisher: e.target.value } })} />
            <TextField label="Pages" type="number" value={dialog.book.pages || ''} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, pages: e.target.value } })} />
            <TextField label="Language" value={dialog.book.language} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, language: e.target.value } })} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel control={<Switch checked={dialog.book.featured} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, featured: e.target.checked } })} />} label="Featured" />
              <FormControlLabel control={<Switch checked={dialog.book.isActive} onChange={e => setDialog({ ...dialog, book: { ...dialog.book, isActive: e.target.checked } })} />} label="Active" />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{dialog.mode === 'create' ? 'Create' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, book: null })}>
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete "{deleteDialog.book?.title}"?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, book: null })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => deleteBook({ variables: { id: deleteDialog.book?.id } })}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Books;
