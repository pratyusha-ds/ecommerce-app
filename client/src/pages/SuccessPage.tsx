import React, { useEffect } from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

const SuccessPage: React.FC = () => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart(); //
  }, [clearCart]);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Order Successful!
      </Typography>
      <Typography variant="body1" sx={{ mb: 5 }}>
        Thank you for your purchase. Your order is being processed.
      </Typography>
      <Button component={Link} to="/" variant="contained" size="large">
        Back to Home
      </Button>
    </Container>
  );
};

export default SuccessPage;
