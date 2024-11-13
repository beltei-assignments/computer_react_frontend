import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import BaseHeader from "../../components/BaseHeader.js";
import AddressDialog from "../../components/checkout/AddressDialog.js";
import AddAddressDialog from "../../components/checkout/AddAddressDialog.js";
import PaymentDialog from "../../components/PaymentDialog.js";
import {
  Box,
  CardMedia,
  Grid,
  Skeleton,
  IconButton,
  Typography,
  Card,
  Divider,
} from "@mui/material";
import {
  AddCircleOutline as AddCircleOutlineIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
} from "@mui/icons-material";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const CartStore = useSelector((store) => store.Cart);
  const UserStore = useSelector((store) => store.User);
  const AddressStore = useSelector((store) => store.Address);
  const { addresses } = AddressStore;
  const { carts } = CartStore;
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [openAddAddressDialog, setOpenAddAddressDialog] = useState(false);
  const [disabledOrderBtn, setdisabledOrderBtn] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState(null);

  useEffect(() => {
    if (!UserStore.token) return;

    loadData(); // eslint-disable-next-line
  }, []);
  useEffect(() => {
    computeTotalAmount();

    const exceedCart = carts.find(({ product }) => !product.quantity);
    if (exceedCart) {
      setdisabledOrderBtn(true);
    }
  }, [carts]);
  useEffect(() => {
    const address = addresses.find(({ is_default }) => is_default);
    if (address) {
      setDefaultAddress(address);
    }
  }, [addresses]);

  function handleOpenPaymentDialog() {
    setOpenPaymentDialog(!openPaymentDialog);
  }
  function handleOpenAddressDialog() {
    setOpenAddressDialog(!openAddressDialog);
  }
  function handleOpenAddAddressDialog() {
    setOpenAddAddressDialog(!openAddAddressDialog);
  }
  function computeTotalAmount() {
    const amount = carts.reduce(
      (acc, { quantity, product }) => acc + quantity * Number(product.price),
      0
    );
    setTotalAmount(amount);
  }
  async function loadData() {
    await dispatch.Cart.getCarts();
  }
  async function loadAdress() {
    await dispatch.Address.fetchAddresses();
  }
  async function onChangeQuantity(item, isPlusQty) {
    try {
      const quantity = isPlusQty ? item.quantity + 1 : item.quantity - 1;

      item.quantity = quantity;
      dispatch.Cart.setQuantity(item);
      computeTotalAmount();

      const payload = { quantity };
      await dispatch.Cart.updateCartById({ id: item.id, payload });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <BaseHeader />
      <PaymentDialog
        openAddressDialog={openPaymentDialog}
        onClose={() => {
          handleOpenPaymentDialog();
        }}
      />
      <AddressDialog
        openAddressDialog={openAddressDialog}
        onClose={() => {
          handleOpenAddressDialog();
        }}
      />
      <AddAddressDialog
        openAddressDialog={openAddAddressDialog}
        address={null}
        onClose={() => {
          handleOpenAddAddressDialog();
        }}
        loadData={() => {
          loadAdress();
        }}
      />
      <Box sx={{ mx: 24, my: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Card elevation={0} sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Shipping address
                  </Typography>

                  {!!addresses.length && defaultAddress && (
                    <Typography variant="body1">
                      {defaultAddress.name} {defaultAddress.telephone},{" "}
                      {defaultAddress.address1} / {defaultAddress.address2},{" "}
                      {defaultAddress.region}, {defaultAddress.post_code},{" "}
                      {defaultAddress.city}, {defaultAddress.country}
                    </Typography>
                  )}
                  {!defaultAddress && (
                    <Typography variant="body1">Add new address</Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {!!addresses.length && (
                    <Button
                      variant="outlined"
                      onClick={handleOpenAddressDialog}
                    >
                      Change
                    </Button>
                  )}
                  {!addresses.length && (
                    <Button
                      variant="outlined"
                      onClick={handleOpenAddAddressDialog}
                    >
                      Add
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Card>
            {/* <Card elevation={0} sx={{ p: 2, mt: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Payment Methods
              </Typography>
              <Typography variant="body1">Add a new card</Typography>
            </Card> */}
            <Card elevation={0} sx={{ p: 2, mt: 1 }}>
              {carts.map((row, index) => {
                return (
                  <Card key={row.id} elevation={0}>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={2}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {!row.product.image && (
                          <div style={{ width: 100, marginTop: 4 }}>
                            <Skeleton
                              sx={{ background: "#7878785d" }}
                              variant="rectangular"
                              width="100%"
                              height={57}
                            />
                            <Skeleton
                              sx={{ background: "#7878785d" }}
                              width="100%"
                            />
                            <Skeleton
                              sx={{ background: "#7878785d" }}
                              width="60%"
                            />
                          </div>
                        )}

                        {row.product.image && (
                          <CardMedia
                            component="img"
                            height="104"
                            alt="product png"
                            src={row.product.image}
                          />
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <p>
                          Name: <strong>{row.product.name}</strong>
                        </p>
                        <p>
                          Brand: <strong>{row.product.category.name}</strong>
                        </p>
                        <p>
                          Code: <strong>{row.product.product_code}</strong>
                        </p>
                        <p>
                          Available quantity:{" "}
                          <strong>{row.product.quantity}</strong>
                        </p>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        ${Number(row.product.price).toFixed(2)}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <IconButton
                          size="small"
                          color="inherit"
                          disabled={row.quantity === 1}
                          onClick={() => onChangeQuantity(row, false)}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                        <span style={{ fontWeight: "bold" }}>
                          {row.quantity}
                        </span>
                        <IconButton
                          size="small"
                          color="inherit"
                          disabled={
                            !row.product.quantity ||
                            row.quantity === row.product.quantity
                          }
                          onClick={() => onChangeQuantity(row, true)}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Divider />
                  </Card>
                );
              })}
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card sx={{ p: 2 }} elevation={0}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Summary
              </Typography>
              <Typography variant="body1">
                Subtotal US: <strong>${Number(totalAmount).toFixed(2)}</strong>
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1">
                Total US: <strong>${Number(totalAmount).toFixed(2)}</strong>
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                disabled={
                  disabledOrderBtn ||
                  !addresses.length ||
                  !carts.length ||
                  !defaultAddress
                }
                onClick={handleOpenPaymentDialog}
              >
                Place order
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
