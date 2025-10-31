"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import BookList from "@/components/book-list"
import SearchBar from "@/components/searchbar"
import Navbar from "@/components/navbar"
import { Container, Box, Alert, CircularProgress, Typography } from "@mui/material"

export default function BooksPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [books, setBooks] = useState<any[]>([])
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchBooks()
    }
  }, [user])

  const fetchBooks = async () => {
    setIsLoadingBooks(true)
    setError("")

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetBooks($userId: String!) {
              getBooks(userId: $userId) {
                id
                title
                author
                publishedYear
                genre
              }
            }
          `,
          variables: { userId: user?.id },
        }),
      })

      const data = await response.json()
      if (data.errors) throw new Error(data.errors[0].message)
      setBooks(data.data.getBooks)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch books")
    } finally {
      setIsLoadingBooks(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBooks()
      return
    }

    setIsLoadingBooks(true)
    setError("")

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query SearchBooks($userId: String!, $query: String!) {
              searchBooks(userId: $userId, query: $query) {
                id
                title
                author
                publishedYear
                genre
              }
            }
          `,
          variables: { userId: user?.id, query: searchQuery },
        }),
      })

      const data = await response.json()
      if (data.errors) throw new Error(data.errors[0].message)
      setBooks(data.data.searchBooks)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setIsLoadingBooks(false)
    }
  }

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
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onAddBook={() => router.push("/books/add")}
          isLoading={isLoadingBooks}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoadingBooks ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : books.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="textSecondary">
              {searchQuery ? "No books found matching your search." : "No books yet. Add your first book!"}
            </Typography>
          </Box>
        ) : (
          <BookList books={books} onBooksChange={fetchBooks} />
        )}
      </Container>
    </Box>
  )
}
