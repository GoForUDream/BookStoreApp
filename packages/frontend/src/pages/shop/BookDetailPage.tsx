import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Container, Grid, Typography, Button, Chip, Rating, TextField, Avatar, Card, Breadcrumbs, IconButton, Skeleton, Tab, Tabs } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, Add, Remove, LocalShipping, Security, Autorenew } from '@mui/icons-material';
import { BOOK_QUERY } from '../../graphql/operations';
import { CREATE_REVIEW_MUTATION } from '../../graphql/operations';
import { useCart } from '../../hooks/useCart';
import { useAuthStore } from '../../stores/auth';
import toast from 'react-hot-toast';

const BookDetailPage = () => {
  const { slug } = useParams();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [inWishlist] = useState(false);

  const { data, loading, refetch } = useQuery(BOOK_QUERY, { variables: { slug } });
  const [createReview, { loading: reviewLoading }] = useMutation(CREATE_REVIEW_MUTATION, {
    onCompleted: () => { toast.success('Review submitted'); setReviewForm({ rating: 5, title: '', comment: '' }); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const book = data?.book;

  const handleAddToCart = () => { if (!isAuthenticated) { toast.error('Please login'); return; } addToCart(book.id, quantity); };
  const handleReviewSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!reviewForm.comment) { toast.error('Please write a review'); return; } createReview({ variables: { bookId: book.id, input: reviewForm } }); };

  if (loading) return <Container maxWidth="lg" sx={{ py: 4 }}><Grid container spacing={4}><Grid item xs={12} md={5}><Skeleton variant="rounded" height={500} /></Grid><Grid item xs={12} md={7}><Skeleton variant="text" height={50} /><Skeleton variant="text" height={40} /><Skeleton variant="text" height={200} /></Grid></Grid></Container>;
  if (!book) return <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}><Typography variant="h5">Book not found</Typography><Button component={Link} to="/books" variant="contained" sx={{ mt: 2 }}>Browse Books</Button></Container>;

  const discount = book.originalPrice ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <Link to="/books" style={{ color: 'inherit', textDecoration: 'none' }}>Books</Link>
          <Typography color="text.primary">{book.title}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', bgcolor: 'pastel.lavender', p: 4 }}>
              {discount > 0 && <Chip label={`-${discount}%`} sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} />}
              <img src={book.coverImage} alt={book.title} style={{ width: '100%', maxHeight: 500, objectFit: 'contain', borderRadius: 12 }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Chip label={book.category?.name} sx={{ mb: 2, bgcolor: 'pastel.pink' }} />
            <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 1 }}>{book.title}</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>by {book.author}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}><Rating value={book.averageRating || 0} precision={0.5} readOnly /><Typography color="text.secondary">({book.reviewCount} reviews)</Typography></Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}><Typography variant="h4" color="primary.main" fontWeight={700}>${book.price.toFixed(2)}</Typography>{book.originalPrice && <Typography variant="h5" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>${book.originalPrice.toFixed(2)}</Typography>}</Box>
            <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>{book.description}</Typography>
            <Box sx={{ mb: 3 }}>{book.stock > 0 ? <Chip label={`In Stock (${book.stock})`} sx={{ bgcolor: 'pastel.mint', color: 'success.dark' }} /> : <Chip label="Out of Stock" color="error" />}</Box>
            {book.stock > 0 && (
              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Remove /></IconButton>
                  <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center' }}>{quantity}</Typography>
                  <IconButton onClick={() => setQuantity(Math.min(book.stock, quantity + 1))} disabled={quantity >= book.stock}><Add /></IconButton>
                </Box>
                <Button variant="contained" size="large" startIcon={<ShoppingCart />} onClick={handleAddToCart} sx={{ flex: 1, minWidth: 200 }}>{isInCart(book.id) ? 'Add More' : 'Add to Cart'}</Button>
                <IconButton sx={{ border: '2px solid', borderColor: inWishlist ? 'error.main' : 'divider', color: inWishlist ? 'error.main' : 'inherit' }}>{inWishlist ? <Favorite /> : <FavoriteBorder />}</IconButton>
              </Box>
            )}
            <Grid container spacing={2}>
              {[{ icon: <LocalShipping />, text: 'Free Shipping' }, { icon: <Security />, text: 'Secure Payment' }, { icon: <Autorenew />, text: '30-Day Returns' }].map((f, i) => (
                <Grid item xs={4} key={i}><Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, bgcolor: 'pastel.sky', borderRadius: 2 }}>{f.icon}<Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>{f.text}</Typography></Box></Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}><Tab label="Details" /><Tab label={`Reviews (${book.reviewCount})`} /></Tabs>
          {tabValue === 0 && (
            <Box sx={{ py: 4 }}><Grid container spacing={2}>{[{ label: 'ISBN', value: book.isbn }, { label: 'Publisher', value: book.publisher || 'N/A' }, { label: 'Pages', value: book.pages || 'N/A' }, { label: 'Language', value: book.language }, { label: 'Sold', value: book.sold }].map(item => <Grid item xs={6} md={4} key={item.label}><Typography variant="body2" color="text.secondary">{item.label}</Typography><Typography fontWeight={500}>{item.value}</Typography></Grid>)}</Grid></Box>
          )}
          {tabValue === 1 && (
            <Box sx={{ py: 4 }}>
              {isAuthenticated && (
                <Card sx={{ p: 3, mb: 4, bgcolor: 'pastel.lavender' }}>
                  <Typography variant="h6" gutterBottom>Write a Review</Typography>
                  <form onSubmit={handleReviewSubmit}>
                    <Box sx={{ mb: 2 }}><Typography gutterBottom>Rating</Typography><Rating value={reviewForm.rating} onChange={(_, v) => setReviewForm({ ...reviewForm, rating: v || 5 })} size="large" /></Box>
                    <TextField fullWidth label="Title (optional)" value={reviewForm.title} onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })} sx={{ mb: 2 }} />
                    <TextField fullWidth multiline rows={3} label="Your Review" value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} sx={{ mb: 2 }} />
                    <Button type="submit" variant="contained" disabled={reviewLoading}>Submit Review</Button>
                  </form>
                </Card>
              )}
              {book.reviews?.length > 0 ? book.reviews.map((review: any) => (
                <Card key={review.id} sx={{ p: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar>{review.user.firstName[0]}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography fontWeight={600}>{review.user.firstName} {review.user.lastName}</Typography><Typography variant="body2" color="text.secondary">{new Date(review.createdAt).toLocaleDateString()}</Typography></Box>
                      <Rating value={review.rating} size="small" readOnly />
                      {review.title && <Typography fontWeight={500} sx={{ mt: 1 }}>{review.title}</Typography>}
                      <Typography color="text.secondary" sx={{ mt: 1 }}>{review.comment}</Typography>
                    </Box>
                  </Box>
                </Card>
              )) : <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>No reviews yet. Be the first!</Typography>}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default BookDetailPage;
