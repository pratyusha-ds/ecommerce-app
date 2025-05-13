import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigationType } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { getCartToken } from "../utils/cartToken";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/userAuthStore";
import { GET_CART, REMOVE_CART_ITEM, CLEAR_CART } from "../graphql/cart";

interface CartItemType {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

const CartPage: React.FC = () => {
  const cartToken = getCartToken();
  const isAuthenticated = useAuthStore((state) => state.isUserAuthenticated);
  const shouldFetch = isAuthenticated || !!cartToken;

  const cartStore = useCartStore((state) => state);
  const setCart = useCartStore((state) => state.setCart);
  const clearCartStore = useCartStore((state) => state.clearCart);
  const isCartTransferred = useCartStore((state) => state.isCartTransferred);
  const setCartTransferred = useCartStore((state) => state.setCartTransferred);

  const { loading, error, refetch } = useQuery(GET_CART, {
    skip: !shouldFetch,
    variables: { cartToken },
    onCompleted: (fetchedData) => {
      if (fetchedData?.getCart) {
        setCart(fetchedData.getCart);
        if (cartToken && !isAuthenticated && !isCartTransferred) {
          setCartTransferred(true);
        }
      }
    },
  });

  const [removeCartItem] = useMutation(REMOVE_CART_ITEM, {
    onCompleted: (res) => {
      if (res?.removeCartItem) {
        setCart(res.removeCartItem);
      }
    },
  });

  const [clearCart] = useMutation(CLEAR_CART, {
    onCompleted: () => {
      clearCartStore();
    },
  });

  const navigationType = useNavigationType();
  useEffect(() => {
    if (navigationType === "PUSH" || navigationType === "POP") {
      refetch();
    }
  }, [navigationType, refetch]);

  const cartItems: CartItemType[] = cartStore.items || [];
  const cartId = cartStore.id;

  const total = cartItems.reduce((acc, item) => {
    if (!item.product || typeof item.product.price !== "number") return acc;
    return acc + item.product.price * item.quantity;
  }, 0);

  const handleRemove = async (itemId: number) => {
    try {
      await removeCartItem({ variables: { itemId } });
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      if (cartId) {
        await clearCart({ variables: { cartId } });
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isCartTransferred) {
      clearCartStore();
      useCartStore.getState().setCartTransferred(false);
    }
  }, [isAuthenticated, isCartTransferred, clearCartStore]);

  if (loading) return <Typography>Loading cart...</Typography>;
  if (error) return <Typography color="error">Error loading cart.</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Stack spacing={3}>
          {cartItems
            .filter(
              (item) => item.product && typeof item.product.name === "string"
            )
            .map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.product.name}
                price={item.product.price}
                quantity={item.quantity}
                onRemove={handleRemove}
              />
            ))}

          <Divider />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <CartSummary total={total} />
          </Box>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleClearCart}
            sx={{ mt: 3 }}
          >
            Clear Cart
          </Button>
        </Stack>
      )}
    </Container>
  );
};

export default CartPage;
