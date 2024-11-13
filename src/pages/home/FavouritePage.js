import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDialogs } from "@toolpad/core/useDialogs";
import { useNotifications } from "@toolpad/core/useNotifications";
import Button from "@mui/material/Button";
import BaseHeader from "../../components/BaseHeader.js";
import BaseLoading from "../../components/BaseLoading.js";
import {
  Box,
  CardMedia,
  Grid,
  Skeleton,
  IconButton,
  Typography,
  Card,
  Checkbox,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
} from "@mui/icons-material";

export default function FavouritePage() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const dialogs = useDialogs();
  const dispatch = useDispatch();
  const FavouriteStore = useSelector((store) => store.Favourite);
  const UserStore = useSelector((store) => store.User);
  const { favourites } = FavouriteStore;
  const [loading, setLoading] = useState(false);
  const [favouritesToAction, setFavouritesToAction] = useState([]);

  useEffect(() => {
    if (!UserStore.token) return;

    loadData(); // eslint-disable-next-line
  }, []);

  async function loadData() {
    setLoading(true);
    await dispatch.Favourite.getFavourites();
    setLoading(false);
  }
  function goTo(path) {
    return navigate(path);
  }
  async function addToCart() {
    const favouritesSelected = favourites.filter(({ id }) =>
      favouritesToAction.includes(id)
    );

    for await (const {
      fk_product_id,
      quantity_to_cart,
    } of favouritesSelected) {
      await dispatch.Cart.createCart({
        fk_product_id,
        quantity: quantity_to_cart,
      });
    }

    notifications.show("Your favourite(s) is added to cart", {
      severity: "success",
      autoHideDuration: 4000,
    });
    await dispatch.User.fetchUser();
  }
  async function onDeleteItem() {
    const confirmed = await dialogs.confirm(
      "Are you sure to remove your favourite(s)?",
      {
        okText: "Yes",
        cancelText: "No",
      }
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await dispatch.Favourite.deleteFavourites(favouritesToAction);
      notifications.show("Your favourite(s) is removed", {
        severity: "success",
        autoHideDuration: 4000,
      });
      setFavouritesToAction([]);
      await loadData();
      await dispatch.User.fetchUser();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  function onCheck({ id }, isCheck) {
    const newList = [...favouritesToAction];
    if (isCheck) {
      newList.push(id);
    } else {
      const index = newList.findIndex((item) => item === id);
      newList.splice(index, 1);
    }

    setFavouritesToAction(newList);
  }
  async function onChangeQuatity(item, isIncrement) {
    if (isIncrement) {
      item.quantity_to_cart += 1;
    } else {
      item.quantity_to_cart -= 1;
    }

    dispatch.Favourite.setFavourite(item);
  }

  return (
    <div>
      <BaseHeader />
      <BaseLoading loading={loading} />
      <Box sx={{ mx: 24, my: 3 }}>
        {favourites.length > 0 && (
          <div style={{ marginBottom: 20, textAlign: "right" }}>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              startIcon={<DeleteIcon />}
              disabled={!favouritesToAction.length}
              onClick={onDeleteItem}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              startIcon={<ShoppingCartCheckoutIcon />}
              disabled={!favouritesToAction.length}
              onClick={addToCart}
            >
              Add to cart
            </Button>
          </div>
        )}

        {!favourites.length && !loading && (
          <div style={{ textAlign: "center" }}>
            <Typography
              variant="body1"
              sx={{ color: "grey", textAlign: "center", mb: "40px" }}
            >
              You don't have favourite yet, please go to add one.
            </Typography>

            <Button variant="outlined" onClick={() => goTo("/")}>
              Explor items
            </Button>
          </div>
        )}

        {favourites.map((row) => {
          return (
            <Card key={row.id} elevation={0}>
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    m: 1,
                  }}
                >
                  <Checkbox onChange={(e) => onCheck(row, e.target.checked)} />
                  {!row.product.image && (
                    <div style={{ width: 100, marginTop: 4 }}>
                      <Skeleton
                        sx={{ background: "#7878785d" }}
                        variant="rectangular"
                        width="100%"
                        height={57}
                      />
                      <Skeleton sx={{ background: "#7878785d" }} width="100%" />
                      <Skeleton sx={{ background: "#7878785d" }} width="60%" />
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
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {row.product.name}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {row.product.category.name}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {row.product.quantity}{" "}
                  {row.product.quantity > 1 ? "availables" : "available"}
                </Grid>
                <Grid
                  item
                  xs={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  ${Number(row.product.price).toFixed(2)}
                </Grid>
                <Grid
                  item
                  xs={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconButton
                    size="small"
                    color="inherit"
                    disabled={row.quantity_to_cart <= 1}
                    onClick={() => onChangeQuatity(row, false)}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <span style={{ fontWeight: "bold" }}>
                    {row.quantity_to_cart}
                  </span>
                  <IconButton
                    size="small"
                    color="inherit"
                    disabled={
                      !row.product.quantity ||
                      row.quantity_to_cart === row.product.quantity
                    }
                    onClick={() => onChangeQuatity(row, true)}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Box>
    </div>
  );
}
