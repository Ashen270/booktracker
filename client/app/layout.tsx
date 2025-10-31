"use client" 

import React from "react"
import Head from "next/head"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider, CssBaseline } from "@mui/material"
import theme from "@/lib/theme"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
    <Head>
        <title>BookTracker</title>
        <meta name="description" content="Manage your book collection" />
        <link rel="icon" href="/BookTrackerLogo.png" />
      </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
