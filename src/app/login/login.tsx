"use client";

import {
  Button,
  Container,
  TextField,
  Typography,
  styled,
  Checkbox,
  FormControl,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { IWithClassName } from "@/app/theme/default";
import loginSchema from "@/app/common/validation/login";
import React, { useState, ChangeEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/common/firebase-config"; 
import SquareIcon from '@mui/icons-material/Square';

enum Label {
  email = "email",
  password = "password",
  rememberMe = "remember-me",
}

const Login = ({ className }: IWithClassName) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setLoader] = useState(false);

  const router = useRouter();

  const [error, setError] = useState<{
    email: null | string;
    password: null | string;
  }>({
    email: null,
    password: null,
  });

  const onChangeText =
    (label: string) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      switch (label) {
        case Label.email:
          setEmail(target.value);
          break;
        case Label.password:
          setPassword(target.value);
          break;
        case Label.rememberMe:
          setRememberMe(target.checked);
      }
    };

  const validate = () => {
    const { error } = loginSchema.validate({ email, password, rememberMe });

    if (error) {
      const { context, message } = error.details[0];

      console.log("error", error);

      setError(() => ({
        email: null,
        password: null,
        [context?.label ?? Label.email]: message,
      }));
    } else if (email && password) {
      setLoader(true);

      signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
          if (res) {
            const user = res.user;
            user
              .getIdToken()
              .then((token) => {
                localStorage.setItem("userToken", token);
              })
              .catch((error) => {
                console.error("Error getting ID token:", error);
              });
            // Store other user details in session if needed (optional)
            sessionStorage.setItem("userId", user.uid);
            sessionStorage.setItem("userEmail", user.email || "");
            router.push("/dashboard");
          }
        })
        .catch(() => {
          // console.error("Login error:", error);
          setError({ email: "Invalid email or password", password: null });
        })
        .finally(() => {
          setLoader(false);
        });
    }
  };

  return (
    <Container className={className}>
      <FormControl>
        <Typography variant="h4">Sign In</Typography>
      </FormControl>
      <FormControl>
        <TextField
          placeholder="Email"
          onChange={onChangeText(Label.email)}
          helperText={error.email}
          error={!!error.email}
        />
      </FormControl>
      <FormControl>
        <TextField
          placeholder="Password"
          type="password"
          onChange={onChangeText(Label.password)}
          error={!!error.password}
          helperText={error.password}
        />
      </FormControl>
      <FormControl className="center-cont">
        <FormControlLabel
          control={<Checkbox onChange={onChangeText(Label.rememberMe)} icon={<SquareIcon className="uncheckbox-icon"/>}/>}
          label="Remember Me"
        />
      </FormControl>
      <FormControl className="center-cont">
        {isLoading ? 
          <CircularProgress /> : 
          <Button onClick={validate}>
            Login
          </Button>}
      </FormControl>
    </Container>
  );
};

export default styled(Login)(({theme}) => ({
  width: "40%",
  minWidth: 200,
  textAlign: "center",
  alignItems: "center",
  verticalAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  height: "inherit",
  justifyContent: "center",
  ".center-cont": {
    alignItems: "center",
  },
  ".MuiFormControl-root": {
    width: 300,
    ".MuiInputBase-root": {
      width: "inherit",
    },
    ".MuiButtonBase-root": {
      width: "inherit",
    },
  },
  ".uncheckbox-icon": {
    fill: theme.palette.background.paper,
  }
}));
