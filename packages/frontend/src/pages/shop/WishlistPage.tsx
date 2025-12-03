import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Container, Typography, Grid, Skeleton, Button } from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';
import { WISHLIST_QUERY } from '../../graphql/operations';
import BookCard from '../../components/common/BookCard';

const WishlistPage = () => {
  const { data, loading, refetch } = useQuery(WISHLIST_QUERY);

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" height={50} width={200} />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {Array.from({ length: 4 }).map((_, i) => <Grid item xs={6} sm={4} md={3} key={i}><Skeleton variant="rounded" height={380} /></Grid>)}
      </Grid>
    </Container>
  );

  const wishlist = data?.myWishlist || [];

  if (wishlist.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <FavoriteBorder sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>Your wishlist is empty</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Save books you love to your wishlist</Typography>
        <Button component={Link} to="/books" variant="contained" size="large">Browse Books</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>My Wishlist</Typography>
        <Grid container spacing={3}>
          {wishlist.map((item: any) => (
            <Grid item xs={6} sm={4} md={3} key={item.id}>
              <BookCard book={item.book} inWishlist onWishlistChange={refetch} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WishlistPage;
