"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import BookForm from "@/components/book-form"
import Navbar from "@/components/navbar"
import { Box, Container, CircularProgress } from "@mui/material"

export default function AddBookPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 4, flexGrow: 1 }}>
        <BookForm userId={user?.id || ""} onSuccess={() => router.push("/books")} />
      </Container>
    </Box>
  )
}
