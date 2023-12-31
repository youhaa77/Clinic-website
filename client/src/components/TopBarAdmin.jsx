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
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const pages = ["Home", "Medicine", "My Cart", "My Orders"];

function ResponsiveAppBar() {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleAdd = () => {
    navigate("/addAdministrator");
  };
  const handleHome = () => {
    navigate("/HomePageAdmin");
  };
  const handleRemove = () => {
    navigate("/removeUser");
  };
  const handlePending = () => {
    navigate("/pendingDoctors");
  };
  const handlePackages = () => {
    navigate("/adminHealthPackage");
  };
  const AddhandlePackages = () => {
    navigate("/adminaddHealthPackage");
  };
  const handlePass = () => {
    navigate("/changePassAdm");
  };
  const handleCloseNavMenu = () => {
    //   navigate("/cart");
    setAnchorElNav();
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
            href="/HomePageAdmin"
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
              onClick={handleAdd}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {" "}
              Add Admin{" "}
            </Button>
            <Button
              onClick={handleRemove}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {" "}
              Remove User{" "}
            </Button>
            <Button
              onClick={handlePending}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {" "}
              Doctor Pending{" "}
            </Button>
            <Button
              onClick={handlePackages}
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
              onClick={AddhandlePackages}
              sx={{
                color: "white",
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {" "}
              Add Health Packages{" "}
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
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Logout">
              <IconButton
                style={{ paddingLeft: "20px" }}
                onClick={handleSubmit}
                sx={{ p: 0 }}
              >
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
