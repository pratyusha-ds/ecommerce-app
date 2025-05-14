import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
  Pagination,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { GET_CATEGORY_PRODUCTS } from "../graphql/categories";
import { getImageUrl } from "../utils/apiUtils";

const ITEMS_PER_PAGE = 6;

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [page, setPage] = useState(1);
  const categoryIdInt = categoryId ? parseInt(categoryId) : 0;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const { loading, error, data, refetch } = useQuery(GET_CATEGORY_PRODUCTS, {
    variables: { id: categoryIdInt, limit: ITEMS_PER_PAGE, offset: offset },
    fetchPolicy: "cache-and-network",
  });

  const products = data?.categoryProducts?.items || [];
  const totalCount = data?.categoryProducts?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    refetch({ id: categoryIdInt, limit: ITEMS_PER_PAGE, offset: offset });
  }, [page, categoryIdInt, offset, refetch]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", textTransform: "capitalize" }}
      >
        {data?.getCategoryById?.name || "Category"}
      </Typography>

      {loading ? (
        <Typography>Loading products...</Typography>
      ) : error ? (
        <Typography color="error">Error: {error.message}</Typography>
      ) : products.length === 0 ? (
        <Typography>No products found in this category.</Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {products.map((product: any) => (
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
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(product.imageUrl)}
                    alt={product.name}
                  />
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
          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              page={page}
              onChange={handleChangePage}
              sx={{ mt: 4, display: "flex", justifyContent: "center" }}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default CategoryPage;
