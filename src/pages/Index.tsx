import { ArrowRight, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import FloatingElements from '@/components/FloatingElements'
import CompanyLogos from '@/components/CompanyLogos'
import ImageUploadArea from '@/components/ImageUploadArea'
import AnalysisResults from '@/components/AnalysisResults'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useFurnitureAnalysis } from '@/hooks/useFurnitureAnalysis'

const Index = () => {
  const [currentDesign, setCurrentDesign] = useState<any>(null)
  const [analysisData, setAnalysisData] = useState<{ analysis: any; materials: any[] } | null>(null)
  const { user, loading: authLoading } = useAuth()
  const { getAnalysisResults } = useFurnitureAnalysis()
  const navigate = useNavigate()

  const handleOpenApp = () => {
    if (!user) {
      navigate('/auth')
      return
    }
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleUploadSuccess = async (design: any) => {
    setCurrentDesign(design)
    // Poll for analysis results
    const pollForResults = async () => {
      try {
        const results = await getAnalysisResults(design.id)
        setAnalysisData(results)
      } catch (error) {
        // Analysis might not be ready yet, poll again
        setTimeout(pollForResults, 2000)
      }
    }
    
    // Start polling after a short delay
    setTimeout(pollForResults, 3000)
  }

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
            <span className="text-muted-foreground">We build it for less</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Dive into the art of furniture making, where innovative AI technology meets South African craftsmanship
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              className="px-8 py-3 text-base bg-gradient-primary hover:opacity-90 shadow-glow"
              onClick={handleOpenApp}
            >
              {user ? 'Start Analysis' : 'Get Started'}
              <ArrowRight className="w-4 h-4 ml-2" />
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

      {/* Upload Section */}
      <div id="upload-section" className="py-32 bg-background relative overflow-hidden">
        {/* Multiple Background layers for enhanced depth */}
        <div className="absolute inset-0 bg-gradient-hero opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-primary opacity-5 blur-3xl"></div>
        
        {/* Animated floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-primary/8 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in">
              Transform Your{' '}
              <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent animate-pulse">
                Dream Design
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Upload your furniture inspiration and watch our AI transform it into an{' '}
              <span className="text-primary font-semibold">affordable reality</span> with detailed build plans
            </p>
          </div>

          {/* Enhanced Upload Area */}
          <div className="relative">
            {/* Background glow effects */}
            <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-2xl rounded-3xl animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-primary opacity-10 blur-xl rounded-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative">
              {!user ? (
                <div className="text-center py-20 border-2 border-dashed border-primary/30 rounded-2xl bg-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
                    <ArrowRight className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Sign In Required</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    Please sign in to start analyzing your furniture designs
                  </p>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-primary hover:opacity-90 shadow-glow"
                  >
                    Sign In to Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : !currentDesign ? (
                <div className="transform hover:scale-[1.02] transition-all duration-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <ImageUploadArea onUploadSuccess={handleUploadSuccess} />
                </div>
              ) : null}
              
              {currentDesign && !analysisData && (
                <div className="text-center py-20 border-2 border-dashed border-primary/50 rounded-2xl bg-card/70 backdrop-blur-sm relative overflow-hidden animate-scale-in">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-primary opacity-5 animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
                  
                  <div className="relative z-10">
                    <div className="w-28 h-28 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-8 shadow-glow animate-spin-slow">
                      <ArrowRight className="w-14 h-14 text-primary-foreground animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                      AI Analysis in Progress ✨
                    </h3>
                    <p className="text-muted-foreground text-xl max-w-lg mx-auto">
                      Our advanced AI is analyzing your design, breaking down materials, calculating costs, and creating your custom build plan...
                    </p>
                    
                    {/* Progress indicator */}
                    <div className="mt-8 max-w-xs mx-auto">
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-primary animate-pulse w-2/3 rounded-full"></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Usually takes 30-60 seconds</p>
                    </div>
                  </div>
                </div>
              )}
              
              {analysisData && (
                <div className="space-y-8 animate-scale-in">
                  <div className="text-center py-12 border-2 border-green-500/40 rounded-2xl bg-green-500/10 backdrop-blur-sm relative overflow-hidden">
                    {/* Success animation background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-green-400/10 to-green-500/5 animate-pulse"></div>
                    
                    <div className="relative z-10">
                      <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-6 shadow-glow animate-bounce">
                        <ArrowRight className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-green-400 mb-3">
                        Analysis Complete! 🎉
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Your detailed build plan is ready with materials and cost estimates
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full py-6 text-lg hover:scale-105 transition-all duration-300 bg-background/80 backdrop-blur-sm border-primary/30 hover:border-primary/60 shadow-glow"
                    onClick={() => {
                      setCurrentDesign(null)
                      setAnalysisData(null)
                    }}
                  >
                    Analyze Another Design ✨
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results Section */}
      {analysisData && (
        <div className="py-24 bg-card/30">
          <div className="max-w-6xl mx-auto px-4">
            <AnalysisResults 
              analysis={analysisData.analysis} 
              materials={analysisData.materials}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
