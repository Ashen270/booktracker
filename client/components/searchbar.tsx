"use client"

import type React from "react"
import { Box, TextField, Button, Stack } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearch: () => void
  onAddBook: () => void
  isLoading?: boolean
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onAddBook,
  isLoading = false,
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          placeholder="Search by title, author, or genre..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          fullWidth
          size="small"
          variant="outlined"
        />
        <Button variant="contained" startIcon={<SearchIcon />} onClick={onSearch} disabled={isLoading} sx={{height: "3rem"}}>
          Search
        </Button>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={onAddBook}  sx={{height: "3rem",whiteSpace: "nowrap", display: "flex", alignItems: "center"}}>
          Add Book
        </Button>
      </Stack>
    </Box>
  )
}
