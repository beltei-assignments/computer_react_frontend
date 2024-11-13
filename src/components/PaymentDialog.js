import * as React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckoutForm from "../lib/components/CheckoutForm.js";

const options = {
  mode: "payment",
  amount: 1099,
  currency: "usd",
  // Fully customizable with appearance API.
};

export default function PaymentDialog({ openAddressDialog, onClose }) {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_PK);

  async function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <React.Fragment>
      <Dialog open={openAddressDialog} maxWidth="md">
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Payment
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              handleSubmit={(event) => {
                handleSubmit(event);
              }}
            />
          </Elements>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
