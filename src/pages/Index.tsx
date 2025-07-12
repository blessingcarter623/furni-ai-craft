import { ArrowRight, ChevronDown } from 'lucide-react'
import Navigation from '@/components/Navigation'
import FloatingElements from '@/components/FloatingElements'
import CompanyLogos from '@/components/CompanyLogos'
import { Button } from '@/components/ui/button'

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-hero"></div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        ></div>

        {/* Floating elements */}
        <FloatingElements />

        {/* Main content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Upload the design.{' '}
            <span className="text-muted-foreground">We build it for less🔥</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Dive into the art of furniture making, where innovative AI technology meets South African craftsmanship
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button className="px-8 py-3 text-base">
              Open App
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="px-8 py-3 text-base">
              Discover More
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center text-muted-foreground">
              <span className="text-sm mb-2">Scroll down</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Bottom section indicator */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>02/03</span>
                <span>Scroll down</span>
              </div>
              <div>
                <span>FurniCraft horizons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company logos section */}
      <div className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <CompanyLogos />
        </div>
      </div>

      {/* Features section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Three simple steps to{' '}
              <span className="text-muted-foreground">organized builds</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload & Analyze</h3>
              <p className="text-muted-foreground">
                Upload your Pinterest inspiration and let AI break down materials, costs, and alternatives
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Compare Options</h3>
              <p className="text-muted-foreground">
                View cost-effective alternatives with trade-offs in durability, time, and visual impact
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Build Smarter</h3>
              <p className="text-muted-foreground">
                Get real-time pricing from local SA suppliers and optimize your material purchases
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
