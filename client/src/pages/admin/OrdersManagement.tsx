import { useQuery, useMutation } from "@apollo/client";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { getImageUrl } from "../../utils/apiUtils";
import {
  GET_ADMIN_ORDERS,
  UPDATE_ORDER_STATUS,
  DELETE_ORDER,
  GET_ORDER_DETAILS,
} from "../../graphql/admin";

interface OrderDetails {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  name: string;
  address: string;
  user: { email: string };
  orderItems: {
    id: number;
    quantity: number;
    price: number;
    product: { id: number; name: string; price: number; imageUrl: string };
  }[];
}

const OrdersManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { loading, error, data, refetch } = useQuery(GET_ADMIN_ORDERS, {
    variables: {
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    },
  });
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);
  const [deleteOrderMutation] = useMutation(DELETE_ORDER);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const {
    loading: detailsLoading,
    error: detailsError,
    data: detailsData,
  } = useQuery(GET_ORDER_DETAILS, {
    skip: !selectedOrderId,
    variables: { orderId: selectedOrderId },
  });
  const orderDetails: OrderDetails | undefined = detailsData?.admin?.adminOrder;
  const totalOrders = data?.admin?.totalAdminOrders || 0;

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus({ variables: { orderId, status: newStatus } });
      refetch();
      setSnackbarMessage(`Order #${orderId} status updated to ${newStatus}`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error("Error updating order status:", err);
      setSnackbarMessage(
        `Failed to update status for Order #${orderId}: ${err.message}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (
      window.confirm(
        `Are you sure you want to delete Order #${orderId}? This action cannot be undone.`
      )
    ) {
      try {
        const { data: deleteData } = await deleteOrderMutation({
          variables: { orderId },
        });
        if (deleteData?.admin?.deleteOrder?.success) {
          setSnackbarMessage(`Order #${orderId} deleted successfully.`);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          refetch();
        } else if (deleteData?.admin?.deleteOrder?.message) {
          setSnackbarMessage(
            `Failed to delete Order #${orderId}: ${deleteData.admin.deleteOrder.message}`
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage(`Failed to delete Order #${orderId}.`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (err: any) {
        console.error("Error deleting order:", err);
        setSnackbarMessage(`Error deleting Order #${orderId}: ${err.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseSnackbar = (_: any, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrderId(null);
  };

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const orders = data?.admin?.adminOrders || [];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="admin orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>User Email</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell component="th" scope="row">
                  {order.id}
                </TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>
                  {new Date(Number(order.createdAt)).toLocaleDateString()}
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <InputLabel id={`status-select-label-${order.id}`}>
                      Status
                    </InputLabel>
                    <Select
                      labelId={`status-select-label-${order.id}`}
                      id={`status-select-${order.id}`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="PAID">Paid</MenuItem>
                      <MenuItem value="SHIPPED">Shipped</MenuItem>
                      <MenuItem value="DELIVERED">Delivered</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                      <MenuItem value="REFUNDED">Refunded</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton
                      aria-label="view"
                      onClick={() => handleOpenDetails(order.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Order">
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteOrder(order.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalOrders}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={isDetailsOpen}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Order Details #{selectedOrderId}</DialogTitle>
        <DialogContent>
          {detailsLoading ? (
            <CircularProgress />
          ) : detailsError ? (
            <Typography color="error">Error: {detailsError.message}</Typography>
          ) : orderDetails ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Typography>Email: {orderDetails.user.email}</Typography>
              <Typography>Name: {orderDetails.name}</Typography>
              <Typography>Address: {orderDetails.address}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                Order Items
              </Typography>
              <List>
                {orderDetails.orderItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={`${item.product.name} x ${item.quantity}`}
                      secondary={`Price: $${item.product.price.toFixed(
                        2
                      )} - Subtotal: $${(
                        item.quantity * item.product.price
                      ).toFixed(2)}`}
                    />
                    {item.product.imageUrl && (
                      <Box sx={{ ml: 2 }}>
                        <img
                          src={getImageUrl(item.product.imageUrl)}
                          alt={item.product.name}
                          style={{ height: 50, width: 50, objectFit: "cover" }}
                        />
                      </Box>
                    )}
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: ${orderDetails.total.toFixed(2)}
              </Typography>
              <Typography>Status: {orderDetails.status}</Typography>
              <Typography>
                Order Date:{" "}
                {new Date(Number(orderDetails.createdAt)).toLocaleString()}
              </Typography>
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OrdersManagement;
