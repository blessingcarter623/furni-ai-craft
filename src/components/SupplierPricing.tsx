import { MapPin, Star, Clock } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SupplierPrice {
  supplier: string
  price: number
  distance: string
  rating: number
  inStock: boolean
  logo: string
}

interface SupplierPricingProps {
  material: string
  prices: SupplierPrice[]
}

export default function SupplierPricing({ material, prices }: SupplierPricingProps) {
  const lowestPrice = Math.min(...prices.map(p => p.price))

  return (
    <GlassCard>
      <GlassCardHeader>
        <GlassCardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          {material} - Local Suppliers
        </GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent className="space-y-4">
        {prices.map((supplier, index) => (
          <div 
            key={index}
            className={`
              flex items-center justify-between p-4 rounded-lg border transition-all duration-200
              ${supplier.price === lowestPrice 
                ? 'border-primary/50 bg-primary/5 shadow-glow' 
                : 'border-border/30 bg-secondary/20'
              }
              hover:border-primary/30 hover:bg-primary/5
            `}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center text-xl font-bold">
                {supplier.supplier.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{supplier.supplier}</h3>
                  {supplier.price === lowestPrice && (
                    <Badge className="bg-gradient-primary text-primary-foreground">Best Price</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{supplier.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{supplier.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <Badge variant={supplier.inStock ? "default" : "destructive"} className="text-xs">
                      {supplier.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">R{supplier.price}</div>
              <Button 
                size="sm" 
                className="mt-2"
                variant={supplier.price === lowestPrice ? "default" : "outline"}
                disabled={!supplier.inStock}
              >
                {supplier.inStock ? "View Details" : "Notify When Available"}
              </Button>
            </div>
          </div>
        ))}
      </GlassCardContent>
    </GlassCard>
  )
}