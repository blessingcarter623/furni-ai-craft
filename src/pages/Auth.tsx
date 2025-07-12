import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { user, signIn, signUp, loading } = useAuth()

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSignUp) {
      if (password !== confirmPassword) {
        return
      }
      await signUp(email, password)
    } else {
      await signIn(email, password)
    }
  }

  const isFormValid = email && password && (!isSignUp || password === confirmPassword)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-primary opacity-5 blur-3xl"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp 
              ? 'Join FurniCraft and start analyzing your furniture designs' 
              : 'Sign in to continue your furniture building journey'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="absolute -inset-2 bg-gradient-primary opacity-20 blur-xl rounded-2xl"></div>
          
          <GlassCard className="relative bg-background/80 backdrop-blur-xl border-border/30">
            <GlassCardHeader>
              <GlassCardTitle className="text-center">
                {isSignUp ? 'Create Your Account' : 'Sign In'}
              </GlassCardTitle>
            </GlassCardHeader>
            
            <GlassCardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary/50"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password (Sign Up only) */}
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                        required
                      />
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-sm text-destructive">Passwords do not match</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
                  disabled={loading || !isFormValid}
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isSignUp ? 'Create Account' : 'Sign In'}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                {/* Toggle Sign Up/Sign In */}
                <div className="text-center pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setPassword('')
                      setConfirmPassword('')
                    }}
                  >
                    {isSignUp ? 'Sign in instead' : 'Create account'}
                  </Button>
                </div>
              </form>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default Auth