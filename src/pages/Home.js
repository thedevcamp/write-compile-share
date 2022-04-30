import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Card,
} from "@mui/material/";
import CodeOffIcon from "@mui/icons-material/CodeOff";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const Home = () => {
  const [roomID, setRoomID] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();

    setRoomID(id);
    toast.success("Room Created", {
      duration: 4000,
      position: "top-center",
      // Custom Icon {U+270C}
      icon: `✌️`,
    });
  };

  const joinRoom = () => {
    if (!roomID || !username) {
      toast.error("ROOMID & USERNAME Required!!");
      return;
    }
    //Redirect
    navigate(`/editor/${roomID}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={true}
          md={12}
          sx={{
            backgroundImage:
              "url(https://picsum.photos/1080/1920.webp/?blur=2)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* <div maxWidth= style={{backgroundColor: '#ffffff', width: '3'}}> */}
          <Card
            sx={{
              maxWidth: 400,
              mx: "auto",
              marginTop: "10%",
              paddingBottom: "4%",
              borderRadius: 5,
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
            }}
            xs={6}
            md={true}
          >
            <Container component="main" maxWidth="xs" xs={6} md={true}>
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    m: 1,
                    bgcolor: "secondary.main",
                    width: 56,
                    height: 56,
                  }}
                >
                  <CodeOffIcon />
                </Avatar>
                <Typography
                  component="h1"
                  variant="h6"
                  style={{ fontWeight: "bold" }}
                >
                  <code>&lt; REAL CODE COLLABORATOR &frasl;&gt;</code>
                </Typography>
                <Box
                  component="form"
                  // onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="text"
                    label="Room ID"
                    name="roomID"
                    autoFocus
                    onChange={(e) => setRoomID(e.target.value)}
                    value={roomID}
                    onKeyUp={handleInputEnter}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="username"
                    label="Username"
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    onKeyUp={handleInputEnter}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={joinRoom}
                  >
                    Join
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link style={{ textDecoration: "none", color: "#000" }}>
                        If you don't have one, then
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2" onClick={createNewRoom}>
                        {"CLICK HERE"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Container>
          </Card>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Home;
