import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNotifications } from "@toolpad/core/useNotifications";
import BaseHeader from "../../components/BaseHeader.js";
import BaseFooter from "../../components/BaseFooter.js";
import {
  Box,
  CardMedia,
  Grid,
  Skeleton,
  Typography,
  Card,
  Button,
  Divider,
  CardContent,
  IconButton,
} from "@mui/material";
import {
  AddCircleOutline as AddCircleOutlineIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
} from "@mui/icons-material";

export default function ProdoctPage() {
  const { id: productId } = useParams();
  const notifications = useNotifications();
  const dispatch = useDispatch();
  const ProductStore = useSelector((store) => store.Product);
  const [quantityToCart, setQuantityToCart] = useState(1);
  const { product, products } = ProductStore;
  const [selectedImageId, setSelectdImageId] = useState(1);
  const [selectedImage, setSelectdImage] = useState(null);

  useEffect(() => {
    loadData(); // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (!product.fk_category_id) return;

    setSelectdImageId(product.productImages[0]?.id);

    dispatch.Product.getProducts({
      isScrollMore: false,
      include_product_images: true,
      fk_category_id: product.fk_category_id,
      not_include_ids: JSON.stringify([product.id]),
      page: 1,
      limit: 12,
    });
  }, [product]);

  async function loadData() {
    await dispatch.Product.getProductById(productId);
  }
  function goToProduct({ id }) {
    return window.open(`/item/${id}`, "_blank");
  }
  async function addToCart() {
    if (!product.id) return;

    await dispatch.Cart.createCart({
      fk_product_id: product.id,
      quantity: quantityToCart,
    });
    setQuantityToCart(1);
    notifications.show("Product have been added to cart", {
      severity: "success",
      autoHideDuration: 4000,
    });
    await dispatch.User.fetchUser();
  }
  function onChangeQuantity(isIncrement) {
    if (isIncrement) {
      setQuantityToCart((old) => old + 1);
      return;
    }
    setQuantityToCart((old) => old - 1);
  }
  function onClickImage({ id, image }) {
    setSelectdImageId(id);
    setSelectdImage(image);
  }

  return (
    <div>
      <BaseHeader />
      <Box sx={{ mx: 24, my: 3 }}>
        <Card sx={{ p: 2 }} elevation={0}>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              {!product.image && (
                <div>
                  <Skeleton
                    sx={{ background: "#7878785d" }}
                    variant="rectangular"
                    width="100%"
                    height={230}
                  />
                  <Skeleton sx={{ background: "#7878785d" }} width="100%" />
                  <Skeleton sx={{ background: "#7878785d" }} width="60%" />
                </div>
              )}
              {product.image && (
                <CardMedia
                  component="img"
                  height="280"
                  sx={{ p: 1 }}
                  src={selectedImage || product.image}
                />
              )}
              <div
                style={{ display: "flex", justifyContent: "left", gap: "8px" }}
              >
                {product.productImages.length > 1 &&
                  product.productImages.map((row) => {
                    return (
                      <Card
                        key={row.id}
                        variant={selectedImageId === row.id ? "outlined" : ""}
                        sx={{ cursor: "pointer", p: 1 }}
                        onClick={() => onClickImage(row)}
                      >
                        <CardMedia
                          component="img"
                          height="80"
                          src={row.image}
                        />
                      </Card>
                    );
                  })}
              </div>
            </Grid>
            <Grid item xs={7}>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                style={{ fontWeight: "bold" }}
              >
                {product.name}
              </Typography>
              <Divider />
              <p>Brand: {product.category?.name}</p>
              <p>Product Code: {product.product_code}</p>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                style={{ fontWeight: "bold" }}
              >
                ${product.price && Number(product.price).toFixed(2)}
              </Typography>
              <Divider />
              <div style={{ marginTop: "12px", display: "flex" }}>
                <div>
                  <IconButton
                    size="small"
                    color="inherit"
                    disabled={!product.quantity || quantityToCart === 1}
                    onClick={() => onChangeQuantity(false)}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <span style={{ fontWeight: "bold" }}>{quantityToCart}</span>
                  <IconButton
                    size="small"
                    color="inherit"
                    disabled={
                      !product.quantity || quantityToCart >= product.quantity
                    }
                    onClick={() => onChangeQuantity(true)}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <small>
                    {product.quantity}{" "}
                    {product.quantity > 1 ? "availables" : "available"}
                  </small>
                </div>
                <Button variant="outlined" sx={{ ml: 2 }} onClick={addToCart}>
                  ADD TO CART
                </Button>
              </div>
            </Grid>
          </Grid>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            style={{ fontWeight: "bold" }}
          >
            DESCRIPTION
          </Typography>
          <Divider />
          <div
            style={{ marginBottom: "10px" }}
            dangerouslySetInnerHTML={{
              __html: product.description2?.replace(/\n/g, "<br />"),
            }}
          />
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            style={{ fontWeight: "bold" }}
          >
            RELATED PRODUCTS
          </Typography>
          <Divider />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {products.map((row) => {
              return (
                <Grid item lg={3} md={3} sm={4} key={row.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "350px",
                      p: 2,
                      background: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => goToProduct(row)}
                  >
                    {!row.image && (
                      <div>
                        <Skeleton
                          sx={{ background: "#7878785d" }}
                          variant="rectangular"
                          width="100%"
                          height={175}
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

                    {row.image && (
                      <CardMedia
                        component="img"
                        height="150"
                        alt="product png"
                        src={row.image}
                      />
                    )}

                    <CardContent style={{ textAlign: "center" }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        style={{ fontWeight: "bold" }}
                      >
                        {row.name}
                      </Typography>
                      <Typography variant="body" sx={{ color: "grey" }}>
                        {row.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Card>
      </Box>
      <BaseFooter />
    </div>
  );
}
