import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/images/logo.png";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  PersonOutline as PersonOutlineIcon,
  Notifications as NotificationsIcon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
  Login as LoginIcon,
  LibraryBooks as LibraryBooksIcon,
  StarBorder as StarBorderIcon,
  Settings,
  Logout,
} from "@mui/icons-material";

export default function BaseHeader({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticationPage = [
    "/login",
    "/signup",
    "/forgot_password",
    "/auth/reset_password",
  ].includes(location.pathname);
  const {
    user,
    items_in_cart,
    token,
    number_of_orders,
    number_of_notifications,
    number_of_favourites,
  } = useSelector((store) => store.User);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    if (!token) {
      return goTo("/login");
    }

    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function goTo(path) {
    return navigate(path);
  }
  function logout() {
    handleClose();
    dispatch.User.logout();
    return goTo("/login");
  }

  return (
    <AppBar position="relative" elevation={0} color="secondary">
      <Toolbar>
        <Typography
          sx={{
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
          onClick={() => goTo("/")}
        >
          <img src={logo} alt="logo" style={{ height: "50px" }} />
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {children}
        <Box sx={{ flexGrow: 1 }} />
        {!isAuthenticationPage && (
          <Box>
            {token && (
              <Tooltip title="My cart">
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={() => goTo("/cart")}
                >
                  <Badge badgeContent={items_in_cart} color="error">
                    <ShoppingCartCheckoutIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
            {token && (
              <Tooltip title="Notifications">
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={() => goTo("/notification")}
                >
                  <Badge badgeContent={number_of_notifications} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={token ? "Account settings" : "Account login"}>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                color="inherit"
              >
                {token && <PersonOutlineIcon />}
                {!token && <LoginIcon />}
                {token && <span>Hi, {user.first_name}</span>}
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => goTo("/favourite")}>
                <ListItemIcon>
                  <Badge badgeContent={number_of_favourites} color="error">
                    <StarBorderIcon fontSize="small" />
                  </Badge>
                </ListItemIcon>
                My favourites
              </MenuItem>
              <MenuItem onClick={() => goTo("/order")}>
                <ListItemIcon>
                  <Badge badgeContent={number_of_orders} color="error">
                    <LibraryBooksIcon fontSize="small" />
                  </Badge>
                </ListItemIcon>
                My orders
              </MenuItem>
              {/* <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <FavoriteBorderIcon fontSize="small" />
                </ListItemIcon>
                My favorites
              </MenuItem> */}
              <Divider />
              <MenuItem onClick={() => goTo("/setting")}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
