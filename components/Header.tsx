"use client";

import { Globe, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const EmergencyContactsModal = () => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-red-600" />
          Emergency Contacts
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h3 className="font-semibold text-red-800 mb-2">National Emergency Services</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Police Emergency</span>
              <a href="tel:112" className="font-mono font-bold text-red-600 hover:text-red-800">
                112
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Police (General)</span>
              <a href="tel:999" className="font-mono font-bold text-red-600 hover:text-red-800">
                999
              </a>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Child Protection Services</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Child Helpline</span>
              <a href="tel:116" className="font-mono font-bold text-blue-600 hover:text-blue-800">
                116
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">NCDA Hotline</span>
              <a href="tel:3030" className="font-mono font-bold text-blue-600 hover:text-blue-800">
                3030
              </a>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h3 className="font-semibold text-green-800 mb-2">Medical Emergency</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Medical Emergency</span>
              <a href="tel:912" className="font-mono font-bold text-green-600 hover:text-green-800">
                912
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ambulance Service</span>
              <a href="tel:+250788888888" className="font-mono font-bold text-green-600 hover:text-green-800">
                +250 788 888 888
              </a>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>All emergency numbers are toll-free. In case of immediate danger, call 112.</p>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <header className="bg-header text-header-foreground shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="NCDA Logo" 
              className="h-16" 
              width={216}
              height={64}
            />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground">
              Home
            </Button>
            <Button variant="ghost" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground">
              Find Services
            </Button>
            <Button variant="ghost" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground">
              Report Abuse
            </Button>
            <Dialog open={isEmergencyModalOpen} onOpenChange={setIsEmergencyModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground">
                  Emergency Contacts
                </Button>
              </DialogTrigger>
              <EmergencyContactsModal />
            </Dialog>
            <div className="relative group">
              <Button variant="ghost" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground flex items-center gap-2">
                🇺🇸 English ▼
              </Button>
              <div className="absolute top-full right-0 mt-1 bg-white border border-border rounded-lg shadow-lg py-2 min-w-[160px] z-50 hidden group-hover:block">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-foreground">
                  🇺🇸 English
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-foreground">
                  🇷🇼 Kinyarwanda
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-header-foreground hover:bg-white/10"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground justify-start">
                Home
              </Button>
              <Button variant="ghost" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground justify-start">
                Find Services
              </Button>
              <Button variant="ghost" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground justify-start">
                Report Abuse
              </Button>
              <Dialog open={isEmergencyModalOpen} onOpenChange={setIsEmergencyModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground justify-start">
                    Emergency Contacts
                  </Button>
                </DialogTrigger>
                <EmergencyContactsModal />
              </Dialog>
              <div className="relative group">
                <Button variant="ghost" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground justify-start flex items-center gap-2 w-full">
                  🇺🇸 English ▼
                </Button>
                <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-lg shadow-lg py-2 min-w-[160px] z-50 hidden group-hover:block">
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-foreground">
                    🇺🇸 English
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-foreground">
                    🇷🇼 Kinyarwanda
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;