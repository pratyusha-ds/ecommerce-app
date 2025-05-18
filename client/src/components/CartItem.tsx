import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Box,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  onRemove,
}) => {
  return (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" color="text.secondary">
              ${price.toFixed(2)} x {quantity}
            </Typography>
          </Box>
          <IconButton color="error" onClick={() => onRemove(id)}>
            <Delete />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CartItem;
