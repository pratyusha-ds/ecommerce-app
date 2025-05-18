import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { getImageUrl } from "../../utils/apiUtils";
import {
  GET_CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "../../graphql/admin";

const CategoriesManagement = () => {
  const { loading, error, data, refetch } = useQuery(GET_CATEGORIES);
  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [addCategoryName, setAddCategoryName] = useState("");
  const [addImageUrl, setAddImageUrl] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const handleAddCategory = () => {
    createCategory({
      variables: { name: addCategoryName, imageUrl: addImageUrl },
    })
      .then(() => {
        setSnackbarOpen(true);
        setOpenAddDialog(false);
        setAddCategoryName("");
        setAddImageUrl("");
        refetch();
      })
      .catch(console.error);
  };

  const handleDeleteCategory = (id: number) => {
    const confirmDelete = window.confirm(
      "This will delete the category and all its products. Continue?"
    );
    if (!confirmDelete) return;

    deleteCategory({ variables: { id } })
      .then(() => {
        setSnackbarOpen(true);
        refetch();
      })
      .catch((error) => {
        setErrorMessage(error.message || "Failed to delete category.");
        setErrorSnackbarOpen(true);
      });
  };

  const handleEditCategory = () => {
    if (selectedCategory) {
      updateCategory({
        variables: {
          id: selectedCategory.id,
          name: editCategoryName,
          imageUrl: editImageUrl,
        },
      })
        .then(() => {
          setSnackbarOpen(true);
          setOpenEditDialog(false);
          setEditCategoryName("");
          setEditImageUrl("");
          refetch();
        })
        .catch(console.error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Categories
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setOpenAddDialog(true)}
        sx={{ mb: 3 }}
      >
        Add Category
      </Button>

      <Grid container spacing={3}>
        {data?.admin?.adminCategories?.map((category: any) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={category.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {category.imageUrl && (
                <CardMedia
                  component="img"
                  height="160"
                  image={getImageUrl(category.imageUrl)}
                  alt={category.name}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {category.name}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: "auto" }}>
                <IconButton
                  onClick={() => {
                    setSelectedCategory(category);
                    setEditCategoryName(category.name);
                    setEditImageUrl(category.imageUrl || "");
                    setOpenEditDialog(true);
                  }}
                  color="primary"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteCategory(category.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            value={addCategoryName}
            onChange={(e) => setAddCategoryName(e.target.value)}
            autoFocus
          />
          <TextField
            label="Image URL"
            fullWidth
            value={addImageUrl}
            onChange={(e) => setAddImageUrl(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            autoFocus
          />
          <TextField
            label="Image URL"
            fullWidth
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditCategory} color="primary">
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

      {/* Error Snackbar */}
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setErrorSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriesManagement;
