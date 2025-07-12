import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

export default function Navigation() {
  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'AI Analysis', href: '#' },
    { name: 'Materials', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'FAQ', href: '#' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="ml-2 text-lg font-semibold">FurniCraft</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Protection</span>
              <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-xs">β</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}