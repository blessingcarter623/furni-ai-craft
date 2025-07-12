import { Play } from 'lucide-react'

interface FloatingElement {
  id: string
  name: string
  value: string
  position: string
}

const floatingElements: FloatingElement[] = [
  { id: '1', name: 'Pine Wood', value: 'R 125', position: 'top-20 left-20' },
  { id: '2', name: 'MDF Board', value: 'R 89', position: 'top-32 right-24' },
  { id: '3', name: 'Oak Veneer', value: 'R 245', position: 'bottom-40 left-16' },
  { id: '4', name: 'Hardware', value: 'R 65', position: 'bottom-32 right-20' },
  { id: '5', name: 'Builders', value: '2.3km', position: 'top-1/2 left-8' },
  { id: '6', name: 'Leroy Merlin', value: '5.1km', position: 'top-1/2 right-8' },
]

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className={`absolute ${element.position} opacity-60 hover:opacity-100 transition-opacity duration-300`}
        >
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-subtle">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div>
                <div className="text-xs font-medium text-foreground">{element.name}</div>
                <div className="text-xs text-muted-foreground">{element.value}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Central play button */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-all duration-300 backdrop-blur-sm">
          <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
        </button>
      </div>
    </div>
  )
}