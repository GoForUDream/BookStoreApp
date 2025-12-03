import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Container, Typography, Button, Grid, Card, Skeleton } from '@mui/material';
import { ArrowForward, LocalShipping, Security, Support, Autorenew } from '@mui/icons-material';
import { FEATURED_BOOKS_QUERY, CATEGORIES_QUERY } from '../../graphql/operations';
import BookCard from '../../components/common/BookCard';

const HomePage = () => {
  const { data: booksData, loading: booksLoading } = useQuery(FEATURED_BOOKS_QUERY, { variables: { limit: 8 } });
  const { data: categoriesData, loading: categoriesLoading } = useQuery(CATEGORIES_QUERY);

  const features = [
    { icon: <LocalShipping />, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: <Security />, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: <Support />, title: '24/7 Support', desc: 'Dedicated support' },
    { icon: <Autorenew />, title: 'Easy Returns', desc: '30-day return policy' },
  ];

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #FFD6E0 0%, #E2D9F3 50%, #D1ECF1 100%)', py: { xs: 8, md: 12 } }} className="hero-pattern">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Discover Your Next <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>Favorite Book</Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                Explore our curated collection of bestsellers, classics, and hidden gems.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button component={Link} to="/books" variant="contained" size="large" endIcon={<ArrowForward />}>Browse Books</Button>
                <Button component={Link} to="/books?featured=true" variant="outlined" size="large">Featured Picks</Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Card sx={{ textAlign: 'center', p: 3, bgcolor: i % 2 === 0 ? 'pastel.lavender' : 'pastel.mint', border: 'none', boxShadow: 'none' }}>
                <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: 'primary.main' }}>{f.icon}</Box>
                <Typography variant="subtitle1" fontWeight={600}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 1, textAlign: 'center' }}>Browse by Category</Typography>
          <Typography color="text.secondary" textAlign="center" sx={{ mb: 6 }}>Find your perfect read</Typography>
          <Grid container spacing={3}>
            {categoriesLoading ? Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={6} md={4} lg={2} key={i}><Skeleton variant="rounded" height={150} /></Grid>
            )) : categoriesData?.categories?.slice(0, 6).map((cat: any, i: number) => (
              <Grid item xs={6} md={4} lg={2} key={cat.id}>
                <Card component={Link} to={`/category/${cat.slug}`} sx={{
                  height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textDecoration: 'none',
                  background: ['linear-gradient(135deg, #FFD6E0 0%, #f8d7da 100%)', 'linear-gradient(135deg, #E2D9F3 0%, #c5cae9 100%)', 'linear-gradient(135deg, #D1ECF1 0%, #b8daff 100%)', 'linear-gradient(135deg, #D4EDDA 0%, #c3e6cb 100%)', 'linear-gradient(135deg, #FFF3CD 0%, #ffeeba 100%)', 'linear-gradient(135deg, #FFEDDA 0%, #ffc9a8 100%)'][i % 6],
                }}>
                  <Typography variant="h6" fontWeight={600} textAlign="center" px={2}>{cat.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{cat.bookCount} books</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Books */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 1 }}>Featured Books</Typography>
            <Typography color="text.secondary">Handpicked selections just for you</Typography>
          </Box>
          <Button component={Link} to="/books" endIcon={<ArrowForward />}>View All</Button>
        </Box>
        <Grid container spacing={3}>
          {booksLoading ? Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={6} sm={4} md={3} key={i}><Skeleton variant="rounded" height={380} /></Grid>
          )) : booksData?.featuredBooks?.map((book: any) => (
            <Grid item xs={6} sm={4} md={3} key={book.id}><BookCard book={book} /></Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
