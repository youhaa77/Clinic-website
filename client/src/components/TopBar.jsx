import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import axios from "axios";
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
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircularProgress from "@mui/material/CircularProgress";
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

  /*useEffect(() => {
    
      try {
        console.log("hna 27na")
        const result = await axios.get("http://localhost:8000/patient/getNotfication");
        
        setunseenNotifications();
        setData(result.data);
        setDataFetched(true);
      } catch (err) {
        console.log(err);
        setDataFetched(true);
      }
    

  })*/
  useEffect(() => {
    axios
      .get("http://localhost:8000/patient/getNotfication")
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
      .get("http://localhost:8000/patient/sawNotfication")
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
  const handleDoctorList = () => {
    navigate("/AllDoctors");
  };
  const handleHome = () => {
    navigate("/HomePage");
  };
  const handlePresList = () => {
    navigate("/PrescriptionsList");
  };
  const handleAddFamilyMember = () => {
    navigate("/PatientHP_FM");
  };
  const handlePack = () => {
    navigate("/healthPackage");
  };
  const handleCall = () => {
    navigate("/Call");
  };
  const handleMyApp = () => {
    navigate("/patientFamilyAppointments");
  };
  const handleHealthRecords = () => {
    navigate("/PatientHealthRecords/:patientId");
  };
  const handleMyWallet = () => {
    navigate("/PatientWallet/:patientName");
  };
  const handlePass = () => {
    navigate("/changePassPat");
  };
  const handleCloseNavMenu = () => {
    //   navigate("/cart");
    setAnchorElNav();
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleChatNavigate = () => {
    navigate("/ChatChoice");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    window.location.pathname = "/";
  };
  // if (!dataFetched) {
  //   return <CircularProgress color="success" />
  //     ; // Render nothing until data is fetched
  // }

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
            href="/HomePage"
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
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={handleDoctorList}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {" "}
              Doctors{" "}
            </Button>
            <Button
              onClick={handlePresList}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {" "}
              Prescriptions{" "}
            </Button>
            <Button
              onClick={handleAddFamilyMember}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {" "}
              Family Members{" "}
            </Button>
            <Button
              onClick={handleMyApp}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {" "}
              My Appointments{" "}
            </Button>

            <Button
              onClick={handleHealthRecords}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {" "}
              Health Records{" "}
            </Button>
            <Button
              onClick={handlePack}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {" "}
              Health Packages{" "}
            </Button>

            <Button
              onClick={handlePass}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
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
                fontSize: "13px",
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
                  {notfications.map((notifi, index) => (
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
              <IconButton onClick={handleChatNavigate}>
                <ChatIcon fontSize="large" sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="My Wallet">
              <IconButton style={{}} onClick={handleMyWallet}>
                <WalletIcon fontSize="large" sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout}>
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
