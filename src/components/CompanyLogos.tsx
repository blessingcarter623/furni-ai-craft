interface CompanyLogo {
  name: string
  logo: string
}

const companies: CompanyLogo[] = [
  { name: 'Builders', logo: 'B' },
  { name: 'Leroy', logo: 'L' },
  { name: 'Gelmar', logo: 'G' },
  { name: 'Makro', logo: 'M' },
  { name: 'Cashbuild', logo: 'C' },
  { name: 'Timber City', logo: 'T' },
]

export default function CompanyLogos() {
  return (
    <div className="flex items-center justify-center space-x-8 opacity-50">
      {companies.map((company) => (
        <div
          key={company.name}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-xs font-medium">
            {company.logo}
          </div>
          <span className="text-sm">{company.name}</span>
        </div>
      ))}
    </div>
  )
}