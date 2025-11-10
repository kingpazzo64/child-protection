'use client'

import { Button } from "@/components/ui/button";
import { Globe, Phone, Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer 
      className="w-full"
      style={{
        backgroundColor: 'hsl(var(--footer-bg))',
        color: 'hsl(var(--footer-foreground))',
      }}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-12">
        

        {/* Districts Section */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <h3 className="text-lg font-semibold mb-4">{t.footer.serviceDistricts}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
            {[
              "Gasabo", "Kicukiro", "Nyarugenge", "Bugesera", "Gatsibo", "Kayonza",
              "Kirehe", "Ngoma", "Nyagatare", "Rwamagana", "Burera", "Gakenke",
              "Gicumbi", "Musanze", "Rulindo", "Gisagara", "Huye", "Kamonyi",
              "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango", "Karongi",
              "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"
            ].map((district) => (
              <Button 
                key={district} 
                variant="ghost" 
                className="justify-start p-1 h-auto text-white/80 hover:bg-white/10 hover:text-white"
                style={{ color: 'hsla(var(--footer-foreground) / 0.8)' }}
              >
                {district}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-lg font-semibold mb-4">{t.footer.availableServices}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {[
              "Alternative Care",
              "CP Case Management",
              "CP Specialised Services",
              "Education",
              "GBV Case Management",
              "Health Services",
              "Legal Services",
              "Psychosocial Support",
              "Rehabilitation"
            ].map((service) => (
              <Button 
                key={service} 
                variant="ghost" 
                className="justify-start p-1 h-auto text-white/80 hover:bg-white/10 hover:text-white"
                style={{ color: 'hsla(var(--footer-foreground) / 0.8)' }}
              >
                {t.serviceTypes[service] || service}
              </Button>
            ))}
          </div>
        </div>

        {/* Custodian Section */}
        <div className="mt-8 pt-8 border-t border-white/20" aria-labelledby="custodian-heading">
          <div className="text-center space-y-4 max-w-4xl mx-auto px-4">
            <h3 
              id="custodian-heading" 
              className="text-xl font-bold mb-4"
              style={{ 
                color: 'hsl(var(--footer-foreground))',
                fontSize: '1.25rem',
                lineHeight: '1.75rem',
                fontWeight: 700
              }}
            >
              {t.footer.custodian}
            </h3>
            {/* <p 
              className="leading-relaxed"
              style={{ 
                color: 'hsl(var(--footer-foreground))',
                fontSize: '1rem',
                lineHeight: '1.75rem',
                maxWidth: '100%'
              }}
              aria-label={`Custodian information: ${t.footer.custodianDescription}`}
            >
              <strong style={{ fontWeight: 700 }}>
                MIGEPROF/NCDA
              </strong>
              {' '}{t.footer.custodianDescription}
            </p> */}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-white/20 text-center">
          <p 
            className="text-sm"
            style={{ color: 'hsla(var(--footer-foreground) / 0.8)' }}
          >
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;