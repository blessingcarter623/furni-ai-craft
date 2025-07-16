
// This file is kept for backward compatibility but is no longer the primary analysis method
// The app now uses Flowise AI agents for furniture analysis

export interface FurnitureAnalysisResult {
  description: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_hours: number;
  style_category: string;
  materials: Array<{
    name: string;
    category: string;
    quantity: number;
    unit: string;
    estimated_cost: number;
    priority: 'required' | 'optional' | 'alternative';
    notes?: string;
  }>;
}

interface FurniturePattern {
  keywords: string[];
  baseDescription: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRange: number[];
  costRange: number[];
  materials: Array<{
    name: string;
    category: string;
    quantity: number;
    unit: string;
    cost: number;
    priority: 'required' | 'optional' | 'alternative';
    notes: string;
  }>;
}

// Furniture pattern database for fallback analysis
const furniturePatterns: Record<string, FurniturePattern> = {
  table: {
    keywords: ['table', 'desk', 'dining', 'coffee', 'side'],
    baseDescription: 'A functional table with clean lines and modern appeal',
    difficulty: 'intermediate',
    timeRange: [8, 16],
    costRange: [800, 2500],
    materials: [
      { name: 'Pine Wood Planks', category: 'Wood', quantity: 3, unit: 'pieces', cost: 250, priority: 'required', notes: 'Main tabletop material' },
      { name: 'Steel Hairpin Legs', category: 'Hardware', quantity: 4, unit: 'pieces', cost: 180, priority: 'required', notes: 'Modern leg design' },
      { name: 'Wood Screws', category: 'Hardware', quantity: 16, unit: 'pieces', cost: 25, priority: 'required', notes: 'Assembly hardware' },
      { name: 'Wood Stain', category: 'Finishing', quantity: 1, unit: 'bottle', cost: 120, priority: 'optional', notes: 'Protective finish' }
    ]
  },
  chair: {
    keywords: ['chair', 'seat', 'stool', 'armchair'],
    baseDescription: 'Comfortable seating with ergonomic design and quality construction',
    difficulty: 'intermediate',
    timeRange: [6, 12],
    costRange: [600, 1800],
    materials: [
      { name: 'Birch Plywood', category: 'Wood', quantity: 2, unit: 'sheets', cost: 180, priority: 'required', notes: 'Seat and backrest' },
      { name: 'Foam Padding', category: 'Upholstery', quantity: 1, unit: 'piece', cost: 150, priority: 'required', notes: 'Comfort layer' },
      { name: 'Fabric Cover', category: 'Upholstery', quantity: 1, unit: 'meter', cost: 220, priority: 'required', notes: 'Outer covering' },
      { name: 'Chair Legs', category: 'Hardware', quantity: 4, unit: 'pieces', cost: 160, priority: 'required', notes: 'Support structure' }
    ]
  },
  bookshelf: {
    keywords: ['bookshelf', 'shelf', 'bookcase', 'storage'],
    baseDescription: 'Versatile storage solution with multiple compartments for books and display items',
    difficulty: 'intermediate',
    timeRange: [10, 20],
    costRange: [900, 2800],
    materials: [
      { name: 'MDF Boards', category: 'Wood', quantity: 6, unit: 'pieces', cost: 320, priority: 'required', notes: 'Shelving material' },
      { name: 'Back Panel', category: 'Wood', quantity: 1, unit: 'piece', cost: 140, priority: 'required', notes: 'Rear support' },
      { name: 'Shelf Brackets', category: 'Hardware', quantity: 12, unit: 'pieces', cost: 85, priority: 'required', notes: 'Shelf support' },
      { name: 'Edge Banding', category: 'Finishing', quantity: 10, unit: 'meters', cost: 45, priority: 'optional', notes: 'Clean edges' }
    ]
  }
};

export const analyzeFurnitureImage = async (
  imageUrl: string,
  title: string,
  description?: string
): Promise<FurnitureAnalysisResult> => {
  console.log('Using fallback furniture analysis for:', title);
  
  // Simple pattern matching based on title and description
  const searchText = `${title} ${description || ''}`.toLowerCase();
  
  let selectedPattern: FurniturePattern | null = null;
  let matchedType = 'unknown';
  
  // Find best matching pattern
  for (const [type, pattern] of Object.entries(furniturePatterns)) {
    if (pattern.keywords.some(keyword => searchText.includes(keyword))) {
      selectedPattern = pattern;
      matchedType = type;
      break;
    }
  }
  
  // Fallback to table pattern if no match
  if (!selectedPattern) {
    selectedPattern = furniturePatterns.table;
    matchedType = 'table';
  }
  
  // Add some randomization for variety
  const timeVariation = Math.random() * 4 - 2; // ±2 hours
  const costVariation = Math.random() * 0.3 - 0.15; // ±15%
  
  const estimatedTime = Math.max(4, selectedPattern.timeRange[0] + timeVariation);
  const baseCostMin = selectedPattern.costRange[0] * (1 + costVariation);
  const baseCostMax = selectedPattern.costRange[1] * (1 + costVariation);
  
  return {
    description: `${selectedPattern.baseDescription} This ${matchedType} combines functionality with aesthetic appeal, perfect for modern living spaces.`,
    estimated_cost_min: Math.round(baseCostMin),
    estimated_cost_max: Math.round(baseCostMax),
    difficulty_level: selectedPattern.difficulty,
    estimated_time_hours: Math.round(estimatedTime),
    style_category: matchedType.charAt(0).toUpperCase() + matchedType.slice(1),
    materials: selectedPattern.materials.map(material => ({
      name: material.name,
      category: material.category,
      quantity: material.quantity,
      unit: material.unit,
      estimated_cost: material.cost,
      priority: material.priority,
      notes: material.notes
    }))
  };
};
