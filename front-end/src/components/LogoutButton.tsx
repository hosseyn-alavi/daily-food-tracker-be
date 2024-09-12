import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

export const LogoutButton = () => {
  return (
    <div>
      <IconButton aria-label="logout" color="primary" onClick={handleLogout}>
        <LogoutIcon />
      </IconButton>
    </div>
  );
};
