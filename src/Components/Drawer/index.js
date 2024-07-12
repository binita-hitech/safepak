import * as React from "react";
import { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  ChevronLeft,
  ChevronRight,
  Dashboard,
  Dns,
  People,
  Inventory,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Groups,
  ViewStream,
  Settings,
  GppMaybe,
  Adjust,
  LocalShipping,
  Sync,
  Navigation,
} from "@mui/icons-material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  ClickAwayListener,
  Collapse,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  SwipeableDrawer,
  Snackbar,
  Button,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import httpclient from "../../Utils";
import useTokenRefresh from "../../Hooks/useTokenRefresh";
import Img from "../Images/synccare-1.png"

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const drawerWidth = 320;

const openedMixin = (theme) => ({
  width: drawerWidth,

  backgroundColor: theme.palette.primary.dark,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",

  width: "0px",

  backgroundColor: theme.palette.primary.dark,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  marginLeft: "20px",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  "& img": {
    width: "230px",
    height: "45px",
    marginTop: "7px",
  },
  "& a": {
    textDecoration: "none",
    color: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    display: "flex",
    alignItems: "center",
  },
  "& h3": {
    letterSpacing: "1px",
    fontSize: "25px",
    margin: "0",
  },
  "& small": {
    fontSize: "13px",
    position: "relative",
    top: "10px",
    left: "-3px",
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: theme.palette.primary.main,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down("md")]: {
      width: "100%",
      zIndex: theme.zIndex.drawer - 1,
    },
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  backgroundColor: theme.palette.primary.dark,

  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Swipeable = styled(SwipeableDrawer)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.primary.dark,
  },
}));



const MenuListButton = styled(ListItemButton)(({ theme }) => ({
  opacity: "0.7",
  transition: "0.3s",
  fontWeight: "400",
  margin: "5px 8px",
  borderRadius: "10px",

  color: theme.palette.primary.light,
  "& svg": {
    color: theme.palette.primary.light,
    fontSize: "22px",
  },
  "& span": {
    fontWeight: "600",
    fontSize: "15px",
  },
  "&:hover": {
    opacity: "1",
  },
  "&:active": {
    opacity: "1",
  },
  "&:focus": {
    opacity: "1",
  },
}));

const AvatarDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  "& span": {
    color: theme.palette.primary.light,
    fontSize: "18px",
    marginRight: "10px",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));



export default function MiniDrawer({children, menuList}) {

  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(true);
  const [openPopper, setOpenPopper] = React.useState(false);

  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
  const navigate = useNavigate();
  var loginData = localStorage.getItem("user");
  var loginValue = JSON.parse(loginData);

  
  React.useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  const resize = () => {
    setScreenWidth(window.innerWidth);
  };

  const handleDrawerOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleDrawerMobileOpen = () => {
    setMobileOpen(true);
  };

  const handleDrawerMobileClose = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setOpenPopper(false);
    navigate("/login");
  };




  const handlePopperOpen = () => {
    setOpenPopper((prev) => !prev);
  };

  const handleClosePopper = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenPopper(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenPopper(false);
    } else if (event.key === "Escape") {
      setOpenPopper(false);
    }
  };

  const MenuDiv = styled("div")(({ theme }) => ({
    display: "none",
    [theme.breakpoints.down("md")]: {
      display: mobileOpen ? "none" : "block",
    },
  }));

  const DesktopMenuDiv = styled("div")(({ theme }) => ({
    display: "block",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  }));


  const handleNavigation = (menu) => {
    navigate(`${menu.path}`);

  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* NAVBAR */}
      <AppBar position="fixed" open={screenWidth > 768 ? open : mobileOpen}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <DesktopMenuDiv>
            <IconButton onClick={handleDrawerOpen}>
              {open ? (
                <ChevronLeft fontSize="large" style={{ color: "#fff" }} />
              ) : (
                <MenuIcon fontSize="large" style={{ color: "#fff" }} />
              )}
            </IconButton>
          </DesktopMenuDiv>

          <MenuDiv>
            <IconButton onClick={handleDrawerMobileOpen}>
              <MenuIcon fontSize="large" style={{ color: "#fff" }} />
            </IconButton>
          </MenuDiv>

          <AvatarDiv>
            <span>
              {loginValue.full_name}
            </span>
            <Avatar
              alt={loginValue.full_name}
              sx={{
                width: 43,
                height: 43,
                cursor: "pointer",
                border: `2px solid #fafafa`,
              }}
              onClick={handlePopperOpen}
              ref={anchorRef}
            />

            <Popper
              open={openPopper}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClosePopper}>
                      <MenuList
                        autoFocusItem={openPopper}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </AvatarDiv>

        </Toolbar>
      </AppBar>
      {/* NAVBAR */}

      {/* SIDEBAR OR DRAWER */}
      {screenWidth > 768 ? (
        <Drawer open={open} variant="permanent">
          <DrawerHeader>
            <Link to="/">
              {/* <h3>Sync Care</h3> */}
              <img src={Img} alt="synccare_logo" />
              {/*<small>{Global.version}</small> */}
            </Link>
          </DrawerHeader>
          <Divider />

          <List>
            {menuList.map((menu, index) => (
              <ListItem key={menu.id} disablePadding>
                <MenuListButton onClick={() => handleNavigation(menu)} >
                  <ListItemIcon>
                    {/* {index % 2 === 0 ? <Dns /> : <Settings/>} */}
                  </ListItemIcon>
                  <ListItemText primary={menu.name}/>
                </MenuListButton>
              </ListItem>
            ))}
          </List>


        </Drawer>
      ) : (
        <Swipeable
          anchor="left"
          open={mobileOpen}
          onOpen={handleDrawerMobileOpen}
          onClose={handleDrawerMobileClose}
        >
          <DrawerHeader>
            <Link to="/">
            <img src={Img} alt="synccare_logo" />
            </Link>
          </DrawerHeader>
          <Divider />
          <List>
            {menuList.map((menu, index) => (
              <ListItem key={menu.id} disablePadding>
                <MenuListButton onClick={() => handleNavigation(menu)} >
                  <ListItemIcon>
                    {/* {index % 2 === 0 ? <Dns /> : <Settings/>} */}
                  </ListItemIcon>
                  <ListItemText primary={menu.name} />
                </MenuListButton>
              </ListItem>
            ))}
          </List>

        </Swipeable>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          height: "100% !important",
          overflowX: "hidden",
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
