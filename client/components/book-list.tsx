"use client";

import { useState } from "react";
import { Box, Typography, Grid, Pagination } from "@mui/material";

import BookCard from "./book-card";

interface Book {
    id: string;
    title: string;
    author: string;
    publishedYear: number;
    genre: string;
}

interface BookListProps {
    books: Book[];
    onBooksChange: () => void;
}

export default function BookList({ books, onBooksChange }: BookListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12;

    const totalPages = Math.ceil(books.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const paginatedBooks = books.slice(startIndex, endIndex);


    const handleDelete = async (bookId: string) => {
        if (!confirm("Are you sure you want to delete this book?")) return;
        setDeletingId(bookId);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
            mutation DeleteBook($id: String!) {
              deleteBook(id: $id)
            }
          `,
                    variables: { id: bookId },
                }),
            });

            const data = await response.json();
            if (data.errors) throw new Error(data.errors[0].message);
            onBooksChange();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete book");
        } finally {
            setDeletingId(null);
        }
    };

    if (!books || books.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                    No books found
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "75vh" }}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    {paginatedBooks.map((book) => (
                        <Grid item xs={12} sm={6} md={4} key={book.id}>
                            <BookCard
                                id={book.id}
                                title={book.title}
                                author={book.author}
                                publishedYear={book.publishedYear}
                                genre={book.genre}
                                onDelete={handleDelete}
                                isDeleting={deletingId === book.id}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => {
                            setCurrentPage(value);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}
        </Box>
    );
}





