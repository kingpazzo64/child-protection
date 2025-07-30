"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Filter, RotateCcw } from "lucide-react";

type SearchSectionProps = {
  onFilter: (district: string, service: string) => void;
  districts: { id: number; name: string }[];
  serviceTypes: { id: number; name: string }[];
};

const SearchSection = ({ onFilter, districts, serviceTypes }: SearchSectionProps) => {
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
                <SelectItem value="All Districts">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.name}>
                    {district.name}
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
                <SelectItem value="All service types">All service types</SelectItem>
                {serviceTypes.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name}
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