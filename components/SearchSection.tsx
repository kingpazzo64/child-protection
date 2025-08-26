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
import { Directory, District, ServiceType, BeneficiaryType } from "@/types";

type SearchSectionProps = {
  onFilter: (district: string, sector: string, service: string, beneficiary: string) => void;
  districts: District[];
  serviceTypes: ServiceType[];
  beneficiaryTypes: BeneficiaryType[];
  directories: Directory[];
};

const urgencyLevels = [
  {CP_SURVIVOR: 'Survivor of CP violence/abuse (non gender based violence)'},
  {STREET_CONNECTED: 'Street-connected children'},
  {REFUGEE: 'Refugee children'},
  {ASYLUM_SEEKER: 'Asylum seeker children'},
  {DISABLED: 'Children with disabilities'},
  {UNACCOMPANIED_SEPARATED: 'Unaccompanied and separated children'},
  {IN_CONFLICT_WITH_LAW: 'Children in conflict with law'},
  {GBV_SURVIVOR: 'GBV survivor (gender based violence, early pregnancies...)'},
];

const SearchSection = ({
  onFilter,
  districts,
  serviceTypes,
  beneficiaryTypes,
  directories
}: SearchSectionProps) => {
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedService, setSelectedService] = useState("All service types");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("All Beneficiaries");
  // const [sectors, setSectors] = useState<District["sectors"]>([]);

  // useEffect(() => {
  //   if (selectedDistrict === "All Districts") {
  //     setSectors([]);
  //     setSelectedSector("All Sectors");
  //     return;
  //   }
  //   const districtObj = districts.find(d => d.name === selectedDistrict);
  //   if (!districtObj) return;

  //   fetch(`/api/sectors/${districtObj.id}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setSectors(data);
  //       setSelectedSector("All Sectors");
  //     })
  //     .catch(() => setSectors([]));
  // }, [selectedDistrict, districts]);

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    onFilter(district, "All Sectors", selectedService, selectedBeneficiary);
  };
  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    onFilter(selectedDistrict, sector, selectedService, selectedBeneficiary);
  };
  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    onFilter(selectedDistrict, selectedSector, service, selectedBeneficiary);
  };
  const handleBeneficiaryChange = (beneficiary: string) => {
    setSelectedBeneficiary(beneficiary);
    onFilter(selectedDistrict, selectedSector, selectedService, beneficiary);
  };
  const handleClearFilters = () => {
    setSelectedDistrict("All Districts");
    setSelectedSector("All Sectors");
    setSelectedService("All service types");
    setSelectedBeneficiary("All Beneficiaries");
    // setSectors([]);
    onFilter("All Districts", "All Sectors", "All service types", "All Beneficiaries");
  };

  // Available districts based on selected service and beneficiary filter
  const getAvailableDistricts = (): District[] => {
    const filtered = directories.filter(dir =>
      (selectedService === "All service types" ||
        dir.services?.some(s => s.service.name === selectedService) ||
        dir.otherServices?.toLowerCase().includes(selectedService.toLowerCase())
      ) &&
      (selectedBeneficiary === "All Beneficiaries" ||
        dir.beneficiaries?.some(b => b.beneficiary.name === selectedBeneficiary))
    );

    const uniqueDistrictMap = new Map<number, District>();
    filtered.forEach(dir => {
      dir.locations?.forEach(loc => {
        if (!uniqueDistrictMap.has(loc.district.id)) {
          uniqueDistrictMap.set(loc.district.id, loc.district);
        }
      });
    });

    return Array.from(uniqueDistrictMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const getAvailableServices = (): ServiceType[] => {
    const filtered = directories.filter(dir =>
      (selectedDistrict === "All Districts" || dir.locations?.some(loc => loc.district.name === selectedDistrict)) &&
      (selectedBeneficiary === "All Beneficiaries" || dir.beneficiaries?.some(b => b.beneficiary.name === selectedBeneficiary))
    );

    const uniqueServiceMap = new Map<number, ServiceType>();
    filtered.forEach(dir => {
      dir.services?.forEach(s => {
        if (!uniqueServiceMap.has(s.service.id)) uniqueServiceMap.set(s.service.id, s.service);
      });
    });

    return Array.from(uniqueServiceMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <div className="bg-white shadow-sm border-b border-border p-4 md:p-6">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex flex-wrap gap-4 items-end justify-center">
          {/* District */}
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium mb-2">District</label>
            <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Districts">All Districts</SelectItem>
                {districts.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Sector
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Sector</label>
            <Select value={selectedSector} onValueChange={handleSectorChange} disabled={sectors.length === 0}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Sectors">All Sectors</SelectItem>
                {sectors.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div> */}

          {/* Service */}
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Service Type</label>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All service types">All service types</SelectItem>
                {serviceTypes.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Beneficiary Type */}
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Type of Beneficiaries</label>
            <Select value={selectedBeneficiary} onValueChange={handleBeneficiaryChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Beneficiaries">All Beneficiaries</SelectItem>
                {beneficiaryTypes.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleClearFilters}><RotateCcw className="w-4 h-4 mr-2" />Clear Filters</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 my-4">
            {/* Available Services */}
            
            {(selectedDistrict !== "All Districts" || selectedBeneficiary !== "All Beneficiaries") && (
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
              {(selectedService !== "All service types" || selectedBeneficiary !== "All Beneficiaries") && (
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
