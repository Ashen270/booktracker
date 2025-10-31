"use client"
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import LogoutIcon from "@mui/icons-material/Logout"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => router.push("/")}>
          📚 Book Management
        </Typography>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Welcome, <strong>{user.username}</strong>
            </Typography>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
