"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import AuthForm from "@/components/auth-form"

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (data: { username: string; password: string }) => {
    await register(data.username, data.password)
    router.push("/books")
  }

  return (
    <AuthForm
      title="Sign Up"
      subtitle="Create a new account to get started"
      onSubmit={handleSubmit}
      isLogin={false}
      footerText="Already have an account?"
      footerLinkText="Login here"
      footerLinkHref="/login"
    />
  )
}
