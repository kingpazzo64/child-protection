"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Filter, RotateCcw } from "lucide-react";
import { Directory, District, ServiceType } from "@/types";

type SearchSectionProps = {
  onFilter: (district: string, service: string, urgency: string) => void;
  districts: { id: number; name: string }[];
  serviceTypes: { id: number; name: string }[];
  directories:Directory[]
};

const urgencyLevels = [
  "All urgency levels", "Low", "Medium", "High", "Critical"
];

const SearchSection = ({ onFilter, districts, serviceTypes, directories }: SearchSectionProps) => {
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

  // Get available districts based on current service filter
  const getAvailableDistricts = ():District[] => {
    if (selectedService === "All service types") {
      return districts;
    }
    const availableDistricts = new Set(
      directories
        .filter(service => String(service.serviceTypeId) === selectedService)
        .map(service => service.district)
    );
    return [...Array.from(availableDistricts).sort()];
  };

  // Get available services based on current district filter
  const getAvailableServices = ():ServiceType[] => {
    if (selectedDistrict === "All Districts") {
      return serviceTypes;
    }
    const availableServices = new Set(
      directories
        .filter(service => String(service.districtId) === selectedDistrict)
        .map(service => service.serviceType)
    );
    return [...Array.from(availableServices).sort()];
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
        
        {/* Available Services and Districts Display - Only show when filters are applied */}
          <div className="grid grid-cols-12 gap-4 mb-8">
            {/* Available Services */}
            {getAvailableServices().length > 1 && (selectedDistrict !== "All Districts" || selectedUrgency !== "All urgency levels") && (
              <div className="col-span-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">Available Services</h3>
                <div className="flex flex-wrap gap-2">
                  {getAvailableServices().map((service) => (
                    <span 
                      key={service.id} 
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => handleServiceChange(service.name)}
                    >
                      {service.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Available Districts */}
            {getAvailableDistricts().length > 1 && (selectedService !== "All service types" || selectedUrgency !== "All urgency levels") && (
              <div className="col-span-6">
                <h3 className="text-lg font-semibold text-green-600 mb-3">Available Districts</h3>
                <div className="flex flex-wrap gap-2">
                  {getAvailableDistricts().map((district) => (
                    <span 
                      key={district.id} 
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm cursor-pointer hover:bg-green-200 transition-colors"
                      onClick={() => handleDistrictChange(district.name)}
                    >
                      {district.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default SearchSection;