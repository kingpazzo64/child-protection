"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { Directory, District, ServiceType } from "@/types";

type SearchSectionProps = {
  onFilter: (district: string, sector: string, service: string, urgency: string) => void;
  districts: { id: number; name: string }[];
  serviceTypes: { id: number; name: string }[];
  directories: Directory[];
};

const urgencyLevels = [
  "All Beneficiaries",
  "VICTIMS_OF_ABUSE_EXPLOITATION",
  "STREET_CHILDREN",
  "REFUGEE_CHILDREN",
  "CHILDREN_WITH_DISABILITIES",
  "EXTREME_POVERTY",
  "SEPARATED_OR_ABANDONED",
  "CHILDREN_IN_JUSTICE_SYSTEM",
  "HARMFUL_PRACTICES",
];

const SearchSection = ({ onFilter, districts, serviceTypes, directories }: SearchSectionProps) => {
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedService, setSelectedService] = useState("All service types");
  const [selectedUrgency, setSelectedUrgency] = useState("All Beneficiaries");
  const [sectors, setSectors] = useState<{ id: number; name: string }[]>([]);

  // Fetch sectors when district changes
  useEffect(() => {
    if (selectedDistrict === "All Districts") {
      setSectors([]);
      setSelectedSector("All Sectors");
      return;
    }

    const districtObj = districts.find((d) => d.name === selectedDistrict);
    if (!districtObj) return;

    fetch(`/api/sectors/${districtObj.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSectors(data);
        setSelectedSector("All Sectors"); // reset sector on district change
      })
      .catch(() => setSectors([]));
  }, [selectedDistrict, districts]);

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    onFilter(district, "All Sectors", selectedService, selectedUrgency);
  };

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    onFilter(selectedDistrict, sector, selectedService, selectedUrgency);
  };

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    onFilter(selectedDistrict, selectedSector, service, selectedUrgency);
  };

  const handleUrgencyChange = (urgency: string) => {
    setSelectedUrgency(urgency);
    onFilter(selectedDistrict, selectedSector, selectedService, urgency);
  };

  const handleClearFilters = () => {
    setSelectedDistrict("All Districts");
    setSelectedSector("All Sectors");
    setSelectedService("All service types");
    setSelectedUrgency("All Beneficiaries");
    setSectors([]);
    onFilter("All Districts", "All Sectors", "All service types", "All Beneficiaries");
  };

    // Get available districts based on current service filter
  const getAvailableDistricts = (): District[] => {
  // Filter directories based on selected service and urgency
  const filtered = directories.filter((item) =>
    (selectedService === "All service types" ||
      item.services.some((s) => s.service.name === selectedService) ||
      item.otherServices?.toLowerCase().includes(selectedService.toLowerCase())
    ) &&
    (selectedUrgency === "All Beneficiaries" || item.urgency === selectedUrgency.toUpperCase())
  );

  // Create a unique list of districts
  const uniqueDistrictMap = new Map<number, District>();
  filtered.forEach((item) => {
    if (!uniqueDistrictMap.has(item.district.id)) {
      uniqueDistrictMap.set(item.district.id, item.district);
    }
  });

  return Array.from(uniqueDistrictMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};


  const getAvailableServices = (): ServiceType[] => {
    const filtered = directories.filter((item) =>
      (selectedDistrict === "All Districts" || item.district.name === selectedDistrict) &&
      (selectedUrgency === "All Beneficiaries" || item.urgency === selectedUrgency.toUpperCase())
    );

    const uniqueServiceMap = new Map<number, ServiceType>();
    filtered.forEach((item) => {
      // Add all services linked to this directory
      item.services.forEach((s) => {
        if (!uniqueServiceMap.has(s.service.id)) {
          uniqueServiceMap.set(s.service.id, s.service);
        }
      });
    });

    return Array.from(uniqueServiceMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };


  return (
    <div className="bg-white shadow-sm border-b border-border p-4 md:p-6">
      <div className="container mx-auto px-2 md:px-4">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          CHILD PROTECTION SERVICES DIRECTORY
        </h1>

        {/* Search Instructions */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground text-sm md:text-base">
            Search and filter child protection services by <span className="font-medium text-primary">district</span>, <span className="font-medium text-primary">sector</span>, <span className="font-medium text-primary">service type</span>, and <span className="font-medium text-primary">type of beneficiaries</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-end justify-center">
          {/* District */}
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium text-foreground mb-2">District</label>
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

          {/* Sector */}
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium text-foreground mb-2">Sector</label>
            <Select
              value={selectedSector}
              onValueChange={handleSectorChange}
              disabled={sectors.length === 0}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Sectors">All Sectors</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service */}
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium text-foreground mb-2">Service Type</label>
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

          {/* Urgency */}
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium text-foreground mb-2">Type of Beneficiaries</label>
            <Select value={selectedUrgency} onValueChange={handleUrgencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleClearFilters} className="bg-search-button hover:bg-search-button/90">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Available Services and Districts Display - Only show when filters are applied */}
          <div className="grid grid-cols-12 gap-4 my-4">
            {/* Available Services */}
            
            {(selectedDistrict !== "All Districts" || selectedUrgency !== "All Beneficiaries") && (
              <div className="col-span-6">
                {getAvailableServices().length ? <h3 className="text-lg font-semibold text-blue-600 mb-3">Services in {selectedDistrict}</h3> : ''}
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
              {(selectedService !== "All service types" || selectedUrgency !== "All Beneficiaries") && (
                <div className="col-span-6">
                  {getAvailableDistricts().length ? (
                    <h3 className="text-lg font-semibold text-green-600 mb-3">
                      Districts with {selectedService}
                    </h3>
                  ) : null}
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
  );
};

export default SearchSection;
