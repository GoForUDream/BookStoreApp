import { Link } from 'react-router-dom';
import { Box, Card, CardMedia, Typography, Chip, Rating, IconButton } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import type { Book } from '@bookstore/shared';
import { useCart } from '../../hooks/useCart';
import { useAuthStore } from '../../stores/auth';
import { useMutation } from '@apollo/client';
import { ADD_TO_WISHLIST_MUTATION, REMOVE_FROM_WISHLIST_MUTATION } from '../../graphql/operations';
import toast from 'react-hot-toast';

interface BookCardProps {
  book: Book;
  inWishlist?: boolean;
  onWishlistChange?: () => void;
}

const BookCard = ({ book, inWishlist = false, onWishlistChange }: BookCardProps) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuthStore();

  const [addToWishlist] = useMutation(ADD_TO_WISHLIST_MUTATION);
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST_MUTATION);

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    addToCart(book.id);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist({ variables: { bookId: book.id } });
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist({ variables: { bookId: book.id } });
        toast.success('Added to wishlist');
      }
      onWishlistChange?.();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Card
      component={Link}
      to={`/books/${book.slug}`}
      sx={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        '&:hover .actions': { opacity: 1 },
        '&:hover img': { transform: 'scale(1.05)' },
      }}
      className="card-hover"
    >
      <Box sx={{ position: 'relative', pt: '140%', bgcolor: 'pastel.lavender' }}>
        <CardMedia
          component="img"
          image={book.coverImage}
          alt={book.title}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
        />
        {discount > 0 && (
          <Chip label={`-${discount}%`} size="small" sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} />
        )}
        {book.featured && (
          <Chip label="Featured" size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'pastel.mint' }} />
        )}
        <Box
          className="actions"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s',
          }}
        >
          <IconButton onClick={handleAddToCart} sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
            <ShoppingCart />
          </IconButton>
          <IconButton onClick={handleWishlist} sx={{ bgcolor: 'white', color: inWishlist ? 'error.main' : 'inherit' }}>
            {inWishlist ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">{book.category?.name}</Typography>
        <Typography fontWeight={600} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 48 }}>
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{book.author}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Rating value={book.averageRating || 0} size="small" precision={0.5} readOnly />
          <Typography variant="caption" color="text.secondary">({book.reviewCount})</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography fontWeight={700} color="primary.main">${book.price.toFixed(2)}</Typography>
          {book.originalPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              ${book.originalPrice.toFixed(2)}
            </Typography>
          )}
        </Box>
        {book.stock === 0 && <Chip label="Out of Stock" size="small" color="error" sx={{ mt: 1 }} />}
      </Box>
    </Card>
  );
};

export default BookCard;
