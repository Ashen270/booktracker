"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import BookForm from "@/components/book-form"
import Navbar from "@/components/navbar"
import { Box, Container, CircularProgress, Alert } from "@mui/material"

interface Book {
  id: string
  title: string
  author: string
  publishedYear: number
  genre: string
}

export default function EditBookPage() {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
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
        <Container maxWidth="sm" sx={{ py: 4, flexGrow: 1 }}>
          <Alert severity="error">{error || "Book not found"}</Alert>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 4, flexGrow: 1 }}>
        <BookForm book={book} userId={user?.id || ""} onSuccess={() => router.push(`/books/${book.id}`)} />
      </Container>
    </Box>
  )
}
