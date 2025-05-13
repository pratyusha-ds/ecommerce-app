import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import useAuthStore from "../store/userAuthStore";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Button,
  List,
  ListItem,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemText,
  Avatar,
  TextField,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UPDATE_PROFILE, GET_PROFILE } from "../graphql/profile";

import { getImageUrl } from "../utils/apiUtils";

const Profile = () => {
  const { userSession, logoutUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [editableName, setEditableName] = useState("");
  const [editableEmail, setEditableEmail] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">(
    "success"
  );

  const navigate = useNavigate();

  const {
    loading,
    data,
    error: queryError,
    refetch,
  } = useQuery(GET_PROFILE, {
    skip: !userSession?.token,
  });

  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      setSnackMessage("Profile updated successfully");
      setSnackSeverity("success");
      setSnackOpen(true);
      refetch();
    },
    onError: () => {
      setSnackMessage("Failed to update profile");
      setSnackSeverity("error");
      setSnackOpen(true);
    },
  });

  useEffect(() => {
    if (!userSession?.token || userSession.role !== "user") {
      navigate("/login");
    }
  }, [userSession, navigate]);

  useEffect(() => {
    if (queryError) {
      setError("Failed to load profile data");
    } else if (data?.me) {
      setEditableName(data.me.name || "");
      setEditableEmail(data.me.email || "");
    }
  }, [queryError, data]);

  const handleSave = () => {
    updateProfile({ variables: { name: editableName, email: editableEmail } });
  };

  const handleCloseSnack = () => {
    setSnackOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const profile = data?.me;

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3 }}>
      <Card sx={{ padding: 3 }}>
        <Typography variant="h4">My Profile</Typography>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={editableName}
          onChange={(e) => setEditableName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={editableEmail}
          onChange={(e) => setEditableEmail(e.target.value)}
        />

        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={updating}
          sx={{ mt: 2 }}
        >
          {updating ? "Saving..." : "Save Changes"}
        </Button>

        <Button
          onClick={logoutUser}
          variant="outlined"
          color="secondary"
          sx={{ mt: 2, ml: 2 }}
        >
          Logout
        </Button>
      </Card>

      <Card sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h5">My Orders</Typography>
        <List sx={{ marginTop: 2 }}>
          {profile?.orders?.length > 0 ? (
            profile.orders.map((order: any) => (
              <Accordion key={order.id} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">
                    Order #{order.id} — ${order.total.toFixed(2)} —{" "}
                    {order.status}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Delivery Address:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {order.address}
                    </Typography>
                  </Box>

                  {order.orderItems?.length > 0 ? (
                    order.orderItems.map((item: any) => (
                      <ListItem key={item.id} disableGutters>
                        <Avatar
                          src={getImageUrl(item.product.imageUrl)}
                          alt={item.product.name}
                          variant="square"
                          sx={{ width: 56, height: 56, marginRight: 2 }}
                        />
                        <ListItemText
                          primary={`${item.product.name} x ${item.quantity}`}
                          secondary={`$${item.product.price.toFixed(2)} each`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography>No items in this order.</Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body1">
              You don't have any orders yet.
            </Typography>
          )}
        </List>
      </Card>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackSeverity}
          onClose={handleCloseSnack}
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
