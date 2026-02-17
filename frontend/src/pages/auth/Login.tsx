import { LoginForm } from "@/components/login-form"
import { AuthService } from "@/services/auth.service"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useState } from "react"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await AuthService.handleLogin({ email, password })
      
      // Show success message
      toast.success("Login successful!", {
        description: `Welcome back, ${response.user.name}!`,
      })
      
      // Redirect to dashboard or home
      navigate("/")
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials."
      setError(errorMessage)
      toast.error("Login failed", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm 
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}
