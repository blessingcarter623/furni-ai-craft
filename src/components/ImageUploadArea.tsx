import { useState, useCallback } from 'react'
import { Upload, Image, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

interface ImageUploadAreaProps {
  onImageUpload: (file: File) => void
  isAnalyzing?: boolean
}

export default function ImageUploadArea({ onImageUpload, isAnalyzing = false }: ImageUploadAreaProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFileUpload(file)
    }
  }, [])

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setUploadedImage(url)
      onImageUpload(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  return (
    <GlassCard className="relative overflow-hidden">
      <div
        className={`
          relative min-h-[300px] flex flex-col items-center justify-center p-8 
          border-2 border-dashed transition-all duration-300 rounded-lg
          ${dragActive ? 'border-primary bg-primary/5' : 'border-border/50'}
          ${uploadedImage ? 'min-h-[400px]' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploadedImage ? (
          <div className="relative w-full h-full flex flex-col items-center">
            <img 
              src={uploadedImage} 
              alt="Uploaded furniture" 
              className="max-h-[300px] w-auto object-contain rounded-lg shadow-glow"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-3 text-primary">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <span className="text-lg font-medium">Analyzing furniture...</span>
                </div>
              </div>
            )}
            <Button 
              variant="outline" 
              className="mt-4 bg-background/50 backdrop-blur-sm"
              onClick={() => {
                setUploadedImage(null)
                const input = document.getElementById('file-input') as HTMLInputElement
                if (input) input.value = ''
              }}
            >
              Upload Different Image
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Upload Furniture Image</h3>
              <p className="text-muted-foreground mb-4">
                Drop a Pinterest-inspired furniture image here or click to browse
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                className="bg-gradient-primary hover:opacity-90"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Image className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
            </div>
          </div>
        )}
        
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </GlassCard>
  )
}