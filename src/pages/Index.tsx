import { useState } from 'react'
import { Sparkles, Target, TrendingUp, Users } from 'lucide-react'
import ImageUploadArea from '@/components/ImageUploadArea'
import AnalysisResults from '@/components/AnalysisResults'
import SupplierPricing from '@/components/SupplierPricing'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'

// Mock data for demonstration
const mockAnalysis = {
  style: "Scandinavian",
  totalSavings: 850,
  suggestions: [
    {
      part: "Table Top",
      originalMaterial: "Solid Oak Wood",
      suggestedMaterial: "Pine with Oak Veneer",
      costSaving: 320,
      durabilityChange: -15,
      timeChange: 2,
      visualImpact: 'low' as const
    },
    {
      part: "Table Legs", 
      originalMaterial: "Solid Oak",
      suggestedMaterial: "Pine with Stain",
      costSaving: 280,
      durabilityChange: -20,
      timeChange: 1,
      visualImpact: 'medium' as const
    },
    {
      part: "Hardware",
      originalMaterial: "Brass Fittings",
      suggestedMaterial: "Steel with Brass Finish",
      costSaving: 250,
      durabilityChange: -5,
      timeChange: 0,
      visualImpact: 'low' as const
    }
  ]
}

const mockSupplierData = [
  {
    supplier: "Builders Warehouse",
    price: 125,
    distance: "2.3km",
    rating: 4.2,
    inStock: true,
    logo: "BW"
  },
  {
    supplier: "Leroy Merlin",
    price: 118,
    distance: "5.1km", 
    rating: 4.5,
    inStock: true,
    logo: "LM"
  },
  {
    supplier: "Gelmar",
    price: 140,
    distance: "8.2km",
    rating: 4.0,
    inStock: false,
    logo: "GM"
  }
]

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleImageUpload = (file: File) => {
    setUploadedFile(file)
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                FurniCraft AI
              </h1>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Your furniture dreams,{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                simplified
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transform Pinterest inspiration into affordable South African builds. 
              Get AI-powered material analysis, cost optimization, and local supplier pricing.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Badge className="bg-secondary/70 text-secondary-foreground backdrop-blur-sm">
                <Target className="w-4 h-4 mr-1" />
                50,000+ furniture makers
              </Badge>
              <Badge className="bg-secondary/70 text-secondary-foreground backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                Average 40% cost savings
              </Badge>
              <Badge className="bg-secondary/70 text-secondary-foreground backdrop-blur-sm">
                <Users className="w-4 h-4 mr-1" />
                Trusted by SA makers
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Area */}
            <div className="lg:col-span-2">
              <ImageUploadArea 
                onImageUpload={handleImageUpload}
                isAnalyzing={isAnalyzing}
              />
              
              {showResults && (
                <div className="mt-8">
                  <AnalysisResults analysis={mockAnalysis} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* How it works */}
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="text-lg">How it works</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Upload Image</h4>
                      <p className="text-sm text-muted-foreground">
                        Drop your Pinterest furniture inspiration
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">AI Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Get material breakdown and alternatives
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Build Smarter</h4>
                      <p className="text-sm text-muted-foreground">
                        Save money with local supplier pricing
                      </p>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>

              {/* Supplier Pricing */}
              {showResults && (
                <SupplierPricing 
                  material="18mm Pine Board"
                  prices={mockSupplierData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
