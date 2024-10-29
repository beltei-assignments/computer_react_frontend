import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo_profile from "../../assets/images/logo_profile.png";
import BaseHeader from "../../components/BaseHeader.js";
import BaseLoading from "../../components/BaseLoading.js";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Card,
  Avatar,
  Tooltip,
} from "@mui/material";
import { MarkEmailRead as MarkEmailReadIcon } from "@mui/icons-material";

export default function NotificationPage() {
  const dispatch = useDispatch();
  const NotificationStore = useSelector((store) => store.Notification);
  const UserStore = useSelector((store) => store.User);
  const { notofications } = NotificationStore;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!UserStore.token) return;

    loadData(); // eslint-disable-next-line
  }, []);

  function formateDate(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  async function loadData() {
    setLoading(true);
    await dispatch.Notification.fetchNotifications();
    setLoading(false);
  }
  async function makeAsRead({ id }) {
    setLoading(true);
    await dispatch.Notification.updateNotificationById({
      id,
      payload: { disable: true },
    });
    setLoading(false);
    await loadData();
    await dispatch.User.fetchUser();
  }

  return (
    <div>
      <BaseHeader />
      <BaseLoading loading={loading} />
      <Box sx={{ mx: 24, my: 3 }}>
        {!notofications.length && !loading && (
          <div style={{ textAlign: "center" }}>
            <Typography
              variant="body1"
              sx={{ color: "grey", textAlign: "center", mb: "40px" }}
            >
              You don't have notifications yet.
            </Typography>
          </div>
        )}

        {notofications.map((row) => {
          return (
            <Card sx={{ mt: 1, px: 2 }} key={row.id} elevation={0}>
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    alt="logo"
                    src={logo_profile}
                    sx={{ width: 56, height: 56, backgroundColor: "black" }}
                  />
                </Grid>
                <Grid item xs={9}>
                  <p style={{ fontWeight: "bold" }}>{row.subject}</p>
                  <p dangerouslySetInnerHTML={{ __html: row.description }} />
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "right" }}>
                  <small>{formateDate(row.created_at)}</small>
                  <Tooltip title="Make as read" sx={{ mt: 1 }}>
                    <IconButton color="inherit" onClick={() => makeAsRead(row)}>
                      <MarkEmailReadIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Box>
    </div>
  );
}
