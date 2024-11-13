import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNotifications } from "@toolpad/core/useNotifications";
import { Formik, Form, Field } from "formik";
import { InputText, Select } from "../form/index.js";
import BaseHeader from "../../components/BaseHeader.js";

import { Card, CardActions, CardContent, Box, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import HttpsIcon from "@mui/icons-material/Https";

const formSchema = yup.object().shape({
  first_name: yup.string().required("Field required"),
  last_name: yup.string().required("Field required"),
  gender: yup.string().required("Field required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Field required"),
});
const genders = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);

  function goToLogin() {
    navigate("/login");
  }
  async function save(form) {
    setLoading(true);
    try {
      await dispatch.User.register(form);
      setLoading(false);

      notifications.show(
        "We have sent an account registration to your email address",
        {
          severity: "success",
        }
      );
      navigate("/login");
    } catch ({ status, response }) {
      setLoading(false);
      if (status != 500 && response.data) {
        const message =
          response.data.message || Object.values(response.data.message)[0];
        return notifications.show(message, {
          severity: "error",
          autoHideDuration: 3000,
        });
      }

      notifications.show("Something went wrong while connecting", {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }

  return (
    <div>
      <BaseHeader />
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      >
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            gender: "",
            email: "",
          }}
          validationSchema={formSchema}
          onSubmit={save}
        >
          {() => (
            <Form>
              <Card elevation={0} sx={{ width: 500 }}>
                <CardContent>
                  <div style={{ textAlign: "center" }}>
                    <HttpsIcon fontSize="large" />
                    <Typography
                      component="h1"
                      variant="h4"
                      sx={{
                        fontSize: "clamp(2rem, 10vw, 2rem)",
                      }}
                    >
                      Sign up an account
                    </Typography>
                    <p>
                      Welcome to Public of Gamer, please sign up to continue
                    </p>
                  </div>
                  <Field
                    component={InputText}
                    name="first_name"
                    label="First name"
                    required
                  />
                  <Field
                    component={InputText}
                    name="last_name"
                    label="Last name"
                    required
                  />
                  <Field
                    component={Select}
                    name="gender"
                    label="Gender"
                    textValue="id"
                    textShow="name"
                    items={genders}
                    required
                  />
                  <Field
                    component={InputText}
                    name="email"
                    label="Email"
                    required
                  />
                </CardContent>
                <CardActions>
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <LoadingButton
                      type="submit"
                      loading={loading}
                      fullWidth
                      variant="contained"
                    >
                      SIGN UP
                    </LoadingButton>
                    <div>
                      <p>You already have an account,</p>
                      <Typography
                        component="strong"
                        sx={(theme) => ({
                          color: theme.palette.primary.main,
                          cursor: "pointer",
                        })}
                        onClick={goToLogin}
                      >
                        Sign in
                      </Typography>
                    </div>
                  </div>
                </CardActions>
              </Card>
            </Form>
          )}
        </Formik>
      </Box>
    </div>
  );
}
