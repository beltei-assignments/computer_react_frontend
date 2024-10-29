import * as React from "react";
import logo from "../assets/images/logo.png";
import { Card, Grid } from "@mui/material";

export default function BaseFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Card
      sx={(theme) => ({
        color: "grey",
        backgroundColor: theme.palette.secondary.main,
        mt: 4,
      })}
      color="secondary"
      elevation={0}
    >
      <div style={{ margin: "60px 200px" }}>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <img src={logo} style={{ height: "100px" }} />
          </Grid>
          <Grid item xs={4}>
            <h3>Email Contacts</h3>
            <p>sales@publicofgamer.com</p>
            <p>supports@publicofgamer.com</p>
          </Grid>
          <Grid item xs={3}>
            <h3>Shop Address</h3>
            <p>
              No. 540, Koh Pich street, Khan Chamkarmorn, Phnom Penh Cambodia.
            </p>
          </Grid>
        </Grid>
        <p>© {currentYear}, Public of Gamer. All Rights Reserved.</p>
      </div>
    </Card>
  );
}
