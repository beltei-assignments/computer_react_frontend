import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDialogs } from "@toolpad/core/useDialogs";
import { useNotifications } from "@toolpad/core/useNotifications";
import { GENDERS } from "../../constants/index.js";
import {
  styled,
  Box,
  Grid,
  Typography,
  Card,
  Button,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from "@mui/material";
import BaseHeader from "../../components/BaseHeader.js";
import PersonalInfoDialog from "../components/PersonalInfoDialog.js";
import AddAddressDialog from "../../components/checkout/AddAddressDialog.js";
import BaseLoading from "../../components/BaseLoading.js";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.main,
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: theme.palette.main,
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function SettingPage() {
  const dispatch = useDispatch();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const UserStore = useSelector((store) => store.User);
  const AddressStore = useSelector((store) => store.Address);
  const { user } = UserStore;
  const { addresses } = AddressStore;
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddressDialog, setOpenAdressDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [tab, setTab] = useState(0);
  const gender = GENDERS.find(({ value }) => value == user.gender);

  useEffect(() => {
    loadAdress(); // eslint-disable-next-line
  }, []);

  async function loadAdress() {
    setLoading(true);
    await dispatch.Address.fetchAddresses();
    setLoading(false);
  }
  function handleDialog() {
    setOpenDialog(!openDialog);
  }
  function handleChangeTab(_, newValue) {
    setTab(newValue);
  }
  function handleOpenAdress() {
    setAddress(null);
    setOpenAdressDialog(!openAddressDialog);
  }
  function onEditAddress(address) {
    setAddress(address);
    setOpenAdressDialog(!openAddressDialog);
  }
  async function onDeleteAddress({ id }) {
    const confirmed = await dialogs.confirm(
      "Are you sure to delete your address?",
      {
        okText: "Yes",
        cancelText: "No",
      }
    );
    if (!confirmed) return;

    try {
      await dispatch.Address.deleteAddressById(id);
      notifications.show("Address is deleted successfully", {
        severity: "success",
        autoHideDuration: 4000,
      });
      await loadAdress();
    } catch {}
  }
  async function onChangeDefaultAddress({ id, is_default }) {
    try {
      await dispatch.Address.updateAddressById({
        id,
        payload: {
          is_default: !is_default,
        },
      });
      await loadAdress();
    } catch {}
  }

  return (
    <div>
      <BaseLoading loading={loading} />
      <PersonalInfoDialog
        open={openDialog}
        user={user}
        onClose={() => {
          handleDialog();
        }}
      />
      <AddAddressDialog
        openAddressDialog={openAddressDialog}
        address={address}
        onClose={() => {
          handleOpenAdress();
        }}
        loadData={() => {
          loadAdress();
        }}
      />
      <BaseHeader />
      <Box sx={{ mx: 24, my: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Card elevation={0} sx={{ px: 2, py: 1 }}>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ m: 0, fontWeight: "bold" }}
              >
                Account
              </Typography>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                aria-label="Vertical tabs example"
                value={tab}
                sx={{
                  borderRight: 1,
                  borderColor: "divider",
                }}
                onChange={handleChangeTab}
              >
                <Tab label="Setting" sx={{ alignItems: "start" }} />
                <Tab label="Billing address" sx={{ alignItems: "start" }} />
              </Tabs>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <div role="tabpanel" hidden={tab !== 0}>
              <Card
                elevation={0}
                sx={{
                  height: "40px",
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{ m: 0, fontWeight: "bold" }}
                >
                  Setting
                </Typography>
              </Card>
              <Card elevation={0} sx={{ mt: 2, px: 2, py: 1 }}>
                <p>Personal information</p>
                <p>
                  <strong>First name</strong>: {user.first_name}
                </p>
                <p>
                  <strong>Last name</strong>: {user.last_name}
                </p>
                <p>
                  <strong>Gender</strong>: {gender?.label}
                </p>
                <p>
                  <strong>Email address</strong>: {user.email}
                </p>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={handleDialog}
                >
                  Edit
                </Button>
              </Card>
            </div>
            <div role="tabpanel" hidden={tab !== 1}>
              <Card
                elevation={0}
                sx={{
                  height: "40px",
                  px: 2,
                  py: 1,
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{ m: 0, fontWeight: "bold" }}
                >
                  Billing address
                </Typography>
                <Button variant="outlined" onClick={handleOpenAdress}>
                  Add
                </Button>
              </Card>
              {addresses.map((row) => (
                <Card key={row.id} elevation={0} sx={{ mt: 1, px: 2, py: 1 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      {" "}
                      <p>
                        <strong>Contact name</strong>: {row.name}
                      </p>
                      <p>
                        <strong>Phone number</strong>: {row.telephone}
                      </p>
                      <p>
                        <strong>Company</strong>: {row.company}
                      </p>
                      <p>
                        <strong>Address 1</strong>: {row.address1}
                      </p>
                      <p>
                        <strong>Address 2</strong>: {row.address2}
                      </p>
                    </Grid>
                    <Grid item xs={6}>
                      <p>
                        <strong>City</strong>: {row.city}
                      </p>
                      <p>
                        <strong>Post code</strong>: {row.post_code}
                      </p>
                      <p>
                        <strong>Country</strong>: {row.country}
                      </p>
                      <p>
                        <strong>Region</strong>: {row.region}
                      </p>
                      <FormControlLabel
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            checked={row.is_default === 1}
                            onChange={() => onChangeDefaultAddress(row)}
                          />
                        }
                        label="Set as default"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => onEditAddress(row)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, ml: 2 }}
                    disabled={addresses.length === 1}
                    onClick={() => onDeleteAddress(row)}
                  >
                    Delete
                  </Button>
                </Card>
              ))}
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
