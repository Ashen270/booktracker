"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }

    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              token
              user {
                id
                username
              }
            }
          }
        `,
        variables: { username, password },
      }),
    })

    const data = await response.json()
    if (data.errors) throw new Error(data.errors[0].message)

    const { token: newToken, user: newUser } = data.data.login
    setToken(newToken)
    setUser(newUser)

    localStorage.setItem("authToken", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const register = async (username: string, password: string) => {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Register($username: String!, $password: String!) {
            register(username: $username, password: $password) {
              token
              user {
                id
                username
              }
            }
          }
        `,
        variables: { username, password },
      }),
    })

    const data = await response.json()
    if (data.errors) throw new Error(data.errors[0].message)

    const { token: newToken, user: newUser } = data.data.register
    setToken(newToken)
    setUser(newUser)

    localStorage.setItem("authToken", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
