"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Filter, RotateCcw } from "lucide-react";

type SearchSectionProps = {
  onFilter: (district: string, service: string, urgency: string) => void;
  districts: { id: number; name: string }[];
  serviceTypes: { id: number; name: string }[];
};

const urgencyLevels = [
  "All urgency levels", "Low", "Medium", "High", "Critical"
];

const SearchSection = ({ onFilter, districts, serviceTypes }: SearchSectionProps) => {
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedService, setSelectedService] = useState("All service types");
  const [selectedUrgency, setSelectedUrgency] = useState("All urgency levels");

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    onFilter(district, selectedService, selectedUrgency);
  };

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    onFilter(selectedDistrict, service, selectedUrgency);
  };

  const handleUrgencyChange = (urgency: string) => {
    setSelectedUrgency(urgency);
    onFilter(selectedDistrict, selectedService, urgency);
  };

  const handleSearch = () => {
    onFilter(selectedDistrict, selectedService, selectedUrgency);
  };

  const handleClearFilters = () => {
    setSelectedDistrict("All Districts");
    setSelectedService("All service types");
    onFilter("All Districts", "All service types", "All urgency levels");
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

          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium text-foreground mb-2">
              Urgency Level
            </label>
            <Select value={selectedUrgency} onValueChange={handleUrgencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((urgency) => (
                  <SelectItem key={urgency} value={urgency}>
                    {urgency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {/* <Button onClick={handleSearch} className="bg-search-button hover:bg-search-button/90">
              <MapPin className="w-4 h-4 mr-2" />
              Search
            </Button> */}
            <Button 
              // variant="outline" 
              onClick={handleClearFilters}
              className="bg-search-button hover:bg-search-button/90"
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