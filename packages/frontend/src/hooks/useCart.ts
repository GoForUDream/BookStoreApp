import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import {
  CART_QUERY,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_ITEM_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  CLEAR_CART_MUTATION,
} from '../graphql/operations';

export const useCart = () => {
  const { isAuthenticated } = useAuthStore();
  const { cart, setCart, isInCart, getCartItem, clearCartState } = useCartStore();

  const { refetch } = useQuery(CART_QUERY, {
    skip: !isAuthenticated,
    onCompleted: (data) => setCart(data.cart),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      clearCartState();
    }
  }, [isAuthenticated, clearCartState]);

  const [addToCartMutation] = useMutation(ADD_TO_CART_MUTATION, {
    onCompleted: (data) => {
      setCart(data.addToCart);
      toast.success('Added to cart');
    },
    onError: (err) => toast.error(err.message),
  });

  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM_MUTATION, {
    onCompleted: (data) => setCart(data.updateCartItem),
    onError: (err) => toast.error(err.message),
  });

  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART_MUTATION, {
    onCompleted: (data) => {
      setCart(data.removeFromCart);
      toast.success('Removed from cart');
    },
    onError: (err) => toast.error(err.message),
  });

  const [clearCartMutation] = useMutation(CLEAR_CART_MUTATION, {
    onCompleted: (data) => {
      setCart(data.clearCart);
      toast.success('Cart cleared');
    },
    onError: (err) => toast.error(err.message),
  });

  return {
    cart,
    isInCart,
    getCartItem,
    refetch,
    addToCart: (bookId: string, quantity = 1) => addToCartMutation({ variables: { bookId, quantity } }),
    updateQuantity: (bookId: string, quantity: number) =>
      updateCartItemMutation({ variables: { bookId, quantity } }),
    removeFromCart: (bookId: string) => removeFromCartMutation({ variables: { bookId } }),
    clearCart: () => clearCartMutation(),
  };
};
