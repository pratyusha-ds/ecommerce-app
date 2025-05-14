import React, { useState } from "react";
import {
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { CardMedia } from "@mui/material";
import { SEARCH_PRODUCTS } from "../graphql/products";
import { getImageUrl } from "../utils/apiUtils";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [search, { loading, data, error }] = useLazyQuery(SEARCH_PRODUCTS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === "") return;
    search({ variables: { query } });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>

      {loading && <Typography>Searching...</Typography>}
      {error && <Typography color="error">Error: {error.message}</Typography>}

      {data && data.searchProducts.length === 0 && (
        <Typography>No products found.</Typography>
      )}

      <Grid container spacing={4}>
        {data?.searchProducts.map((product: any) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.2s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                },
              }}
            >
              {product.imageUrl && (
                <CardMedia
                  component="img"
                  image={getImageUrl(product.imageUrl)}
                  alt={product.name}
                  sx={{
                    height: 200,
                    objectFit: "cover",
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    height: 60,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  ${product.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  component={Link}
                  to={`/product/${product.id}`}
                  variant="contained"
                  fullWidth
                  size="medium"
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchPage;
