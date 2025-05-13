import React from "react";
import {
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Snackbar,
} from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import { getCartToken } from "../utils/cartToken";
import useCartStore from "../store/cartStore";

const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int!, $cartToken: String) {
    addToCart(
      productId: $productId
      quantity: $quantity
      cartToken: $cartToken
    ) {
      id
      items {
        id
        quantity
        product {
          id
          name
          price
        }
      }
    }
  }
`;

interface ProductDetailsProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  productId: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  name,
  description,
  price,
  imageUrl,
  productId,
}) => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const { items, setCart } = useCartStore();

  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const currentItem = items.find((item) => item.product.id === productId);
  const quantityInCart = currentItem?.quantity || 0;

  const handleAddToCart = async () => {
    try {
      const cartToken = getCartToken();
      const { data } = await addToCartMutation({
        variables: { productId, quantity: 1, cartToken },
      });

      if (data?.addToCart) {
        setCart(data.addToCart);
      }

      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardMedia
              component="img"
              height="400"
              image={imageUrl}
              alt={name}
              sx={{ objectFit: "cover", borderRadius: "12px" }}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {description}
            </Typography>
            <Typography variant="h5" sx={{ mb: 3, color: "primary.main" }}>
              ${price.toFixed(2)}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                size="large"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              {quantityInCart > 0 && (
                <Typography variant="body1" color="text.secondary">
                  ×{quantityInCart}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        message="Product added to cart!"
      />
    </>
  );
};

export default ProductDetails;
