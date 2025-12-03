import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Container, Typography, Grid, Card, TextField, Select, MenuItem, FormControl, InputLabel, Slider, Button, Chip, Pagination, Skeleton, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import { BOOKS_QUERY, CATEGORIES_QUERY } from '../../graphql/operations';
import BookCard from '../../components/common/BookCard';

const BooksPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ search: searchParams.get('search') || '', categoryId: '', minPrice: 0, maxPrice: 100, featured: searchParams.get('featured') === 'true', inStock: false });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const { data: categoriesData } = useQuery(CATEGORIES_QUERY);
  const { data, loading } = useQuery(BOOKS_QUERY, {
    variables: { page, limit: 12, sortBy, sortOrder, filters: {
      search: filters.search || undefined, categoryId: filters.categoryId || undefined,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined, maxPrice: filters.maxPrice < 100 ? filters.maxPrice : undefined,
      featured: filters.featured || undefined, inStock: filters.inStock || undefined,
    }},
  });

  useEffect(() => { setPage(1); }, [filters, sortBy, sortOrder]);

  const handleFilterChange = (key: string, value: any) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ search: '', categoryId: '', minPrice: 0, maxPrice: 100, featured: false, inStock: false });
  const hasActiveFilters = filters.search || filters.categoryId || filters.minPrice > 0 || filters.maxPrice < 100 || filters.featured || filters.inStock;

  const filterContent = (
    <Box sx={{ p: isMobile ? 3 : 0 }}>
      {isMobile && <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}><Typography variant="h6" fontWeight={600}>Filters</Typography><IconButton onClick={() => setFilterDrawerOpen(false)}><Close /></IconButton></Box>}
      <Card sx={{ p: 3, mb: 3 }}><Typography variant="subtitle1" fontWeight={600} gutterBottom>Search</Typography><TextField fullWidth size="small" placeholder="Search books..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} /></Card>
      <Card sx={{ p: 3, mb: 3 }}><Typography variant="subtitle1" fontWeight={600} gutterBottom>Category</Typography><FormControl fullWidth size="small"><Select value={filters.categoryId} onChange={e => handleFilterChange('categoryId', e.target.value)} displayEmpty><MenuItem value="">All Categories</MenuItem>{categoriesData?.categories?.map((cat: any) => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}</Select></FormControl></Card>
      <Card sx={{ p: 3, mb: 3 }}><Typography variant="subtitle1" fontWeight={600} gutterBottom>Price Range</Typography><Slider value={[filters.minPrice, filters.maxPrice]} onChange={(_, v) => { const val = v as number[]; handleFilterChange('minPrice', val[0]); handleFilterChange('maxPrice', val[1]); }} valueLabelDisplay="auto" valueLabelFormat={v => `$${v}`} min={0} max={100} sx={{ mt: 2 }} /></Card>
      <Card sx={{ p: 3, mb: 3 }}><Typography variant="subtitle1" fontWeight={600} gutterBottom>Quick Filters</Typography><Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}><Chip label="Featured" onClick={() => handleFilterChange('featured', !filters.featured)} color={filters.featured ? 'primary' : 'default'} variant={filters.featured ? 'filled' : 'outlined'} /><Chip label="In Stock" onClick={() => handleFilterChange('inStock', !filters.inStock)} color={filters.inStock ? 'primary' : 'default'} variant={filters.inStock ? 'filled' : 'outlined'} /></Box></Card>
      {hasActiveFilters && <Button fullWidth variant="outlined" onClick={clearFilters}>Clear All Filters</Button>}
    </Box>
  );

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>All Books</Typography>
        <Grid container spacing={4}>
          {!isMobile && <Grid item md={3}>{filterContent}</Grid>}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
              <Typography color="text.secondary">{data?.books?.totalCount || 0} books found</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {isMobile && <Button variant="outlined" startIcon={<FilterList />} onClick={() => setFilterDrawerOpen(true)}>Filters</Button>}
                <FormControl size="small" sx={{ minWidth: 150 }}><InputLabel>Sort By</InputLabel><Select value={`${sortBy}-${sortOrder}`} label="Sort By" onChange={e => { const [f, o] = e.target.value.split('-'); setSortBy(f); setSortOrder(o); }}><MenuItem value="createdAt-desc">Newest First</MenuItem><MenuItem value="price-asc">Price: Low to High</MenuItem><MenuItem value="price-desc">Price: High to Low</MenuItem><MenuItem value="sold-desc">Best Sellers</MenuItem></Select></FormControl>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {loading ? Array.from({ length: 12 }).map((_, i) => <Grid item xs={6} sm={4} key={i}><Skeleton variant="rounded" height={380} /></Grid>) : data?.books?.books?.map((book: any) => <Grid item xs={6} sm={4} key={book.id}><BookCard book={book} /></Grid>)}
            </Grid>
            {!loading && data?.books?.books?.length === 0 && <Box sx={{ textAlign: 'center', py: 8 }}><Typography variant="h6" color="text.secondary">No books found</Typography><Button variant="outlined" onClick={clearFilters} sx={{ mt: 2 }}>Clear Filters</Button></Box>}
            {data?.books?.totalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><Pagination count={data.books.totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" size="large" /></Box>}
          </Grid>
        </Grid>
      </Container>
      <Drawer anchor="right" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)} PaperProps={{ sx: { width: 320, borderRadius: '20px 0 0 20px' } }}>{filterContent}</Drawer>
    </Box>
  );
};

export default BooksPage;
