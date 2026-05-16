import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Divider } from "@mui/material";
import CreatePostModal from "../post/CreatePostModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "../../../lib/store";
import { getAllNotification, getUnreadNotificationCount, makeNotificationRead, resetUnreadCount } from "../../../lib/notificationSlice";
import NotificationItem from "./NotificationItem";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const [token, setToken] = React.useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogOut = () => {
    localStorage.removeItem("userToken");
    setToken(null);
    handleMenuClose();
    router.push("/logout");
  };

  React.useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    setToken(storedToken);

    // Only fetch count if we have a token AND we aren't currently zeroed out locally
    // This prevents the badge from reappearing after we just cleared it
    if (storedToken && storedToken !== "undefined" && storedToken !== "null" && pathname !== "/notifications") {
      const currentCount = store.getState().notification.unreadNotificationsCount?.data?.unreadCount;
      if (currentCount !== 0) {
        dispatch(getUnreadNotificationCount());
      }
    }
  }, [dispatch, pathname]);

  const { unreadNotificationsCount, allNotification } = useSelector((state: RootState) => state.notification);
  const badgeCount = unreadNotificationsCount?.data?.unreadCount || 0;

  // for handle menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // for handle mobile menu
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  // for handle notifications menu
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationsMenuOpen = Boolean(notificationsAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
    dispatch(getAllNotification());
    // Persist "marked as read" so badge stays 0 even after hard reload
    localStorage.setItem("ag_marked_read", Date.now().toString());
    dispatch(resetUnreadCount());
    dispatch(makeNotificationRead());
  };
  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: { mt: 1.5, borderRadius: 2, minWidth: 150 },
      }}
    >
      <MenuItem onClick={handleMenuClose} component={Link} href="/profile" sx={{ color: "#333", fontWeight: 500 }}>
        Profile
      </MenuItem>
      <MenuItem onClick={handleLogOut} sx={{ color: "#d32f2f", fontWeight: 500 }}>
        LogOut
      </MenuItem>
    </Menu>
  );

  const notificationsMenuId = "primary-notifications-menu";
  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={notificationsMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isNotificationsMenuOpen}
      onClose={handleNotificationsMenuClose}
      PaperProps={{
        elevation: 3,
        sx: { mt: 1.5, borderRadius: 2, minWidth: 300, maxWidth: 350, maxHeight: 400 },
      }}
    >
      <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 700, color: "#1976d2" }}>
        Notifications
      </Typography>
      <Divider />
      {allNotification && allNotification?.length > 0 ? (
        <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
          {allNotification?.map((notification: any, index: number) => (
            <NotificationItem
              key={notification._id || index}
              notification={notification}
              onClick={handleNotificationsMenuClose}
            />
          ))}
        </Box>
      ) : (
        <MenuItem onClick={handleNotificationsMenuClose}>
          <Typography variant="body2" color="text.secondary">
            No new notifications
          </Typography>
        </MenuItem>
      )}
      <Divider />
      <MenuItem
        onClick={handleNotificationsMenuClose}
        component={Link}
        href="/notifications"
        sx={{ justifyContent: "center", py: 1.5 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1976d2" }}>
          See all notifications
        </Typography>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        elevation: 3,
        sx: { mt: 1.5, borderRadius: 2, minWidth: 200 },
      }}
    >
      {token && (
        <MenuItem onClick={(e) => { handleMobileMenuClose(); handleNotificationsMenuOpen(e); }}>
          <IconButton size="large" aria-label={`show ${badgeCount} new notifications`} color="inherit">
            <Badge badgeContent={badgeCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p style={{ margin: 0, fontWeight: 500 }}>Notifications</p>
        </MenuItem>
      )}
      {token && (
        <MenuItem sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <CreatePostModal />
          <p style={{ margin: 0, fontWeight: 500 }}>Create Post</p>
        </MenuItem>
      )}
      {token && (
        <MenuItem onClick={handleMenuClose} component={Link} href="/profile" sx={{ color: "#333", textDecoration: "none" }}>
          <IconButton size="large" color="inherit">
            <AccountCircle />
          </IconButton>
          <p style={{ margin: 0, fontWeight: 500 }}>Profile</p>
        </MenuItem>
      )}
      {token ? (
        <MenuItem onClick={handleLogOut} sx={{ color: "#d32f2f", textDecoration: "none" }}>
          <IconButton size="large" color="inherit">
            <LogoutIcon />
          </IconButton>
          <p style={{ margin: 0, fontWeight: 500 }}>LogOut</p>
        </MenuItem>
      ) : (
        <MenuItem onClick={handleMenuClose} component={Link} href="/login" sx={{ color: "#1976d2", textDecoration: "none", justifyContent: "center" }}>
          <p style={{ margin: "8px", fontWeight: 600 }}>Login</p>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, mb: 3 }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          color: "#333",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              display: "block",
              fontWeight: 800,
              letterSpacing: 0.5,
              mr: 4
            }}
          >
            <Link href={"/"} style={{ color: "#1976d2", textDecoration: "none" }}>
              SocialConnect
            </Link>
          </Typography>

          {token && (
            <Typography
              variant="subtitle1"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, fontWeight: 600 }}
            >
              <Link href={"/"} style={{ color: "#555", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "#1976d2")} onMouseOut={(e) => (e.currentTarget.style.color = "#555")}>
                Home
              </Link>
            </Typography>
          )}

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
            {token && (
              <>
                <IconButton
                  size="large"
                  aria-label={`show ${badgeCount} new notifications`}
                  color="inherit"
                  onClick={handleNotificationsMenuOpen}
                  aria-controls={notificationsMenuId}
                  aria-haspopup="true"
                  sx={{ color: "#555", transition: "all 0.2s", "&:hover": { color: "#1976d2", transform: "scale(1.1)" } }}
                >
                  <Badge badgeContent={badgeCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <CreatePostModal />
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ color: "#555", transition: "all 0.2s", "&:hover": { color: "#1976d2", transform: "scale(1.1)" } }}
                >
                  <AccountCircle fontSize="large" />
                </IconButton>
              </>
            )}

            {!token && (
              <Button
                component={Link}
                href="/login"
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 8,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3.5,
                  py: 1,
                  fontSize: "1rem"
                }}
              >
                Login
              </Button>
            )}
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotificationsMenu}
    </Box>
  );
}
