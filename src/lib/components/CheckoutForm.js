import React, { useState } from "react";
import { createPaymentAPI } from "../../api/payment.js";
import { useDispatch, useSelector } from "react-redux";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@toolpad/core/useNotifications";
import LoadingButton from "@mui/lab/LoadingButton";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useNotifications();
  const CartStore = useSelector((store) => store.Cart);
  const AddressStore = useSelector((store) => store.Address);
  const [loading, setLoading] = useState(false);
  const { addresses } = AddressStore;
  const { carts } = CartStore;

  async function handleSubmit(event) {
    event.preventDefault();

    if (elements == null || stripe == null) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError?.message) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { token } = await stripe.createToken(cardElement);
    if (!token?.id) {
      return;
    }

    setLoading(true);
    try {
      const items = carts.map(({ fk_product_id, quantity, product }) => ({
        fk_product_id,
        quantity,
        price: product.price,
      }));
      const address = addresses.find(({ is_default }) => is_default);
      const payload = JSON.stringify({
        currency: "usd",
        paymentMethodType: "card",
        stripeToken: token.id,
        items,
        address,
      });
      const { success } = await createPaymentAPI(payload);

      if (success) {
        notifications.show("You have ordered successfully", {
          severity: "success",
        });
        setLoading(false);
        await dispatch.User.fetchUser();
        navigate("/order");
      }

      // const { client_secret: clientSecret } = await res.json();

      // const { error } = await stripe.confirmPayment({
      //   //`Elements` instance that was used to create the Payment Element
      //   elements,
      //   // clientSecret,
      //   confirmParams: {
      //     return_url: `${window.location.origin}/`,
      //   },
      // });
    } catch (error) {
      setLoading(false);
      if (error.status !== 500) {
        return notifications.show(error.response.data?.message, {
          severity: "error",
          autoHideDuration: 4000,
        });
      }

      notifications.show("Something went wrong while ordering", {
        severity: "error",
        autoHideDuration: 4000,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-4" style={{ width: "500px" }}>
      {/* <PaymentElement /> */}
      <CardElement
        options={{
          iconStyle: "solid",
          hidePostalCode: true,
          style: { base: { fontSize: "18px" } },
        }}
      />
      <LoadingButton
        type="submit"
        variant="contained"
        loading={loading}
        fullWidth
        disabled={!stripe || !elements}
        sx={{ mt: 2 }}
      >
        Pay
      </LoadingButton>
    </form>
  );
}
