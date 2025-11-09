'use client'

import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import unicefLogo from "@/assets/unicef-logo.png";
import rwandaCoatOfArms from "@/assets/rwanda-coat-of-arms.png";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLanguageChange = (lang: 'en' | 'rw') => {
    setLanguage(lang);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <header className="bg-header text-header-foreground shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4 md:gap-6">
            
            <Image
              src="/logo.png" 
              alt="NCDA Logo" 
              className="h-16" 
              width={216}
              height={64}
            />
            
        
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            <div className="flex flex-row gap-2 items-center">
              <button 
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 text-sm hover:bg-white/10 rounded flex items-center gap-2 text-header-foreground transition-colors ${
                  language === 'en' ? 'bg-white/20 font-semibold' : ''
                }`}
                aria-label="Switch to English"
                aria-pressed={language === 'en'}
              >
                🇺🇸 {t.header.english}
              </button>
              <button 
                onClick={() => handleLanguageChange('rw')}
                className={`px-3 py-1 text-sm hover:bg-white/10 rounded flex items-center gap-2 text-header-foreground transition-colors ${
                  language === 'rw' ? 'bg-white/20 font-semibold' : ''
                }`}
                aria-label="Switch to Kinyarwanda"
                aria-pressed={language === 'rw'}
              >
                🇷🇼 {t.header.kinyarwanda}
              </button>
            </div>
            
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-header-foreground hover:bg-white/10"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-2 pt-4">
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-2 text-left hover:bg-white/10 rounded flex items-center gap-2 text-header-foreground transition-colors ${
                    language === 'en' ? 'bg-white/20 font-semibold' : ''
                  }`}
                  aria-label="Switch to English"
                  aria-pressed={language === 'en'}
                >
                  🇺🇸 {t.header.english}
                </button>
                <button 
                  onClick={() => handleLanguageChange('rw')}
                  className={`px-3 py-2 text-left hover:bg-white/10 rounded flex items-center gap-2 text-header-foreground transition-colors ${
                    language === 'rw' ? 'bg-white/20 font-semibold' : ''
                  }`}
                  aria-label="Switch to Kinyarwanda"
                  aria-pressed={language === 'rw'}
                >
                  🇷🇼 {t.header.kinyarwanda}
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;