import { Hammer, DollarSign, Clock, TrendingUp, TrendingDown, Package, ShoppingCart } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnalysisResult, Material } from '@/hooks/useFurnitureAnalysis'

interface AnalysisResultsProps {
  analysis: AnalysisResult
  materials: Material[]
  onViewSuppliers?: (material: Material) => void
}

export default function AnalysisResults({ analysis, materials, onViewSuppliers }: AnalysisResultsProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-muted'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'required': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'optional': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'alternative': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-muted'
    }
  }

  const totalCost = materials.reduce((sum, material) => sum + (material.estimated_cost || 0), 0)
  const requiredMaterials = materials.filter(m => m.priority === 'required')
  const optionalMaterials = materials.filter(m => m.priority !== 'required')

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <Hammer className="w-6 h-6 text-primary" />
            Build Analysis - {analysis.style_category} Style
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="mb-6">
            <p className="text-muted-foreground leading-relaxed">{analysis.ai_description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-xl font-bold text-green-400">
                R{analysis.estimated_cost_min} - R{analysis.estimated_cost_max}
              </div>
              <div className="text-sm text-muted-foreground">Estimated Cost</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50 border border-border/30">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-xl font-bold">{analysis.estimated_time_hours}hrs</div>
              <div className="text-sm text-muted-foreground">Build Time</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50 border border-border/30">
              <Package className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-xl font-bold">{materials.length}</div>
              <div className="text-sm text-muted-foreground">Materials Needed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50 border border-border/30">
              <Badge className={getDifficultyColor(analysis.difficulty_level)}>
                {analysis.difficulty_level}
              </Badge>
              <div className="text-sm text-muted-foreground mt-2">Difficulty Level</div>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Required Materials */}
      {requiredMaterials.length > 0 && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Required Materials
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="grid gap-4">
              {requiredMaterials.map((material) => (
                <div key={material.id} className="flex justify-between items-center p-4 rounded-lg bg-card/50 border border-border/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{material.name}</h4>
                      <Badge variant="outline" className={getPriorityColor(material.priority)}>
                        {material.priority}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {material.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Qty: {material.quantity} {material.unit}</span>
                      <span className="font-medium text-foreground">R{material.estimated_cost}</span>
                    </div>
                    {material.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{material.notes}</p>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewSuppliers?.(material)}
                    className="ml-4"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Find Suppliers
                  </Button>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      )}

      {/* Optional Materials */}
      {optionalMaterials.length > 0 && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Optional & Alternative Materials
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="grid gap-4">
              {optionalMaterials.map((material) => (
                <div key={material.id} className="flex justify-between items-center p-4 rounded-lg bg-card/30 border border-border/20">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{material.name}</h4>
                      <Badge variant="outline" className={getPriorityColor(material.priority)}>
                        {material.priority}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {material.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Qty: {material.quantity} {material.unit}</span>
                      <span className="font-medium text-foreground">R{material.estimated_cost}</span>
                    </div>
                    {material.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{material.notes}</p>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewSuppliers?.(material)}
                    className="ml-4"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Find Suppliers
                  </Button>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      )}

      {/* Cost Summary */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Cost Breakdown
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Required Materials:</span>
              <span className="font-medium">
                R{requiredMaterials.reduce((sum, m) => sum + (m.estimated_cost || 0), 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Optional Materials:</span>
              <span className="font-medium">
                R{optionalMaterials.reduce((sum, m) => sum + (m.estimated_cost || 0), 0)}
              </span>
            </div>
            <div className="border-t border-border/30 pt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Estimated Cost:</span>
                <span className="text-primary">R{totalCost}</span>
              </div>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}