"use client";
import { Card, CardContent, CardActions, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
  genre: string;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function BookCard({ id, title, author, publishedYear, genre, onDelete, isDeleting }: BookCardProps) {
  const router = useRouter();


  const genreColors: Record<string, string> = {
    "Science Fiction": "#E3F2FD",
    Fantasy: "#F3E5F5",
    Mystery: "#FFF9C4",
    Romance: "#FCE4EC",
    Horror: "#FFEBEE",
    "Non-Fiction": "#E8F5E9",
    Historical: "#FBE9E7",
    default: "#F5F5F5",
  };

  const backgroundColor = genreColors[genre] || genreColors.default;

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          by <strong>{author}</strong>
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            <strong>Year:</strong> {publishedYear}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Genre:</strong> {genre}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0 }}>
        <Button
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => router.push(`/books/${id}`)}
        >
          View
        </Button>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => router.push(`/books/${id}/edit`)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(id)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </CardActions>
    </Card>
  );
}
