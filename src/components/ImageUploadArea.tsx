import { useState, useCallback } from 'react'
import { Upload, Image, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useFurnitureAnalysis } from '@/hooks/useFurnitureAnalysis'

interface ImageUploadAreaProps {
  onUploadSuccess?: (design: any) => void
}

export default function ImageUploadArea({ onUploadSuccess }: ImageUploadAreaProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const { uploadDesign, analyzeDesign, isUploading, isAnalyzing } = useFurnitureAnalysis()

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
      handleFileSelect(file)
    }
  }, [])

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setUploadedImage(url)
      setSelectedFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile || !title.trim()) return
    
    try {
      const design = await uploadDesign(selectedFile, title, description)
      await analyzeDesign(design.id, design.image_url)
      onUploadSuccess?.(design)
      
      // Reset form after successful upload
      setUploadedImage(null)
      setSelectedFile(null)
      setTitle('')
      setDescription('')
      const input = document.getElementById('file-input') as HTMLInputElement
      if (input) input.value = ''
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }

  const resetForm = () => {
    setUploadedImage(null)
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    const input = document.getElementById('file-input') as HTMLInputElement
    if (input) input.value = ''
  }

  return (
    <GlassCard className="relative overflow-hidden shadow-elegant">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-30"></div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-xl"></div>
      
      <div
        className={`
          relative min-h-[300px] flex flex-col items-center justify-center p-8 
          border-2 border-dashed transition-all duration-500 rounded-lg
          ${dragActive ? 'border-primary bg-primary/10 shadow-glow scale-105' : 'border-border/30'}
          ${uploadedImage ? 'min-h-[500px]' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploadedImage ? (
          <div className="relative w-full space-y-6 max-w-lg">
            <div className="text-center">
              <img 
                src={uploadedImage} 
                alt="Uploaded furniture" 
                className="max-h-[200px] w-auto object-contain rounded-lg shadow-glow mx-auto"
              />
              {(isUploading || isAnalyzing) && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="flex items-center gap-3 text-primary">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    <span className="text-lg font-medium">
                      {isUploading ? 'Uploading...' : 'Analyzing furniture...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4 relative z-10">
              <div>
                <Input
                  placeholder="Give your design a name..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background/80 backdrop-blur-sm border-border/50"
                  disabled={isUploading || isAnalyzing}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Add any notes or details about your design (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background/80 backdrop-blur-sm border-border/50 resize-none"
                  rows={3}
                  disabled={isUploading || isAnalyzing}
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleAnalyze}
                  disabled={!title.trim() || isUploading || isAnalyzing}
                  className="flex-1 bg-gradient-primary hover:opacity-90 shadow-glow"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Design ✨
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-background/50 backdrop-blur-sm"
                  onClick={resetForm}
                  disabled={isUploading || isAnalyzing}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 relative z-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse">
              <Upload className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Drop Your Dream Design! 🎨
              </h3>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Share your Pinterest inspiration and watch our AI transform it into an <span className="text-primary font-semibold">affordable reality</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                className="bg-gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-300 px-8 py-3 text-lg shadow-glow"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Image className="w-5 h-5 mr-2" />
                Choose Image ✨
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