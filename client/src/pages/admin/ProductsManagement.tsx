import { useQuery, useMutation } from "@apollo/client";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { getImageUrl } from "../../utils/apiUtils";
import {
  GET_PRODUCTS,
  GET_CATEGORIES,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "../../graphql/admin";

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  categoryId: string;
}

const ITEMS_PER_PAGE = 6;
const CARD_HEIGHT = 450;

const ProductsManagement = () => {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS, {
    variables: { limit: ITEMS_PER_PAGE, offset: offset },
    fetchPolicy: "cache-and-network",
  });
  const { data: categoriesData, loading: categoriesLoading } =
    useQuery(GET_CATEGORIES);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    categoryId: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    setFormData(
      product
        ? {
            name: product["name"],
            price: product["price"],
            description: product["description"] || "",
            imageUrl: product["imageUrl"] || "",
            categoryId: product["categoryId"] || "",
          }
        : {
            name: "",
            price: "",
            description: "",
            imageUrl: "",
            categoryId: "",
          }
    );
    setOpenDialog(true);
    setFormErrors({});
  };

  const handleSave = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.price) errors.price = "Price is required.";
    if (!formData.description) errors.description = "Description is required.";
    if (!formData.imageUrl) errors.imageUrl = "Image URL is required.";
    if (!editingProduct && !formData.categoryId)
      errors.categoryId = "Category is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const input: any = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl,
    };

    if (formData.categoryId) {
      input.categoryId = parseInt(formData.categoryId);
    }

    const action = editingProduct
      ? updateProduct({ variables: { id: editingProduct.id, data: input } })
      : createProduct({ variables: { data: input } });

    action
      .then(() => {
        setSnackbarOpen(true);
        setOpenDialog(false);
        refetch({ limit: ITEMS_PER_PAGE, offset: offset });
      })
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    deleteProduct({ variables: { id } })
      .then(() => {
        setSnackbarOpen(true);
        refetch({ limit: ITEMS_PER_PAGE, offset: offset });
      })
      .catch(console.error);
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    refetch({ limit: ITEMS_PER_PAGE, offset: offset });
  }, [page, offset, refetch]);

  const products = data?.admin?.adminProducts?.items || [];
  const totalCount = data?.admin?.adminProducts?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Add Product
      </Button>

      <Grid container spacing={4}>
        {products.map((product: any) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
            <Card
              sx={{
                height: CARD_HEIGHT,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <CardMedia
                component="img"
                alt={product.name}
                height="200"
                image={getImageUrl(product.imageUrl)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {product.description}
                </Typography>
                <Typography variant="body1" color="primary" sx={{ mt: 1 }}>
                  ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Category: {product.category?.name || "None"}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  px: 2,
                  pb: 2,
                }}
              >
                <IconButton
                  onClick={() => handleOpenDialog(product)}
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(product.id)}
                  color="error"
                  sx={{ ml: 1 }}
                >
                  <Delete />
                </IconButton>
              </Box>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            error={!!formErrors.price}
            helperText={formErrors.price}
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            error={!!formErrors.description}
            helperText={formErrors.description}
          />
          <TextField
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            error={!!formErrors.imageUrl}
            helperText={formErrors.imageUrl}
          />
          {categoriesLoading ? (
            <CircularProgress />
          ) : (
            <FormControl fullWidth error={!!formErrors.categoryId}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                {categoriesData?.admin?.adminCategories.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.categoryId && (
                <Typography variant="body2" color="error">
                  {formErrors.categoryId}
                </Typography>
              )}
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Operation successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsManagement;
