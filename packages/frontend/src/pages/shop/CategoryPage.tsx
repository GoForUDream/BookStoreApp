import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Container, Typography, Grid, Breadcrumbs, Skeleton } from '@mui/material';
import { CATEGORY_QUERY } from '../../graphql/operations';
import BookCard from '../../components/common/BookCard';

const CategoryPage = () => {
  const { slug } = useParams();
  const { data, loading } = useQuery(CATEGORY_QUERY, { variables: { slug } });

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" height={50} width={200} />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {Array.from({ length: 8 }).map((_, i) => <Grid item xs={6} sm={4} md={3} key={i}><Skeleton variant="rounded" height={380} /></Grid>)}
      </Grid>
    </Container>
  );

  const category = data?.category;
  if (!category) return <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}><Typography variant="h5">Category not found</Typography></Container>;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <Link to="/books" style={{ color: 'inherit', textDecoration: 'none' }}>Books</Link>
          <Typography color="text.primary">{category.name}</Typography>
        </Breadcrumbs>
        <Box sx={{ background: 'linear-gradient(135deg, #FFD6E0 0%, #E2D9F3 100%)', borderRadius: 4, p: 4, mb: 4 }}>
          <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{category.name}</Typography>
          {category.description && <Typography color="text.secondary" sx={{ mt: 1 }}>{category.description}</Typography>}
        </Box>
        {category.books?.length > 0 ? (
          <Grid container spacing={3}>
            {category.books.map((book: any) => <Grid item xs={6} sm={4} md={3} key={book.id}><BookCard book={book} /></Grid>)}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}><Typography color="text.secondary">No books in this category yet.</Typography></Box>
        )}
      </Container>
    </Box>
  );
};

export default CategoryPage;
