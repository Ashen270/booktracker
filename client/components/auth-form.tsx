"use client"

import type React from "react"
import { useState } from "react"
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    Stack,
    CircularProgress,
    Link as MUILink,
} from "@mui/material"
import Image from "next/image"

interface AuthFormProps {
    
    title: string
    subtitle: string
    onSubmit: (data: any) => Promise<void>
    isLogin?: boolean
    footerText?: string
    footerLinkText?: string
    footerLinkHref?: string
}

export default function AuthForm({
    title,
    subtitle,
    onSubmit,
    isLogin = false,
    footerText,
    footerLinkText,
    footerLinkHref,
}: AuthFormProps) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setIsLoading(true)

        try {
            await onSubmit({ username, password })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#fafafa",
                py: 2,
            }}
        >
            <Card sx={{ maxWidth: 400, width: "100%", mx: 2 }}>
                <CardContent sx={{ pt: 4 }}>
                     <Image
                        src="/BookTrackerLogo.png"
                        alt="BookTracker Logo"
                        width={256}
                        height={256}
                        style={{ display: 'block', margin: '0 auto 16px', backgroundColor: '#fafafa' }}
                    />
                    <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", mb: 3 }}>
                        {subtitle}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2}>
                            <TextField
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                disabled={isLoading}
                                fullWidth
                                required
                                autoFocus
                            />

                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                disabled={isLoading}
                                fullWidth
                                required
                            />

                            {!isLogin && (
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    disabled={isLoading}
                                    fullWidth
                                    required
                                />
                            )}

                            <Button type="submit" variant="contained" fullWidth disabled={isLoading} sx={{ mt: 2 }}>
                                {isLoading ? (
                                    <>
                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                        {isLogin ? "Logging in..." : "Registering..."}
                                    </>
                                ) : isLogin ? (
                                    "Login"
                                ) : (
                                    "Register"
                                )}
                            </Button>
                        </Stack>
                    </Box>

                    {footerText && footerLinkHref && (
                        <Typography variant="body2" sx={{ textAlign: "center", mt: 3 }}>
                            {footerText}{" "}
                            <MUILink href={footerLinkHref} sx={{ cursor: "pointer" }}>
                                {footerLinkText}
                            </MUILink>
                        </Typography>
                    )}

                </CardContent>
            </Card>
        </Box>
    )
}
