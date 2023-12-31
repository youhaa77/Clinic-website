import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import AdbIcon from "@mui/icons-material/Adb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import WalletIcon from "@mui/icons-material/Wallet";
import axios from "axios";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useEffect, useState } from "react";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const pages = ["Home", "Medicine", "My Cart", "My Orders"];

function ResponsiveAppBar() {
  const navigate = useNavigate();

  const [unseenNotifications, setunseenNotifications] = useState();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [notfications, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/doctor/getNotfication")
      .then((response) => {
        var num = 0;
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].state === "Unread") {
            num++;
          }
        }
        setunseenNotifications(num);
        setData(response.data.reverse());
        setDataFetched(true);
      })
      .catch((error) => {
        console.log(error);
        setDataFetched(true);
      });
  }, []);

  const handleOpenPopover = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    axios
      .get("http://localhost:8000/doctor/sawNotfication")
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
    console.log("out");
    setPopoverAnchorEl(null);
  };

  const openPopover = Boolean(popoverAnchorEl);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleApp = () => {
    navigate("/doctorAppointments");
  };
  const handleHome = () => {
    navigate("/HomePageDoc");
  };
  const handlePatientsList = () => {
    navigate("/viewMyPatients");
  };
  const handleUpcoming = () => {
    navigate("/PatientUpcomingAppointments/:id");
  };

  const handleTimeSlots = () => {
    navigate("/AddTimeSlots");
  };
  const handleCall = () => {
    navigate("/Call");
  };
  const handleMyWallet = () => {
    navigate("/DoctorWallet/:doctorName");
  };

  const handleEditDoc = () => {
    navigate("/editDoctor");
  };

  const handleFollowUp = () => {
    navigate("/FollowUP/:doctorName");
  };
  const handleContract = () => {
    navigate("/contract");
  };
  const handlePass = () => {
    navigate("/changePassDoc");
  };
  const handleCloseNavMenu = () => {
    //   navigate("/cart");
    setAnchorElNav();
  };

  const handlePending = () => {
    navigate("/FollowUPPending/:doctorName");
  };

  const handleChatNavigate = () => {
    navigate("/ChatChoiceDR");
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    window.location.pathname = "/";
  };

  return (
    <AppBar
      style={{
        backgroundColor: " rgb(65, 105, 225)",
      }}
      position="static"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MedicalServicesIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/HomePageDoc"
            sx={{
              mr: 1,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 1000,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            El7a2ny
          </Typography>
          <Box
            style={{}}
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            <Button
              onClick={handleApp}
              sx={{
                color: "white",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {" "}
              Appointments{" "}
            </Button>
            <Button
              onClick={handlePatientsList}
              sx={{
                color: "white",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {" "}
              My Patients{" "}
            </Button>
            <Button
              onClick={handleUpcoming}
              sx={{
                color: "white",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {" "}
              Upcomming Appointments{" "}
            </Button>

            <Button
              onClick={handleTimeSlots}
              sx={{
                color: "white",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {" "}
              Add Time-Slots{" "}
            </Button>
            <Button
              onClick={handlePending}
              sx={{
                color: "white",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {" "}
              Pending Follow Up{" "}
            </Button>
            <Button
              onClick={handleEditDoc}
              sx={{
                color: "white",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {" "}
              Update Profile{" "}
            </Button>
            <Button
              onClick={handleContract}
              sx={{
                color: "white",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {" "}
              Contract{" "}
            </Button>
            <Button
              onClick={handlePass}
              sx={{
                color: "white",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {" "}
              Change Password{" "}
            </Button>
            <Button
              onClick={handleCall}
              sx={{
                color: "white",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {" "}
              Call{" "}
            </Button>
          </Box>

          {/* Popover with Notification Data */}
          <Popover
            open={openPopover}
            anchorEl={popoverAnchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <div>
              {dataFetched ? (
                <div>
                  {notfications &&
                    notfications.map((notifi, index) => (
                      <Card
                        sx={{
                          display: "flex",
                          maxWidth: 500,
                          backgroundColor: "skyblue",
                          border: "solid",
                          borderBlockWidth: "1px",
                        }}
                      >
                        {/* Smaller image and align to the left */}
                        <CardMedia
                          component="img"
                          alt="Notification Image"
                          height="70"
                          image="https://img.freepik.com/free-vector/appointment-booking-with-calendar_52683-39831.jpg"
                          sx={{ alignSelf: "center", marginLeft: 1 }}
                        />
                        <CardContent>
                          <div>
                            {/* Title */}
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{ marginBottom: 1 }}
                            >
                              {notifi.title}
                            </Typography>
                            {/* Text */}
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ marginBottom: 1 }}
                            >
                              {notifi.data}
                            </Typography>
                            {/* Boolean value (example: true) */}
                            <Typography
                              variant="body2"
                              style={{ color: "black" }}
                              color="text.secondary"
                            >
                              {notifi.state}
                            </Typography>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </Popover>

          <Box sx={{ flexGrow: 0 }}>
            <Badge
              style={{ transform: "none" }}
              overlap="circular"
              badgeContent={unseenNotifications}
              color="secondary"
            >
              <IconButton
                style={{ color: "white" }}
                aria-label="notifications"
                onClick={handleOpenPopover}
              >
                <NotificationsIcon style={{ fontSize: "2rem" }} />
              </IconButton>
            </Badge>
            <Tooltip title=" Chat">
              <IconButton
                style={{ paddingLeft: "10px" }}
                onClick={handleChatNavigate}
              >
                <ChatIcon fontSize="large" sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="My Wallet">
              <IconButton style={{}} onClick={handleMyWallet}>
                <WalletIcon fontSize="large" sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title="Logout">
              <IconButton onClick={handleSubmit}>
                <AccountCircleIcon fontSize="large" sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
