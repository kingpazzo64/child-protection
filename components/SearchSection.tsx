"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Filter, RotateCcw } from "lucide-react";

const districts = [
  "All Districts", "Gasabo", "Kicukiro", "Nyarugenge", "Bugesera", "Gatsibo", 
  "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana", "Burera", "Gakenke", 
  "Gicumbi", "Musanze", "Rulindo", "Gisagara", "Huye", "Kamonyi", "Muhanga", 
  "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango", "Karongi", "Ngororero", 
  "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"
];

const services = [
  "All service types", "Case Management", "General Child Protection", 
  "Emergency Response", "Legal Aid", "Psychosocial Support", "Disability Service", 
  "Rehabilitation", "Alternative Care", "Justice Services", "Education Services"
];

const SearchSection = ({ onFilter }: { onFilter: (district: string, service: string) => void }) => {
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedService, setSelectedService] = useState("All service types");

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    onFilter(district, selectedService);
  };

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    onFilter(selectedDistrict, service);
  };

  const handleSearch = () => {
    onFilter(selectedDistrict, selectedService);
  };

  const handleClearFilters = () => {
    setSelectedDistrict("All Districts");
    setSelectedService("All service types");
    onFilter("All Districts", "All service types");
  };

  return (
    <div className="bg-white shadow-sm border-b border-border p-4 md:p-6">
      <div className="container mx-auto px-2 md:px-4">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          CHILD PROTECTION SERVICES DIRECTORY
        </h1>
        
        <div className="flex flex-wrap gap-4 items-end justify-center">
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium text-foreground mb-2">
              District
            </label>
            <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium text-foreground mb-2">
              Service Type
            </label>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} className="bg-search-button hover:bg-search-button/90">
              <MapPin className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SearchSection;