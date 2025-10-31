"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import AuthForm from "@/components/auth-form"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (data: { username: string; password: string }) => {
    await login(data.username, data.password)
    router.push("/books")
  }

  return (
    <AuthForm
      title="Login"
      subtitle="Enter your credentials to access your books"
      onSubmit={handleSubmit}
      isLogin={true}
      footerText="Don't have an account?"
      footerLinkText="Sign Up here"
      footerLinkHref="/signup"
    />
  )
}
