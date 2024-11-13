import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDialogs } from "@toolpad/core/useDialogs";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Card,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Menu,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddAddressDialog from "./AddAddressDialog.js";

export default function AddressDialog({ openAddressDialog, onClose }) {
  const dispatch = useDispatch();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const AddressStore = useSelector((store) => store.Address);
  const { addresses } = AddressStore;
  const [openAddAddressDialog, setOpenAddAddressDialog] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const defaultAddressId = addresses.find(({ is_default }) => is_default)?.id;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    loadData(); // eslint-disable-next-line
  }, []);

  async function loadData() {
    await dispatch.Address.fetchAddresses();
  }
  function handleOpenAddressDialog() {
    setAddressToEdit(null);
    setOpenAddAddressDialog(!openAddAddressDialog);
  }
  async function onChangeAddress(id) {
    try {
      await dispatch.Address.updateAddressById({
        id,
        payload: { is_default: true },
      });
      await loadData();
    } catch {}
  }
  function onEditAddress(address, closeMore) {
    setAddressToEdit(address);
    setOpenAddAddressDialog(true);
    closeMore();
  }
  function clickMore(event) {
    setAnchorEl(event.currentTarget);
  }
  function closeMore() {
    setAnchorEl(null);
  }
  async function onDeleteAddress({ id }, closeMore) {
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
      closeMore();

      notifications.show("Address is deleted successfully", {
        severity: "success",
        autoHideDuration: 4000,
      });
      await loadData();
      onClose();
    } catch {}
  }

  return (
    <Fragment>
      <AddAddressDialog
        openAddressDialog={openAddAddressDialog}
        address={addressToEdit}
        onClose={() => {
          handleOpenAddressDialog();
        }}
        loadData={() => {
          loadData();
        }}
      />
      <Dialog open={openAddressDialog} maxWidth="md">
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Shipping address
        </DialogTitle>
        <IconButton
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
          <FormControl>
            <RadioGroup
              defaultValue={defaultAddressId}
              onChange={({ target }) => onChangeAddress(target.value)}
            >
              {addresses.map((address) => {
                return (
                  <div key={address.id}>
                    <FormControlLabel
                      value={address.id}
                      sx={{ width: "85%" }}
                      control={<Radio />}
                      slots={{
                        typography: () => (
                          <Card
                            variant="outlined"
                            sx={{ p: 2, mt: 1, width: "100%" }}
                          >
                            {address.name}, {address.telephone},{" "}
                            {address.address1}
                          </Card>
                        ),
                      }}
                      label={address.name}
                    />
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? "long-menu" : undefined}
                      aria-expanded={open ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={clickMore}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      MenuListProps={{
                        "aria-labelledby": "long-button",
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      elevation={1}
                      onClose={closeMore}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => onEditAddress(address, closeMore)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        disabled={addresses.length === 1}
                        onClick={() => onDeleteAddress(address, closeMore)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Menu>
                  </div>
                );
              })}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            fullWidth
            onClick={handleOpenAddressDialog}
          >
            Add new address
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
