import React from "react";
import { Container, Typography } from "@mui/material";
import CheckoutForm from "../components/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import useAuthStore from "../store/userAuthStore";
import { gql, useQuery } from "@apollo/client";
import { getCartToken } from "../utils/cartToken";
import { GET_CART } from "../graphql/cart";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

interface Order {
  address: string;
}

interface AddressData {
  me?: {
    orders?: Order[];
  };
}

const GET_ADDRESS = gql`
  query Me {
    me {
      orders {
        address
      }
    }
  }
`;

const CheckoutPage: React.FC = () => {
  const { userSession } = useAuthStore();
  const cartToken = getCartToken();

  const {
    loading: cartLoading,
    error: cartError,
    data: cartData,
  } = useQuery(GET_CART, {
    variables: { cartToken },
  });

  const {
    loading: addressLoading,
    error: addressError,
    data: addressData,
  } = useQuery<AddressData>(GET_ADDRESS, {
    skip: !userSession?.token,
  });

  const handleSubmit = async (formData: { name: string; address: string }) => {
    if (!userSession?.token) {
      console.error("User is not authenticated.");
      return;
    }

    const cart = cartData?.getCart;
    const cartItems = cart?.items || [];

    if (!cart || cartItems.length === 0) {
      console.error("Cart is empty or missing.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userSession.token}`,
        },
        body: JSON.stringify({
          query: `
            mutation CreateOrderSession($data: OrderInput!) {
              createOrderSession(data: $data) {
                sessionId
                url
                newCartToken
              }
            }
          `,
          variables: {
            data: {
              name: formData.name,
              address: formData.address,
              items: cartItems.map((item: any) => ({
                productId: item.product.id,
                quantity: item.quantity,
              })),
              cartId: cart.id,
            },
          },
        }),
      });

      const json = await res.json();

      if (json.errors) {
        throw new Error(json.errors[0].message);
      }

      const { sessionId, newCartToken } = json.data.createOrderSession;

      if (!userSession?.token && newCartToken) {
        localStorage.setItem("cart-token", newCartToken);
      }

      if (sessionId) {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId });
      } else {
        console.error("Session ID is missing.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  if (cartLoading || addressLoading) return <Typography>Loading...</Typography>;
  if (cartError || addressError)
    return <Typography color="error">Error loading data</Typography>;

  const allAddresses: string[] =
    addressData?.me?.orders?.map((order) => order.address) || [];
  const uniqueAddresses = [...new Set(allAddresses)];

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
      >
        Checkout
      </Typography>
      <CheckoutForm
        onSubmit={handleSubmit}
        previousAddresses={uniqueAddresses}
      />
    </Container>
  );
};

export default CheckoutPage;
