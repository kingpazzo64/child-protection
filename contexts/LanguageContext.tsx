'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.en
}

// Default context value to prevent errors during SSR
const defaultContextValue: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  // Load language from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'rw')) {
        setLanguageState(savedLanguage)
        // Update HTML lang attribute immediately
        document.documentElement.lang = savedLanguage
      } else {
        // Set default language
        document.documentElement.lang = 'en'
      }
      setMounted(true)
    }
  }, [])

  // Save language to localStorage and update document language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      document.documentElement.lang = lang
    }
  }

  // Update document language when language changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      document.documentElement.lang = language
    }
  }, [language, mounted])

  // Always provide the context, even during SSR
  // Use default 'en' during SSR, then update to saved preference on client
  return (
    <LanguageContext.Provider
      value={{
        language: mounted ? language : 'en',
        setLanguage,
        t: translations[mounted ? language : 'en'],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  // Context always has a default value, so we don't need to check for undefined
  return context
}

