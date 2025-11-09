// app/api/chat/route.ts
// Chatbot API endpoint for processing queries about services and providers
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ChatMessage {
  query: string
  conversationId?: string
}

// Helper function to extract provider name from query
async function extractProviderName(query: string): Promise<string | null> {
  const lowerQuery = query.toLowerCase().trim()
  
  // Get all provider names from database for matching
  const allProviders = await prisma.directory.findMany({
    select: { nameOfOrganization: true }
  })
  
  // Check for provider names in quotes
  const quotedMatch = query.match(/"([^"]+)"/) || query.match(/'([^']+)'/)
  if (quotedMatch) {
    const quotedName = quotedMatch[1].trim()
    // Check if it matches a provider name (fuzzy match)
    for (const provider of allProviders) {
      if (provider.nameOfOrganization.toLowerCase().includes(quotedName.toLowerCase()) ||
          quotedName.toLowerCase().includes(provider.nameOfOrganization.toLowerCase().split(' ')[0])) {
        return provider.nameOfOrganization
      }
    }
  }
  
  // Check for patterns like "about [name]", "tell me about [name]", "[name] phone", etc.
  // First, try to match provider names directly in common question patterns
  const questionPatterns = [
    /(?:what|tell me|give me|show me|get|find|what's|what is).*?(?:phone|email|contact|location|address|details|information|services|number|website).*?(?:of|for|from|at|about)\s+([^?.!,\n]+?)(?:\?|$|\.|,)/i,
    /(?:phone|email|contact|location|address|details|information|services|number|website).*?(?:of|for|from|at|about)\s+([^?.!,\n]+?)(?:\?|$|\.|,)/i,
    /(?:about|for|from|of|at)\s+([^?.!,\n]{4,}?)(?:\s+(?:phone|email|contact|location|address|details|information|services|number|website))?/i,
    /([^?.!,\n]{4,}?)\s+(?:phone|email|contact|location|address|details|information|services|number|website)/i,
  ]
  
  for (const pattern of questionPatterns) {
    const match = query.match(pattern)
    if (match && match[1]) {
      const potentialName = match[1].trim().replace(/^(the|a|an)\s+/i, '')
      if (potentialName.length < 3) continue
      
      // Check if it matches a provider name
      for (const provider of allProviders) {
        const providerName = provider.nameOfOrganization.toLowerCase()
        const potentialNameLower = potentialName.toLowerCase()
        
        // Exact match or contains match
        if (providerName === potentialNameLower || 
            providerName.includes(potentialNameLower) ||
            potentialNameLower.includes(providerName)) {
          return provider.nameOfOrganization
        }
        
        // Word-by-word matching for better accuracy
        const providerWords = providerName.split(/\s+/).filter(w => w.length > 2)
        const queryWords = potentialNameLower.split(/\s+/).filter(w => w.length > 2)
        
        if (queryWords.length > 0) {
          const matchingWords = queryWords.filter(qw => 
            providerWords.some(pw => pw.includes(qw) || qw.includes(pw) || pw === qw)
          )
          
          // If significant portion matches
          if (matchingWords.length >= Math.min(2, Math.max(1, queryWords.length)) && 
              matchingWords.length >= Math.min(2, providerWords.length * 0.6)) {
            return provider.nameOfOrganization
          }
        }
      }
    }
  }
  
  // Try to find provider name by checking if any provider name appears in the query
  // This is a fallback that checks for provider names anywhere in the query
  for (const provider of allProviders) {
    const providerName = provider.nameOfOrganization.toLowerCase()
    const providerWords = providerName.split(/\s+/).filter(part => part.length > 2)
    
    if (providerWords.length === 0) continue
    
    // Check if the provider name appears in the query
    if (lowerQuery.includes(providerName)) {
      return provider.nameOfOrganization
    }
    
    // Check if multiple words from the provider name appear
    if (providerWords.length >= 2) {
      const matchingWords = providerWords.filter(word => lowerQuery.includes(word))
      // If at least 60% of words match or at least 2 words match
      if (matchingWords.length >= Math.max(2, Math.ceil(providerWords.length * 0.6))) {
        return provider.nameOfOrganization
      }
    } else if (providerWords.length === 1 && lowerQuery.includes(providerWords[0])) {
      // For single-word provider names, require it to be a significant word (not common words)
      const commonWords = ['the', 'and', 'or', 'for', 'of', 'in', 'on', 'at', 'to', 'a', 'an']
      if (!commonWords.includes(providerWords[0]) && providerWords[0].length > 4) {
        return provider.nameOfOrganization
      }
    }
  }
  
  return null
}

// Detect what specific information is being requested
function detectInformationRequest(query: string): {
  wantsPhone: boolean
  wantsEmail: boolean
  wantsLocation: boolean
  wantsServices: boolean
  wantsWebsite: boolean
  wantsAll: boolean
} {
  const lowerQuery = query.toLowerCase()
  
  return {
    wantsPhone: /phone|call|contact.*number|telephone|mobile|cell/i.test(lowerQuery),
    wantsEmail: /email|e-mail|mail|contact.*email/i.test(lowerQuery),
    wantsLocation: /location|address|where|place|area|district|sector/i.test(lowerQuery),
    wantsServices: /service|what.*offer|what.*provide|what.*do/i.test(lowerQuery),
    wantsWebsite: /website|web.*site|url|online|internet/i.test(lowerQuery),
    wantsAll: /all|everything|full|complete|details|information|tell me about|about/i.test(lowerQuery) && 
               !/phone|email|location|service|website/.test(lowerQuery)
  }
}

// Simple query understanding - can be enhanced with AI later
async function understandQuery(query: string): Promise<{
  intent: 'search' | 'info' | 'greeting' | 'help' | 'provider_details' | 'unknown'
  entities: {
    district?: string
    serviceType?: string
    beneficiaryType?: string
    providerName?: string
    informationRequest?: {
      wantsPhone: boolean
      wantsEmail: boolean
      wantsLocation: boolean
      wantsServices: boolean
      wantsWebsite: boolean
      wantsAll: boolean
    }
  }
}> {
  const lowerQuery = query.toLowerCase().trim()
  
  // Greeting detection
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i.test(lowerQuery)) {
    return { intent: 'greeting', entities: {} }
  }
  
  // Help detection
  if (/^(help|what can you do|how can you help|what do you do)/i.test(lowerQuery)) {
    return { intent: 'help', entities: {} }
  }
  
  // Check for provider details request first
  const providerName = await extractProviderName(query)
  if (providerName) {
    const informationRequest = detectInformationRequest(query)
    // If it's asking about a specific provider, prioritize provider_details intent
    if (informationRequest.wantsPhone || informationRequest.wantsEmail || 
        informationRequest.wantsLocation || informationRequest.wantsServices || 
        informationRequest.wantsWebsite || informationRequest.wantsAll ||
        /about|tell me|information|details|what.*is/i.test(lowerQuery)) {
      return {
        intent: 'provider_details',
        entities: {
          providerName,
          informationRequest
        }
      }
    }
  }
  
  // Search intent detection - enhanced to detect complex queries
  const searchKeywords = ['find', 'search', 'look for', 'need', 'looking for', 'where', 'who', 'which', 'show me', 'list', 'what are', 'what is', 'tell me', 'give me']
  const isSearch = searchKeywords.some(keyword => lowerQuery.includes(keyword))
  
  // Also detect queries about providers with specific services/beneficiaries in districts
  const providerPatterns = [
    /(?:what are|what is|show me|list|find|search for).*?(?:provider|service|care|support).*?(?:in|at|from|of).*?(?:district|area|location)/i,
    /.*?(?:provider|service|care|support).*?(?:in|at|from|of).*?(?:district|area|location)/i,
    /(?:alternative care|case management|counseling|legal aid|psychosocial|rehabilitation|education).*?(?:in|at|from|of).*?district/i,
  ]
  
  const isComplexSearch = providerPatterns.some(pattern => pattern.test(lowerQuery)) || 
    (isSearch && (lowerQuery.includes('service') || lowerQuery.includes('provider') || lowerQuery.includes('care')))
  
  if (isComplexSearch || isSearch || lowerQuery.includes('service') || lowerQuery.includes('provider')) {
    const entities: any = {}
    
    // Extract district - check all districts
    const districts = await prisma.district.findMany()
    for (const district of districts) {
      const districtNameLower = district.name.toLowerCase()
      // Check if district name appears in query (case-insensitive)
      if (lowerQuery.includes(districtNameLower)) {
        entities.district = district.name
        break
      }
    }
    
    // Extract service type - check all service types
    // Sort by length (longest first) to match multi-word service types first (e.g., "Alternative Care" before "Care")
    const serviceTypes = await prisma.serviceType.findMany()
    const sortedServiceTypes = serviceTypes.sort((a, b) => b.name.length - a.name.length)
    
    // Map of service type keywords and their variations for better matching
    const serviceKeywords: Record<string, string[][]> = {
      'alternative care': [['alternative', 'care'], ['foster', 'care'], ['adoption']],
      'case management': [['case', 'management']],
      'counseling': [['counseling'], ['counselling'], ['therapy']],
      'legal aid': [['legal', 'aid'], ['legal', 'services']],
      'psychosocial support': [['psychosocial', 'support'], ['mental', 'health']],
      'rehabilitation': [['rehabilitation'], ['rehab']],
      'education services': [['education'], ['educational', 'services']],
      'emergency response': [['emergency', 'response']],
      'general child protection': [['child', 'protection'], ['general', 'protection']],
    }
    
    for (const serviceType of sortedServiceTypes) {
      const serviceNameLower = serviceType.name.toLowerCase()
      const serviceWords = serviceNameLower.split(/\s+/).filter(w => w.length > 2) // Filter out short words
      
      // Method 1: Direct match - check if service type name appears in query
      if (lowerQuery.includes(serviceNameLower)) {
        entities.serviceType = serviceType.name
        break
      }
      
      // Method 2: Multi-word matching - check if all significant words of service type appear in query
      if (serviceWords.length > 1) {
        const matchingWords = serviceWords.filter(word => lowerQuery.includes(word))
        // If at least 2 words match, or if it's a 2-word service and both words match
        if (matchingWords.length >= Math.min(2, serviceWords.length) || 
            (serviceWords.length === 2 && matchingWords.length === 2)) {
          entities.serviceType = serviceType.name
          break
        }
      } else if (serviceWords.length === 1) {
        // Single word service type - require exact or very close match
        if (lowerQuery.includes(serviceWords[0])) {
          entities.serviceType = serviceType.name
          break
        }
      }
      
      // Method 3: Keyword variations - check if query contains known variations of this service type
      const serviceKey = Object.keys(serviceKeywords).find(key => 
        serviceNameLower.includes(key) || key.includes(serviceNameLower)
      )
      
      if (serviceKey && serviceKeywords[serviceKey]) {
        const keywordGroups = serviceKeywords[serviceKey]
        // Check if any group of keywords appears in the query
        for (const keywordGroup of keywordGroups) {
          const allKeywordsMatch = keywordGroup.every(keyword => lowerQuery.includes(keyword))
          if (allKeywordsMatch && keywordGroup.length > 0) {
            entities.serviceType = serviceType.name
            break
          }
        }
        if (entities.serviceType) break
      }
    }
    
    // Extract beneficiary type - check all beneficiary types
    const beneficiaryTypes = await prisma.beneficiaryType.findMany()
    for (const beneficiaryType of beneficiaryTypes) {
      const beneficiaryNameLower = beneficiaryType.name.toLowerCase()
      // Check if beneficiary type name appears in query
      if (lowerQuery.includes(beneficiaryNameLower)) {
        entities.beneficiaryType = beneficiaryType.name
        break
      }
      // Also check for common variations
      const beneficiaryVariations: Record<string, string[]> = {
        'CP_SURVIVOR': ['survivor', 'abuse', 'violence'],
        'STREET_CONNECTED': ['street', 'homeless'],
        'REFUGEE': ['refugee'],
        'DISABLED': ['disability', 'disabled', 'special needs'],
        'UNACCOMPANIED_SEPARATED': ['unaccompanied', 'separated', 'orphan'],
        'IN_CONFLICT_WITH_LAW': ['conflict with law', 'juvenile', 'delinquent'],
        'GBV_SURVIVOR': ['gbv', 'gender based', 'pregnancy'],
      }
      
      if (beneficiaryVariations[beneficiaryType.name]) {
        const variations = beneficiaryVariations[beneficiaryType.name]
        if (variations.some(variation => lowerQuery.includes(variation))) {
          entities.beneficiaryType = beneficiaryType.name
          break
        }
      }
    }
    
    // Extract provider name if not already extracted (only if no service type or district was found)
    if (!entities.providerName && providerName && !entities.serviceType && !entities.district) {
      entities.providerName = providerName
    }
    
    return { intent: 'search', entities }
  }
  
  // Info intent (questions about specific things)
  if (/^(what|tell me|explain|describe|information about)/i.test(lowerQuery)) {
    // Check if it's about a provider
    if (providerName) {
      return {
        intent: 'provider_details',
        entities: {
          providerName,
          informationRequest: detectInformationRequest(query)
        }
      }
    }
    return { intent: 'info', entities: {} }
  }
  
  return { intent: 'unknown', entities: {} }
}

export async function POST(req: NextRequest) {
  try {
    const { query }: ChatMessage = await req.json()
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ 
        response: "I didn't understand that. Could you please rephrase your question?",
        suggestions: [
          "Find services in Kigali",
          "Show me counseling services",
          "What services are available?"
        ]
      })
    }
    
    // Understand the query
    const understanding = await understandQuery(query)
    
    // Handle different intents
    switch (understanding.intent) {
      case 'greeting':
        return NextResponse.json({
          response: "Hello! I'm the NCDA Assistant. I can help you find child protection services by location, type, or specific needs. What would you like to know?",
          suggestions: [
            "Find services in my district",
            "Show me all service types",
            "What services are available?"
          ]
        })
      
      case 'help':
        return NextResponse.json({
          response: "I can help you:\n\n• Find services by district, service type, or beneficiary type\n• Search for providers with specific services in a district (e.g., 'alternative care providers in Kicukiro')\n• Find services for specific beneficiary types in a district\n• Get detailed information about any provider (phone, email, location, services)\n• Answer questions about the directory\n\n**Examples:**\n• 'Find alternative care providers in Kicukiro'\n• 'What are the counseling services in Kigali?'\n• 'Show me services for children with disabilities in Gasabo'\n• 'Find services in Kigali'\n• 'What's the phone number of [Provider Name]?'\n• 'Tell me about [Provider Name]'",
          suggestions: [
            "Find alternative care providers in Kicukiro",
            "Show me counseling services in Kigali",
            "What services are available?"
          ]
        })
      
      case 'search':
        // Perform search based on entities
        const where: any = {}
        
        // Build location filter
        if (understanding.entities.district) {
          where.locations = {
            some: {
              district: {
                name: understanding.entities.district
              }
            }
          }
        }
        
        // Build service type filter
        if (understanding.entities.serviceType) {
          where.services = {
            some: {
              service: {
                name: understanding.entities.serviceType
              }
            }
          }
        }
        
        // Build beneficiary type filter
        if (understanding.entities.beneficiaryType) {
          where.beneficiaries = {
            some: {
              beneficiary: {
                name: understanding.entities.beneficiaryType
              }
            }
          }
        }
        
        // Build provider name filter
        if (understanding.entities.providerName) {
          where.nameOfOrganization = {
            contains: understanding.entities.providerName,
            mode: 'insensitive'
          }
        }
        
        // If no filters were specified, return a helpful message
        if (Object.keys(where).length === 0) {
          return NextResponse.json({
            response: "I can help you find service providers. Try asking:\n\n• 'Find alternative care providers in Kicukiro'\n• 'Show me counseling services in Kigali'\n• 'What services are available in Gasabo?'\n• 'Find services for children with disabilities'\n\nYou can search by service type, district, or beneficiary type.",
            suggestions: [
              "Find services in Kigali",
              "Show me all service types",
              "What services are available?"
            ]
          })
        }
        
        const results = await prisma.directory.findMany({
          where: where,
          include: {
            services: { include: { service: true } },
            beneficiaries: { include: { beneficiary: true } },
            locations: {
              include: {
                district: true,
                sector: true,
                cell: true,
                village: true,
              },
            },
          },
          take: 20, // Increased limit for better results
        })
        
        // Build a descriptive response message
        let response = ""
        const filterParts: string[] = []
        
        if (understanding.entities.serviceType) {
          filterParts.push(`${understanding.entities.serviceType} services`)
        }
        if (understanding.entities.beneficiaryType) {
          filterParts.push(`services for ${understanding.entities.beneficiaryType.replace(/_/g, ' ').toLowerCase()}`)
        }
        if (understanding.entities.district) {
          filterParts.push(`in ${understanding.entities.district}`)
        }
        if (understanding.entities.providerName) {
          filterParts.push(`named "${understanding.entities.providerName}"`)
        }
        
        if (results.length === 0) {
          response = `I couldn't find any service providers`
          if (filterParts.length > 0) {
            response += ` with ${filterParts.join(' and ')}.`
          } else {
            response += ` matching your search.`
          }
          
          // Provide helpful suggestions
          const suggestions: string[] = []
          if (understanding.entities.district && !understanding.entities.serviceType) {
            suggestions.push(`What services are available in ${understanding.entities.district}?`)
          }
          if (understanding.entities.serviceType && !understanding.entities.district) {
            suggestions.push(`Find ${understanding.entities.serviceType} services in Kigali`)
          }
          suggestions.push("Show me all services", "Find services in Kigali")
          
          return NextResponse.json({
            response,
            suggestions: suggestions.slice(0, 3)
          })
        }
        
        // Format successful response
        response = `I found ${results.length} service provider${results.length > 1 ? 's' : ''}`
        if (filterParts.length > 0) {
          response += ` with ${filterParts.join(' and ')}:\n\n`
        } else {
          response += `:\n\n`
        }
        
        const searchSuggestions: string[] = []
        
        results.forEach((dir, index) => {
          response += `${index + 1}. ${dir.nameOfOrganization}\n`
          
          // Show services (highlight if it matches the search)
          if (dir.services && dir.services.length > 0) {
            const serviceNames = dir.services.map(s => s.service.name).join(', ')
            response += `   Services: ${serviceNames}\n`
          }
          
          // Show locations (highlight the district if it matches)
          if (dir.locations && dir.locations.length > 0) {
            const locations = dir.locations
              .filter(loc => !understanding.entities.district || loc.district.name === understanding.entities.district)
              .map(loc => `${loc.district.name} - ${loc.sector.name}`)
              .filter((v, i, a) => a.indexOf(v) === i)
            
            if (locations.length > 0) {
              response += `   Location: ${locations.join(', ')}\n`
            } else if (dir.locations.length > 0) {
              // Show all locations if no district filter
              const allLocations = dir.locations
                .map(loc => loc.district.name)
                .filter((v, i, a) => a.indexOf(v) === i)
                .join(', ')
              response += `   Locations: ${allLocations}\n`
            }
          }
          
          // Show contact info
          if (dir.phone) {
            response += `   Phone: ${dir.phone}\n`
          }
          if (dir.email && index < 3) { // Show email for first 3 results
            response += `   Email: ${dir.email}\n`
          }
          
          response += '\n'
          
          // Add suggestions for getting more details
          if (index === 0) {
            searchSuggestions.push(`Tell me about ${dir.nameOfOrganization}`)
          }
        })
        
        if (results.length === 20) {
          response += `\n(Showing first 20 results. Try being more specific with your search for better results.)`
        }
        
        // Add contextual suggestions
        const uniqueSuggestions = Array.from(new Set(searchSuggestions))
        if (understanding.entities.district && understanding.entities.serviceType) {
          // If searching by district + service, suggest other services in same district
          uniqueSuggestions.push(`What other services are available in ${understanding.entities.district}?`)
        }
        if (understanding.entities.serviceType && !understanding.entities.district) {
          // If searching by service only, suggest adding a district
          uniqueSuggestions.push(`Find ${understanding.entities.serviceType} services in Kigali`)
        }
        if (uniqueSuggestions.length < 3) {
          uniqueSuggestions.push("Find services in another district", "Show me all service types")
        }
        
        return NextResponse.json({
          response,
          results: results.map(dir => ({
            id: dir.id,
            name: dir.nameOfOrganization,
            services: dir.services?.map(s => s.service.name) || [],
            locations: dir.locations?.map(loc => loc.district.name) || [],
            phone: dir.phone,
            email: dir.email
          })),
          suggestions: uniqueSuggestions.slice(0, 3)
        })
      
      case 'provider_details':
        // Get specific provider details
        if (!understanding.entities.providerName) {
          return NextResponse.json({
            response: "I couldn't identify which provider you're asking about. Could you please mention the provider's name?",
            suggestions: [
              "Find services in Kigali",
              "Show me all service types",
              "What services are available?"
            ]
          })
        }
        
        const provider = await prisma.directory.findFirst({
          where: {
            nameOfOrganization: {
              contains: understanding.entities.providerName,
              mode: 'insensitive'
            }
          },
          include: {
            services: { include: { service: true } },
            beneficiaries: { include: { beneficiary: true } },
            locations: {
              include: {
                district: true,
                sector: true,
                cell: true,
                village: true,
              },
            },
          },
        })
        
        if (!provider) {
          // Try fuzzy search - look for providers with similar names
          const allProviders = await prisma.directory.findMany({
            select: { nameOfOrganization: true }
          })
          
          const queryWords = understanding.entities.providerName.toLowerCase().split(/\s+/).filter(w => w.length > 2)
          const similarProviders = allProviders
            .map(p => {
              const providerWords = p.nameOfOrganization.toLowerCase().split(/\s+/).filter(w => w.length > 2)
              const matchingWords = queryWords.filter(qw => 
                providerWords.some(pw => pw.includes(qw) || qw.includes(pw) || pw === qw)
              )
              return { provider: p, score: matchingWords.length }
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.provider)
          
          let errorResponse = `I couldn't find a provider exactly named "${understanding.entities.providerName}".`
          if (similarProviders.length > 0) {
            errorResponse += ` Did you mean one of these?\n\n`
            similarProviders.forEach((p, i) => {
              errorResponse += `${i + 1}. ${p.nameOfOrganization}\n`
            })
            errorResponse += `\nTry asking about one of these providers, for example: "Tell me about ${similarProviders[0].nameOfOrganization}"`
          } else {
            errorResponse += ` Could you check the spelling or try searching for providers in a specific area?`
          }
          
          const suggestions = similarProviders.length > 0 
            ? [`Tell me about ${similarProviders[0].nameOfOrganization}`, "Find services in Kigali", "Show me all service types"]
            : ["Find services in Kigali", "Show me all service types", "What services are available?"]
          
          return NextResponse.json({
            response: errorResponse,
            suggestions
          })
        }
        
        const infoRequest = understanding.entities.informationRequest || {
          wantsPhone: false,
          wantsEmail: false,
          wantsLocation: false,
          wantsServices: false,
          wantsWebsite: false,
          wantsAll: true
        }
        
        // Build response based on what information is requested
        let providerResponse = `${provider.nameOfOrganization}\n\n`
        const details: string[] = []
        
        if (infoRequest.wantsAll || infoRequest.wantsServices || (!infoRequest.wantsPhone && !infoRequest.wantsEmail && !infoRequest.wantsLocation && !infoRequest.wantsWebsite)) {
          if (provider.services && provider.services.length > 0) {
            const serviceNames = provider.services.map(s => s.service.name).join(', ')
            details.push(`Services: ${serviceNames}`)
          }
        }
        
        if (infoRequest.wantsAll || infoRequest.wantsLocation) {
          if (provider.locations && provider.locations.length > 0) {
            const locations = provider.locations.map(loc => 
              `${loc.district.name} - ${loc.sector.name}${loc.cell ? ` - ${loc.cell.name}` : ''}${loc.village ? ` - ${loc.village.name}` : ''}`
            ).join('\n   ')
            details.push(`Locations:\n   ${locations}`)
          }
        }
        
        if (infoRequest.wantsAll || infoRequest.wantsPhone) {
          if (provider.phone) {
            details.push(`Phone: ${provider.phone}`)
          } else if (infoRequest.wantsPhone) {
            details.push(`Phone: Not available`)
          }
        }
        
        if (infoRequest.wantsAll || infoRequest.wantsEmail) {
          if (provider.email) {
            details.push(`Email: ${provider.email}`)
          } else if (infoRequest.wantsEmail) {
            details.push(`Email: Not available`)
          }
        }
        
        if (infoRequest.wantsAll || infoRequest.wantsWebsite) {
          if (provider.website) {
            details.push(`Website: ${provider.website}`)
          } else if (infoRequest.wantsWebsite) {
            details.push(`Website: Not available`)
          }
        }
        
        if (infoRequest.wantsAll && provider.beneficiaries && provider.beneficiaries.length > 0) {
          const beneficiaryNames = provider.beneficiaries.map(b => b.beneficiary.name).join(', ')
          details.push(`Beneficiaries: ${beneficiaryNames}`)
        }
        
        if (infoRequest.wantsAll && provider.otherServices) {
          details.push(`Other Services: ${provider.otherServices}`)
        }
        
        if (infoRequest.wantsAll) {
          details.push(`Service Type: ${provider.paid ? 'Paid' : 'Free'}`)
        }
        
        if (details.length === 0) {
          providerResponse = `I found ${provider.nameOfOrganization}, but I'm not sure what information you need. Here's what I have:\n\n`
          if (provider.services && provider.services.length > 0) {
            const serviceNames = provider.services.map(s => s.service.name).join(', ')
            details.push(`Services: ${serviceNames}`)
          }
          if (provider.locations && provider.locations.length > 0) {
            const locations = provider.locations.map(loc => loc.district.name).filter((v, i, a) => a.indexOf(v) === i).join(', ')
            details.push(`Locations: ${locations}`)
          }
          if (provider.phone) details.push(`Phone: ${provider.phone}`)
          if (provider.email) details.push(`Email: ${provider.email}`)
          if (provider.website) details.push(`Website: ${provider.website}`)
        }
        
        providerResponse += details.join('\n\n')
        
        // Add helpful suggestions
        const suggestions: string[] = []
        if (!infoRequest.wantsPhone && provider.phone) {
          suggestions.push(`What's ${provider.nameOfOrganization}'s phone number?`)
        }
        if (!infoRequest.wantsEmail && provider.email) {
          suggestions.push(`What's ${provider.nameOfOrganization}'s email?`)
        }
        if (!infoRequest.wantsLocation && provider.locations && provider.locations.length > 0) {
          suggestions.push(`Where is ${provider.nameOfOrganization} located?`)
        }
        if (suggestions.length === 0) {
          suggestions.push("Find other services", "Show me all service types", "What services are available?")
        }
        
        return NextResponse.json({
          response: providerResponse,
          provider: {
            id: provider.id,
            name: provider.nameOfOrganization,
            services: provider.services?.map(s => s.service.name) || [],
            locations: provider.locations?.map(loc => loc.district.name) || [],
            phone: provider.phone,
            email: provider.email,
            website: provider.website
          },
          suggestions: suggestions.slice(0, 3)
        })
      
      case 'info':
        // Get general information
        const totalProviders = await prisma.directory.count()
        const serviceTypes = await prisma.serviceType.findMany()
        const districts = await prisma.district.findMany()
        
        return NextResponse.json({
          response: `The Child Protection Services Directory contains:\n\n• ${totalProviders} service provider${totalProviders !== 1 ? 's' : ''}\n• ${serviceTypes.length} different service types\n• Services available in ${districts.length} districts\n\nYou can search for services by district, service type, or specific needs. What would you like to find?`,
          suggestions: [
            "Find services in my district",
            "Show me all service types",
            "What services are available?"
          ]
        })
      
      default:
        return NextResponse.json({
          response: "I'm not sure I understand. I can help you find child protection services. Try asking:\n\n• 'Find services in [district name]'\n• 'Show me [service type] services'\n• 'What services are available?'",
          suggestions: [
            "Find services in Kigali",
            "Show me counseling services",
            "What services are available?"
          ]
        })
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ 
      response: "I'm sorry, I encountered an error processing your request. Please try again or rephrase your question.",
      suggestions: [
        "Find services in Kigali",
        "Show me all services",
        "What services are available?"
      ]
    }, { status: 500 })
  }
}

