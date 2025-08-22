import { Button } from "@/components/ui/button";
import { Globe, Phone, Facebook, Twitter, Youtube, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container mx-auto px-4 py-12">
        

        {/* Districts Section */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <h3 className="text-lg font-semibold mb-4">Service Districts</h3>
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
                className="justify-start p-1 h-auto text-footer-foreground/80 hover:bg-white/10 hover:text-footer-foreground"
              >
                {district}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-lg font-semibold mb-4">Available Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {[
              "Case Management", "General Child Protection", "Emergency Response",
              "Legal Aid", "Psychosocial Support", "Disability Service",
              "Rehabilitation", "Alternative Care", "Justice Services", "Education Services"
            ].map((service) => (
              <Button 
                key={service} 
                variant="ghost" 
                className="justify-start p-1 h-auto text-footer-foreground/80 hover:bg-white/10 hover:text-footer-foreground"
              >
                {service}
              </Button>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-sm text-footer-foreground/80">
            © 2024 National Child Development Agency (NCDA). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;