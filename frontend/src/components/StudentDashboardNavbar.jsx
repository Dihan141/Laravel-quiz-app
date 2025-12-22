import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

function StudentDashboardNavbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const handleLogout = () => {
    logout();
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Box flexGrow={1}>
          <Typography variant="h6">Student Dashboard</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle1">{user.user.name}</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default StudentDashboardNavbar;
