import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

interface CartSummaryProps {
  total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ total }) => {
  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Cart Summary
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Total: ${total.toFixed(2)}
      </Typography>
      <Stack spacing={2}>
        <Button component={Link} to="/checkout" variant="contained" fullWidth>
          Proceed to Checkout
        </Button>
        <Button component={Link} to="/" variant="outlined" fullWidth>
          Continue Shopping
        </Button>
      </Stack>
    </Box>
  );
};

export default CartSummary;
