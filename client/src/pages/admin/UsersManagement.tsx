import { useQuery, useMutation } from "@apollo/client";
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { GET_USERS, DELETE_USER } from "../../graphql/admin";

const UsersManagement = () => {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleOpenDialog = (id: string) => {
    setSelectedUserId(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUserId(null);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;
    try {
      await deleteUser({ variables: { id: selectedUserId } });
      await refetch();
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      handleCloseDialog();
    }
  };

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Joined</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.admin.adminUsers.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.name || "—"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {new Date(Number(user.createdAt)).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Delete User">
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDialog(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersManagement;
