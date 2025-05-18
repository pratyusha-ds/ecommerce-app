import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import { useState } from "react";

interface CheckoutFormProps {
  onSubmit: (data: { name: string; address: string }) => Promise<void>;
  previousAddresses?: string[];
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  previousAddresses = [],
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, address });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedAddress(val);
    setAddress(val);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, mx: "auto", py: 4 }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
      >
        Checkout
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {previousAddresses.length > 0 && (
          <FormControl component="fieldset">
            <FormLabel component="legend">Select a previous address</FormLabel>
            <RadioGroup value={selectedAddress} onChange={handleAddressChange}>
              {previousAddresses.map((addr, index) => (
                <FormControlLabel
                  key={index}
                  value={addr}
                  control={<Radio />}
                  label={addr}
                />
              ))}
              <FormControlLabel
                value=""
                control={<Radio />}
                label="Enter a new address"
              />
            </RadioGroup>
            <Divider sx={{ my: 2 }} />
          </FormControl>
        )}

        <TextField
          label="Shipping Address"
          variant="outlined"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {loading ? "Placing Order..." : "Place Order"}
        </Button>
      </Stack>
    </Box>
  );
};

export default CheckoutForm;
