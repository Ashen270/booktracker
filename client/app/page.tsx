"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import { Box, Button, Typography, Container, Stack, CircularProgress } from "@mui/material"
import Image from "next/image"


export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/books")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafafa",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center" }}>
          <Image
            src="/booktrackerlogo.png"
            alt="BookTracker Logo"
            width={256}
            height={256}
            style={{  display: "block", margin: "0 auto 16px"}}
          />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Book Management System
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 4 }}>
            Welcome to your personal book management system. Create an account or log in to get started.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" size="large" onClick={() => router.push("/login")}>
              Login
            </Button>
            <Button variant="outlined" size="large" onClick={() => router.push("/signup")}>
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
