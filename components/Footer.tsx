import { Button } from "@/components/ui/button";
import { Globe, Phone, Facebook, Twitter, Youtube, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Language Toggle */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Language
            </h3>
            <div className="flex flex-col space-y-3 items-start">
              <Button variant="ghost" className="justify-start p-0 h-auto text-footer-foreground hover:bg-white/10 text-left">
                🇷🇼 Kinyarwanda
              </Button>
              <Button variant="ghost" className="justify-start p-0 h-auto text-footer-foreground hover:bg-white/10 text-left">
                🇬🇧 English
              </Button>
            </div>
          </div>

          {/* Emergency Hotlines */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Emergency Hotlines
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-medium">For Immediate Assistance:</p>
                <p className="text-footer-foreground/90">114</p>
              </div>
              <div>
                <p className="font-medium">Child Protection Hotline:</p>
                <p className="text-footer-foreground/90">116</p>
              </div>
              <div>
                <p className="font-medium">General Hotline:</p>
                <p className="text-footer-foreground/90">+250 788 123 123</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Button variant="ghost" className="justify-start p-0 h-auto text-footer-foreground hover:bg-white/10">
                How to Report Abuse
              </Button>
              <Button variant="ghost" className="justify-start p-0 h-auto text-footer-foreground hover:bg-white/10">
                Emergency Contacts
              </Button>
              <Button variant="ghost" className="justify-start p-0 h-auto text-footer-foreground hover:bg-white/10">
                Children's Rights
              </Button>
              <Button variant="ghost" className="justify-start p-0 h-auto text-footer-foreground hover:bg-white/10">
                Our Partners
              </Button>
              <Button variant="ghost" className="justify-start p-0 h-auto text-footer-foreground hover:bg-white/10">
                Volunteer & Join Us
              </Button>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" size="icon" className="text-footer-foreground hover:bg-white/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-footer-foreground hover:bg-white/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-footer-foreground hover:bg-white/10">
                <Youtube className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-footer-foreground hover:bg-white/10">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

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