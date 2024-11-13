import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDialogs } from "@toolpad/core/useDialogs";
import { useNotifications } from "@toolpad/core/useNotifications";
import BaseHeader from "../../components/BaseHeader.js";
import BaseLoading from "../../components/BaseLoading.js";
import { ORDER_STATUS, ORDER_STATUS_COLORS } from "../../constants/index.js";
import {
  Box,
  CardMedia,
  Grid,
  Skeleton,
  Typography,
  Card,
  Button,
  Chip,
} from "@mui/material";

export default function CartPage() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const dialogs = useDialogs();
  const dispatch = useDispatch();
  const OrderStore = useSelector((store) => store.Order);
  const { orders } = OrderStore;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData(); // eslint-disable-next-line
  }, []);

  async function loadData() {
    setLoading(true);
    await dispatch.Order.getOrders();
    setLoading(false);
  }
  function goTo(path) {
    return navigate(path);
  }
  async function onRemveOrder({ id }) {
    const confirmed = await dialogs.confirm(
      "Are you sure to remove your order?",
      {
        okText: "Yes",
        cancelText: "No",
      }
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await dispatch.Order.deleteOrderById(id);
      notifications.show("Your order is removed", {
        severity: "success",
        autoHideDuration: 4000,
      });
      setLoading(false);
      await loadData();
    } catch {
      setLoading(false);
    }
  }
  async function confirmReceived({ id }) {
    try {
      setLoading(true);
      await dispatch.Order.updateOrderById({
        id,
        payload: { status: ORDER_STATUS.RECEIVED },
      });
      setLoading(false);
      await loadData();
      await dispatch.User.fetchUser();
    } catch (e) {
      console.log(e);

      setLoading(false);
    }
  }

  return (
    <div>
      <BaseHeader />
      <BaseLoading loading={loading} />
      <Box sx={{ mx: 36, my: 3 }}>
        {!orders.length && !loading && (
          <div style={{ textAlign: "center" }}>
            <Typography
              variant="body1"
              sx={{ color: "grey", textAlign: "center", mb: "40px" }}
            >
              You don't have order yet, please go to add one.
            </Typography>

            <Button variant="outlined" onClick={() => goTo("/")}>
              Explor items
            </Button>
          </div>
        )}

        {orders.map((row) => {
          return (
            <Card sx={{ mt: 1, px: 3, pt: 1 }} key={row.id} elevation={0}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <small>
                    <strong>Order ID</strong>: {row.id}
                  </small>
                  <br />
                  <small>
                    <strong>Order date</strong>: {row.created_at}
                  </small>
                  <br />
                  <small>
                    <strong>Estimate time</strong>: {row.estimate_time}
                  </small>
                  <br />
                  <small>
                    <strong>Shipping address:</strong> {row.contact_name}{" "}
                    {row.telephone}, {row.address1} / {row.address2},{" "}
                    {row.region}, {row.post_code}, {row.city}, {row.country}
                  </small>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ textAlign: "right" }}>
                    <strong>Total: US ${Number(row.amount).toFixed(2)}</strong>
                    <Chip
                      sx={{ m: 1, textTransform: "capitalize" }}
                      label={row.status}
                      color={ORDER_STATUS_COLORS[row.status]}
                    />
                    {row.status === ORDER_STATUS.DELIVERED && (
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ ml: 2, mb: 1 }}
                        onClick={() => confirmReceived(row)}
                      >
                        Confirm received
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      sx={{ ml: 2, mb: 1 }}
                      onClick={() => onRemveOrder(row)}
                    >
                      Remove
                    </Button>
                  </div>
                </Grid>
              </Grid>
              {row.orderProducts.map((item) => {
                return (
                  <Grid container spacing={1} key={item.id}>
                    <Grid
                      item
                      xs={2}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      {!item.product.image && (
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

                      {item.product.image && (
                        <CardMedia
                          component="img"
                          height="104"
                          alt="product png"
                          src={item.product.image}
                        />
                      )}
                    </Grid>

                    <Grid item xs={8}>
                      <p>{item.product.name}</p>
                      <p>
                        <strong>Brand</strong>: {item.product.category.name}
                      </p>
                      <p>
                        US ${Number(item.unit_price).toFixed(2)} x
                        {item.quantity}
                      </p>
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: "right" }}>
                      <p>
                        Total: US $
                        {Number(item.quantity * item.unit_price).toFixed(2)}
                      </p>
                    </Grid>
                  </Grid>
                );
              })}
            </Card>
          );
        })}
      </Box>
    </div>
  );
}
