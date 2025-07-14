
// Frontend furniture analysis utility
export interface FurnitureAnalysisResult {
  description: string;
  style_category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_hours: number;
  estimated_cost_min: number;
  estimated_cost_max: number;
  materials: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    estimated_cost: number;
    priority: 'required' | 'optional' | 'alternative';
    notes: string;
  }[];
}

// Furniture pattern recognition based on common design elements
const FURNITURE_PATTERNS = {
  chair: {
    keywords: ['chair', 'seat', 'backrest'],
    baseDescription: 'Comfortable seating furniture',
    difficulty: 'intermediate' as const,
    timeRange: [15, 25],
    costRange: [800, 1500],
    materials: [
      { name: 'Pine Wood Planks', category: 'wood', quantity: 3, unit: 'pieces', cost: 120, priority: 'required' as const, notes: 'For seat and backrest' },
      { name: 'Wood Screws', category: 'hardware', quantity: 20, unit: 'pieces', cost: 25, priority: 'required' as const, notes: '50mm wood screws' },
      { name: 'Wood Glue', category: 'adhesive', quantity: 1, unit: 'bottle', cost: 35, priority: 'required' as const, notes: 'PVA wood glue' },
      { name: 'Sandpaper Set', category: 'tools', quantity: 1, unit: 'set', cost: 45, priority: 'required' as const, notes: '120, 220, 320 grit' },
      { name: 'Wood Stain', category: 'finish', quantity: 1, unit: 'liter', cost: 180, priority: 'optional' as const, notes: 'Natural wood stain' }
    ]
  },
  table: {
    keywords: ['table', 'desk', 'surface'],
    baseDescription: 'Functional table or desk furniture',
    difficulty: 'intermediate' as const,
    timeRange: [20, 35],
    costRange: [1200, 2500],
    materials: [
      { name: 'Oak Wood Planks', category: 'wood', quantity: 6, unit: 'pieces', cost: 200, priority: 'required' as const, notes: 'For tabletop and legs' },
      { name: 'Table Legs', category: 'wood', quantity: 4, unit: 'pieces', cost: 160, priority: 'required' as const, notes: 'Pre-made or custom cut' },
      { name: 'Corner Brackets', category: 'hardware', quantity: 8, unit: 'pieces', cost: 80, priority: 'required' as const, notes: 'Metal corner supports' },
      { name: 'Wood Screws', category: 'hardware', quantity: 30, unit: 'pieces', cost: 40, priority: 'required' as const, notes: 'Various sizes' },
      { name: 'Polyurethane Finish', category: 'finish', quantity: 1, unit: 'liter', cost: 250, priority: 'required' as const, notes: 'Protective coating' }
    ]
  },
  cabinet: {
    keywords: ['cabinet', 'storage', 'cupboard', 'wardrobe'],
    baseDescription: 'Storage cabinet or wardrobe',
    difficulty: 'advanced' as const,
    timeRange: [40, 60],
    costRange: [2000, 4000],
    materials: [
      { name: 'MDF Boards', category: 'wood', quantity: 8, unit: 'pieces', cost: 320, priority: 'required' as const, notes: '18mm thick MDF' },
      { name: 'Cabinet Hinges', category: 'hardware', quantity: 6, unit: 'pieces', cost: 120, priority: 'required' as const, notes: 'Soft-close hinges' },
      { name: 'Drawer Slides', category: 'hardware', quantity: 4, unit: 'pairs', cost: 200, priority: 'optional' as const, notes: 'Full extension slides' },
      { name: 'Cabinet Handles', category: 'hardware', quantity: 8, unit: 'pieces', cost: 160, priority: 'required' as const, notes: 'Modern brushed steel' },
      { name: 'Edge Banding', category: 'finish', quantity: 10, unit: 'meters', cost: 80, priority: 'required' as const, notes: 'Matching wood veneer' }
    ]
  },
  shelf: {
    keywords: ['shelf', 'bookshelf', 'shelving'],
    baseDescription: 'Wall-mounted or standing shelf unit',
    difficulty: 'beginner' as const,
    timeRange: [8, 15],
    costRange: [400, 800],
    materials: [
      { name: 'Pine Shelving Boards', category: 'wood', quantity: 4, unit: 'pieces', cost: 120, priority: 'required' as const, notes: '200mm x 25mm planks' },
      { name: 'Shelf Brackets', category: 'hardware', quantity: 8, unit: 'pieces', cost: 80, priority: 'required' as const, notes: 'Heavy-duty metal brackets' },
      { name: 'Wall Anchors', category: 'hardware', quantity: 16, unit: 'pieces', cost: 30, priority: 'required' as const, notes: 'For hollow wall mounting' },
      { name: 'Wood Screws', category: 'hardware', quantity: 20, unit: 'pieces', cost: 25, priority: 'required' as const, notes: '40mm screws' }
    ]
  }
};

const STYLE_CATEGORIES = [
  'modern', 'traditional', 'rustic', 'industrial', 'scandinavian', 'minimalist'
];

export function analyzeFurnitureImage(imageUrl: string, title: string, description?: string): Promise<FurnitureAnalysisResult> {
  return new Promise((resolve) => {
    // Simulate analysis delay
    setTimeout(() => {
      // Analyze title and description for furniture type
      const text = `${title} ${description || ''}`.toLowerCase();
      
      // Find the best matching furniture pattern
      let matchedPattern = FURNITURE_PATTERNS.table; // default
      let bestMatch = 0;
      
      Object.entries(FURNITURE_PATTERNS).forEach(([type, pattern]) => {
        const matches = pattern.keywords.filter(keyword => text.includes(keyword)).length;
        if (matches > bestMatch) {
          bestMatch = matches;
          matchedPattern = pattern;
        }
      });
      
      // Generate random variations within realistic ranges
      const timeVariation = Math.random() * 0.3 + 0.85; // 85-115% of base time
      const costVariation = Math.random() * 0.4 + 0.8; // 80-120% of base cost
      const randomStyle = STYLE_CATEGORIES[Math.floor(Math.random() * STYLE_CATEGORIES.length)];
      
      const result: FurnitureAnalysisResult = {
        description: `${matchedPattern.baseDescription} with custom design elements. This piece combines functionality with aesthetic appeal, suitable for modern South African homes.`,
        style_category: randomStyle,
        difficulty_level: matchedPattern.difficulty,
        estimated_time_hours: Math.round((matchedPattern.timeRange[0] + matchedPattern.timeRange[1]) / 2 * timeVariation),
        estimated_cost_min: Math.round(matchedPattern.costRange[0] * costVariation),
        estimated_cost_max: Math.round(matchedPattern.costRange[1] * costVariation),
        materials: matchedPattern.materials.map(material => ({
          ...material,
          estimated_cost: Math.round(material.cost * costVariation)
        }))
      };
      
      resolve(result);
    }, 2000 + Math.random() * 1000); // 2-3 second delay to simulate processing
  });
}
