import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Star, Share2, Flag } from "lucide-react";

interface ServiceCardProps {
  name: string;
  mainService: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  services: string[];
  verified: boolean;
  rating: number;
}

const ServiceCard = ({ 
  name, 
  mainService, 
  category, 
  description, 
  address, 
  phone, 
  email, 
  services,
  verified,
  rating 
}: ServiceCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-foreground mb-2">
              {name}
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {mainService}
            </Badge>
          </div>
          {/* <div className="flex items-center gap-2">
            {verified && (
              <Badge variant="outline" className="text-success border-success">
                ✓ Verified
              </Badge>
            )}
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < rating ? 'text-warning fill-warning' : 'text-muted'}`} 
                />
              ))}
            </div>
          </div> */}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed">
          {description}
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-foreground">{address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-foreground">{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-foreground">{email}</span>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-sm font-medium text-foreground mb-2">Services Offered:</p>
          <div className="flex flex-wrap gap-1">
            {services.map((service, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs text-muted-foreground border-muted"
              >
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-border">
          <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
            <Share2 className="w-3 h-3 mr-1" />
            Share
          </Button>
          <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
            <Flag className="w-3 h-3 mr-1" />
            Report Incorrect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;