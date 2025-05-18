import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Button,
  Pagination,
  Container,
  Box,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useQuery } from "@apollo/client";
import { GET_FEATURED_PRODUCTS } from "../graphql/products";
import { GET_CATEGORIES } from "../graphql/categories";
import { getImageUrl } from "../utils/apiUtils";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
};

const PAGE_SIZE = 6;

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 4000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

const HomePage = () => {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery(GET_FEATURED_PRODUCTS);
  const {
    data: catData,
    loading: catLoading,
    error: catError,
  } = useQuery(GET_CATEGORIES);

  const products = data?.featuredProducts || [];
  const categories = catData?.getAllCategories || [];

  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE);
  const pageCount = Math.ceil(products.length / PAGE_SIZE);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Slider {...carouselSettings}>
          {[
            {
              text: "Summer Sale - Up to 50% OFF!",
              img: "https://images.unsplash.com/photo-1521127376958-80338b32f37b?q=80&w=2048&auto=format&fit=crop",
            },
            {
              text: "New Arrivals: Check Them Out!",
              img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2080&auto=format&fit=crop",
            },
            {
              text: "Shop Quality Products Today",
              img: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?q=80&w=2080&auto=format&fit=crop",
            },
          ].map((slide, idx) => (
            <Box
              key={idx}
              sx={{
                height: { xs: 220, sm: 350, md: 450 },
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={slide.img}
                alt={slide.text}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 2,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                    fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  {slide.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Shop by Category
      </Typography>

      {catLoading ? (
        <Typography>Loading categories...</Typography>
      ) : catError ? (
        <Typography color="error">
          Error loading categories: {catError.message}
        </Typography>
      ) : (
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {categories.map(
            (cat: { id: number; name: string; imageUrl: string }) =>
              cat.imageUrl ? (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: 2,
                      "&:hover": {
                        boxShadow: 5,
                        transform: "scale(1.03)",
                        transition: "all 0.3s ease-in-out",
                      },
                    }}
                    component={Link}
                    to={`/category/${cat.id}`}
                  >
                    <Box
                      component="img"
                      src={getImageUrl(cat.imageUrl)}
                      alt={cat.name}
                      sx={{ width: "100%", height: 180, objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="h6" align="center">
                        {cat.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ) : null
          )}
        </Grid>
      )}

      <Divider sx={{ mb: 6 }} />

      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Featured Products
      </Typography>

      {loading ? (
        <Typography>Loading products...</Typography>
      ) : error ? (
        <Typography color="error">Error: {error.message}</Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {paginatedProducts.map((product: Product) =>
              product.imageUrl ? (
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
                      <Box
                        component="img"
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        sx={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          borderRadius: 2,
                          mt: 2,
                        }}
                      />
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
              ) : null
            )}
          </Grid>
          <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default HomePage;
