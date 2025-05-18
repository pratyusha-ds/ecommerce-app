import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import ProductDetails from "../components/ProductDetails";
import { GET_PRODUCT } from "../graphql/products";
import { getImageUrl } from "../utils/apiUtils";

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id: parseInt(productId || "0", 10) },
  });

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const product = data?.getProductById;

  if (!product) return <Typography>Product not found.</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <ProductDetails
        name={product.name}
        description={product.description}
        price={product.price}
        imageUrl={getImageUrl(product.imageUrl)}
        productId={product.id}
      />
    </Container>
  );
};

export default ProductPage;
