"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import {
  Box,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditIcon from "@mui/icons-material/Edit"

interface Book {
  id: string
  title: string
  author: string
  publishedYear: number
  genre: string
}

export default function BookDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoadingBook, setIsLoadingBook] = useState(true)
  const [error, setError] = useState("")

  const bookId = params.id as string

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (bookId) {
      fetchBook()
    }
  }, [bookId])

  const fetchBook = async () => {
    setIsLoadingBook(true)
    setError("")

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetBook($id: String!) {
              getBook(id: $id) {
                id
                title
                author
                publishedYear
                genre
              }
            }
          `,
          variables: { id: bookId },
        }),
      })

      const data = await response.json()
      if (data.errors) throw new Error(data.errors[0].message)
      setBook(data.data.getBook)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch book")
    } finally {
      setIsLoadingBook(false)
    }
  }

  if (isLoading || isLoadingBook) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  if (error || !book) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || "Book not found"}
          </Alert>
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => router.push("/books")}>
            Back to Books
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/books")} sx={{ mb: 3 }}>
          Back to Books
        </Button>

        <Card>
          <CardContent sx={{ pb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
              {book.title}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
              by <strong>{book.author}</strong>
            </Typography>

            <Box sx={{ backgroundColor: "#f5f5f5", p: 3, borderRadius: 2, mb: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Published Year
                  </Typography>
                  <Typography variant="body1">{book.publishedYear}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Genre
                  </Typography>
                  <Typography variant="body1">{book.genre}</Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
          <CardActions sx={{ pt: 0 }}>
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => router.push(`/books/${book.id}/edit`)}>
              Edit Book
            </Button>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.push("/books")}>
              Back to List
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Box>
  )
}
