import 'dotenv/config';
import express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import cors from "cors"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const app = express()
const PORT = process.env.PORT 
const JWT_SECRET = process.env.JWT_SECRET as string

app.use(cors())
app.use(express.json())

// In-memory storage
interface User {
  id: string
  username: string
  password: string
}

interface Book {
  id: string
  title: string
  author: string
  publishedYear: number
  genre: string
  userId: string
}

const users: User[] = []
const books: Book[] = []
let userIdCounter = 1
let bookIdCounter = 1

const schema = buildSchema(`
  type User {
    id: String!
    username: String!
  }

  type Book {
    id: String!
    title: String!
    author: String!
    publishedYear: Int!
    genre: String!
    userId: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type Query {
    getBooks(userId: String!): [Book!]!
    getBook(id: String!): Book
    searchBooks(userId: String!, query: String!): [Book!]!
    getUser(id: String!): User
  }

  type Mutation {
    register(username: String!, password: String!): AuthResponse!
    login(username: String!, password: String!): AuthResponse!
    createBook(userId: String!, title: String!, author: String!, publishedYear: Int!, genre: String!): Book!
    updateBook(id: String!, title: String!, author: String!, publishedYear: Int!, genre: String!): Book
    deleteBook(id: String!): Boolean!
  }
`)

const root = {
  register: async ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => {
    if (users.some((u) => u.username === username)) {
      throw new Error("Username already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser: User = {
      id: String(userIdCounter++),
      username,
      password: hashedPassword,
    }

    users.push(newUser)

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: "24h",
    })

    return {
      token,
      user: { id: newUser.id, username: newUser.username },
    }
  },

  login: async ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => {
    const user = users.find((u) => u.username === username)
    if (!user) {
      throw new Error("User not found")
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error("Invalid password")
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    })

    return {
      token,
      user: { id: user.id, username: user.username },
    }
  },

  createBook: ({
    userId,
    title,
    author,
    publishedYear,
    genre,
  }: {
    userId: string
    title: string
    author: string
    publishedYear: number
    genre: string
  }) => {
    const newBook: Book = {
      id: String(bookIdCounter++),
      title,
      author,
      publishedYear,
      genre,
      userId,
    }

    books.push(newBook)
    return newBook
  },

  getBooks: ({ userId }: { userId: string }) => {
    return books.filter((b) => b.userId === userId)
  },

  getBook: ({ id }: { id: string }) => {
    return books.find((b) => b.id === id)
  },

  searchBooks: ({
    userId,
    query,
  }: {
    userId: string
    query: string
  }) => {
    const lowerQuery = query.toLowerCase()
    return books.filter(
      (b) =>
        b.userId === userId &&
        (b.title.toLowerCase().includes(lowerQuery) ||
          b.author.toLowerCase().includes(lowerQuery) ||
          b.genre.toLowerCase().includes(lowerQuery)),
    )
  },

  updateBook: ({
    id,
    title,
    author,
    publishedYear,
    genre,
  }: {
    id: string
    title: string
    author: string
    publishedYear: number
    genre: string
  }) => {
    const book = books.find((b) => b.id === id)
    if (!book) {
      return null
    }

    book.title = title
    book.author = author
    book.publishedYear = publishedYear
    book.genre = genre

    return book
  },

  deleteBook: ({ id }: { id: string }) => {
    const index = books.findIndex((b) => b.id === id)
    if (index === -1) {
      return false
    }

    books.splice(index, 1)
    return true
  },

  getUser: ({ id }: { id: string }) => {
    const user = users.find((u) => u.id === id)
    if (!user) {
      return null
    }

    return { id: user.id, username: user.username }
  },
}

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
)

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`)
})
