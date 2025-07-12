import { Hammer, DollarSign, Clock, Shield, TrendingDown } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface MaterialSuggestion {
  part: string
  originalMaterial: string
  suggestedMaterial: string
  costSaving: number
  durabilityChange: number
  timeChange: number
  visualImpact: 'low' | 'medium' | 'high'
}

interface AnalysisResultsProps {
  analysis: {
    style: string
    totalSavings: number
    suggestions: MaterialSuggestion[]
  }
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-green-500/20 text-green-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'high': return 'bg-red-500/20 text-red-400'
      default: return 'bg-muted'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <Hammer className="w-6 h-6 text-primary" />
            Build Analysis - {analysis.style} Style
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-primary/10">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-green-400">R{analysis.totalSavings}</div>
              <div className="text-sm text-muted-foreground">Total Savings</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">+2-4hrs</div>
              <div className="text-sm text-muted-foreground">Extra Build Time</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <Shield className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold">85%</div>
              <div className="text-sm text-muted-foreground">Durability Retained</div>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Material Suggestions */}
      <div className="grid gap-4">
        {analysis.suggestions.map((suggestion, index) => (
          <GlassCard key={index} className="overflow-hidden">
            <GlassCardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{suggestion.part}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{suggestion.originalMaterial}</span>
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-primary">{suggestion.suggestedMaterial}</span>
                  </div>
                </div>
                <Badge className={getImpactColor(suggestion.visualImpact)}>
                  {suggestion.visualImpact} visual impact
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Cost Saving</span>
                    <span className="text-sm font-medium text-green-400">-R{suggestion.costSaving}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Durability</span>
                    <span className="text-sm font-medium">{suggestion.durabilityChange > 0 ? '+' : ''}{suggestion.durabilityChange}%</span>
                  </div>
                  <Progress value={Math.abs(suggestion.durabilityChange) + 50} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Build Time</span>
                    <span className="text-sm font-medium">{suggestion.timeChange > 0 ? '+' : ''}{suggestion.timeChange}hrs</span>
                  </div>
                  <Progress value={Math.abs(suggestion.timeChange) * 20 + 30} className="h-2" />
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}