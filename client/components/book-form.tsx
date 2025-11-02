"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Button, 
  Card,
  FormControl,
  Select,
  MenuItem,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Stack
} from "@mui/material"
import { useRouter } from "next/navigation"
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from "@mui/icons-material/Cancel"

interface Book {
  id: string
  title: string
  author: string
  publishedYear: number
  genre: string
}

interface BookFormProps {
  book?: Book
  userId: string
  onSuccess?: () => void
}

export default function BookForm({ book, userId, onSuccess }: BookFormProps) {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [publishedYear, setPublishedYear] = useState("")
  const [genre, setGenre] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (book) {
      setTitle(book.title)
      setAuthor(book.author)
      setPublishedYear(book.publishedYear.toString())
      setGenre(book.genre)
    }
  }, [book])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim() || !author.trim() || !publishedYear.trim() || !genre.trim()) {
      setError("All fields are required")
      return
    }

    const year = Number.parseInt(publishedYear)
    if (isNaN(year) || year < 0 || year > new Date().getFullYear()) {
      setError("Please enter a valid year")
      return
    }

    setIsLoading(true)

    try {
      const query = book
        ? `
            mutation UpdateBook($id: String!, $title: String!, $author: String!, $publishedYear: Int!, $genre: String!) {
              updateBook(id: $id, title: $title, author: $author, publishedYear: $publishedYear, genre: $genre) {
                id
                title
                author
                publishedYear
                genre
              }
            }
          `
        : `
            mutation CreateBook($userId: String!, $title: String!, $author: String!, $publishedYear: Int!, $genre: String!) {
              createBook(userId: $userId, title: $title, author: $author, publishedYear: $publishedYear, genre: $genre) {
                id
                title
                author
                publishedYear
                genre
              }
            }
          `

      const variables = book
        ? { id: book.id, title, author, publishedYear: year, genre }
        : { userId, title, author, publishedYear: year, genre }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      })

      const data = await response.json()
      if (data.errors) throw new Error(data.errors[0].message)

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/books")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontFamily: 'Roboto Mono, monospace' , fontWeight: 'bold', textAlign: 'center' }}>
          {book ? "Edit Book" : "Add New Book"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
              disabled={isLoading}
              fullWidth
              required
            />

            <TextField
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              disabled={isLoading}
              fullWidth
              required
            />

            <TextField
              label="Published Year"
              type="number"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
              placeholder="Published year"
              disabled={isLoading}
              fullWidth
              required
            />


            <FormControl fullWidth required disabled={isLoading}>
              <Select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Genre</em>
                </MenuItem>
                <MenuItem value="Science Fiction">Science Fiction</MenuItem>
                <MenuItem value="Fantasy">Fantasy</MenuItem>
                <MenuItem value="Mystery">Mystery</MenuItem>
                <MenuItem value="Romance">Romance</MenuItem>
                <MenuItem value="Horror">Horror</MenuItem>
                <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                <MenuItem value="Historical">Historical</MenuItem>
              </Select>
            </FormControl>



            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" startIcon={<AddIcon />} disabled={isLoading} fullWidth>
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Adding...
                  </>
                ) : book ? (
                  "Update Book"
                ) : (
                  "Add Book"
                )}
              </Button>
              <Button
                type="button"
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => router.back()}
                disabled={isLoading}
                fullWidth
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
