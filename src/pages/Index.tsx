import { ArrowRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Navigation from '@/components/Navigation'
import FloatingElements from '@/components/FloatingElements'
import CompanyLogos from '@/components/CompanyLogos'
import ImageUploadArea from '@/components/ImageUploadArea'
import AnalysisResults from '@/components/AnalysisResults'
import { Button } from '@/components/ui/button'
import { useFurnitureAnalysis } from '@/hooks/useFurnitureAnalysis'

const Index = () => {
  const [currentDesign, setCurrentDesign] = useState<any>(null)
  const [analysisData, setAnalysisData] = useState<{ analysis: any; materials: any[] } | null>(null)
  const { getAnalysisResults } = useFurnitureAnalysis()

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
            <span className="text-muted-foreground">We build it for less🔥</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Dive into the art of furniture making, where innovative AI technology meets South African craftsmanship
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              className="px-8 py-3 text-base bg-gradient-primary hover:opacity-90 shadow-glow"
              onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Open App
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

      {/* Upload Section */}
      <div id="upload-section" className="py-24 bg-background relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Start Your{' '}
              <span className="text-primary bg-gradient-primary bg-clip-text text-transparent">AI Analysis</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your furniture inspiration and get instant cost breakdowns, material lists, and build plans
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Upload Area */}
            <div className="space-y-6">
              {!currentDesign && (
                <ImageUploadArea onUploadSuccess={handleUploadSuccess} />
              )}
              
              {currentDesign && !analysisData && (
                <div className="text-center py-12 border-2 border-dashed border-primary/30 rounded-lg bg-card/50">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-6 animate-pulse">
                    <ArrowRight className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Analysis in Progress</h3>
                  <p className="text-muted-foreground text-lg">
                    Our AI is analyzing your design. This usually takes 30-60 seconds...
                  </p>
                </div>
              )}
              
              {analysisData && (
                <div className="space-y-6">
                  <div className="text-center py-6 border-2 border-green-500/30 rounded-lg bg-green-500/10">
                    <h3 className="text-2xl font-semibold text-green-400 mb-2">
                      Analysis Complete! 🎉
                    </h3>
                    <p className="text-muted-foreground">
                      Here's your detailed build plan with materials and costs
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setCurrentDesign(null)
                      setAnalysisData(null)
                    }}
                  >
                    Analyze Another Design
                  </Button>
                </div>
              )}
            </div>

            {/* Inspiration Gallery */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-center">Design Inspiration</h3>
              <p className="text-muted-foreground text-center">
                Get inspired by these furniture designs that our AI can analyze
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="group relative overflow-hidden rounded-lg bg-card border border-border/30 hover:border-primary/50 transition-all duration-300">
                  <img 
                    src="/lovable-uploads/4eb91d33-5355-433e-b92e-10a6479c04dc.png" 
                    alt="Modern minimalist sofa with wooden base"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Modern Platform Sofa</h4>
                    <p className="text-sm text-muted-foreground">Minimalist design with wooden platform base</p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-lg bg-card border border-border/30 hover:border-primary/50 transition-all duration-300">
                  <img 
                    src="/lovable-uploads/d245d191-64bf-4352-8e4f-b3051298eba6.png" 
                    alt="Contemporary sectional sofa"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Contemporary Sectional</h4>
                    <p className="text-sm text-muted-foreground">Modular design with clean lines</p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-lg bg-card border border-border/30 hover:border-primary/50 transition-all duration-300">
                  <img 
                    src="/lovable-uploads/c6c76e81-7a6b-4c4b-a99d-60f7ba736ae1.png" 
                    alt="Industrial lounge chair"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Industrial Lounge Chair</h4>
                    <p className="text-sm text-muted-foreground">Metal frame with upholstered cushioning</p>
                  </div>
                </div>
              </div>
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
