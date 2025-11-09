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
import { Directory, District, ServiceType, BeneficiaryType } from "@/types";
import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

type SearchSectionProps = {
  onFilter: (district: string, sector: string, service: string, beneficiary: string, providerName: string) => void;
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
  const { t, language } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState(t.search.allDistricts);
  const [selectedSector, setSelectedSector] = useState(t.search.allSectors);
  const [selectedService, setSelectedService] = useState(t.search.allServiceTypes);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(t.search.allBeneficiaries);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [providerName, setProviderName] = useState("");
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isDistrictsOpen, setIsDistrictsOpen] = useState(false);

  // Update state when language changes - only update "All" options, preserve actual selections
  useEffect(() => {
    // Check if current selections are "All" options (they might be in the old language)
    // Only update if the selection matches an "All" option (either old or new language)
    const allDistrictsOptions = ['All Districts', 'Intara Zose', t.search.allDistricts];
    const allSectorsOptions = ['All Sectors', 'Uturere Twose', t.search.allSectors];
    const allServiceTypesOptions = ['All service types', 'Ubwoko bwose bw\'inshingano', t.search.allServiceTypes];
    const allBeneficiariesOptions = ['All Beneficiaries', 'Abatsindiye Bose', t.search.allBeneficiaries];
    
    if (allDistrictsOptions.includes(selectedDistrict)) {
      setSelectedDistrict(t.search.allDistricts);
    }
    if (allSectorsOptions.includes(selectedSector)) {
      setSelectedSector(t.search.allSectors);
    }
    if (allServiceTypesOptions.includes(selectedService)) {
      setSelectedService(t.search.allServiceTypes);
    }
    if (allBeneficiariesOptions.includes(selectedBeneficiary)) {
      setSelectedBeneficiary(t.search.allBeneficiaries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

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
    onFilter(district, t.search.allSectors, selectedService, selectedBeneficiary, providerName);
  };
  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    onFilter(selectedDistrict, sector, selectedService, selectedBeneficiary, providerName);
  };
  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    onFilter(selectedDistrict, selectedSector, service, selectedBeneficiary, providerName);
  };
  const handleBeneficiaryChange = (beneficiary: string) => {
    setSelectedBeneficiary(beneficiary);
    onFilter(selectedDistrict, selectedSector, selectedService, beneficiary, providerName);
  };
  const handleProviderNameChange = (name: string) => {
    setProviderName(name);
    onFilter(selectedDistrict, selectedSector, selectedService, selectedBeneficiary, name);
  };


  const handleClearFilters = () => {
    setSelectedDistrict(t.search.allDistricts);
    setSelectedSector(t.search.allSectors);
    setSelectedService(t.search.allServiceTypes);
    setSelectedBeneficiary(t.search.allBeneficiaries);
    setProviderName("");
    onFilter(t.search.allDistricts, t.search.allSectors, t.search.allServiceTypes, t.search.allBeneficiaries, "");
  };

  // Available districts based on selected service and beneficiary filter
  const getAvailableDistricts = (): District[] => {
    const filtered = directories.filter(dir =>
      (selectedService === t.search.allServiceTypes ||
        dir.services?.some(s => s.service.name === selectedService) ||
        dir.otherServices?.toLowerCase().includes(selectedService.toLowerCase())
      ) &&
      (selectedBeneficiary === t.search.allBeneficiaries ||
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
      (selectedDistrict === t.search.allDistricts || dir.locations?.some(loc => loc.district.name === selectedDistrict)) &&
      (selectedBeneficiary === t.search.allBeneficiaries || dir.beneficiaries?.some(b => b.beneficiary.name === selectedBeneficiary))
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
        <h1 className="text-3xl font-bold text-center text-primary mb-4">
          {t.search.title}
        </h1>
        
        {/* Search Instructions */}
        {/* <div className="text-center mb-6">
          <p className="text-muted-foreground text-sm md:text-base">
            Search and filter child protection services by <span className="font-medium text-primary">district</span>, <span className="font-medium text-primary">service type</span>, and <span className="font-medium text-primary">type of beneficiaries</span>
          </p>
        </div> */}

        <div className="mb-6 w-full max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder={t.search.providerNamePlaceholder}
            value={providerName}
            onChange={(e) => handleProviderNameChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-end justify-center">
          {/* District */}
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium mb-2">{t.search.district}</label>
            <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={t.search.allDistricts}>{t.search.allDistricts}</SelectItem>
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
            <label className="block text-sm font-medium mb-2">{t.search.serviceType}</label>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={t.search.allServiceTypes}>{t.search.allServiceTypes}</SelectItem>
                {serviceTypes.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Beneficiary Type */}
          <div className="min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium mb-2">{t.search.typeOfBeneficiaries}</label>
            <Select value={selectedBeneficiary} onValueChange={handleBeneficiaryChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={t.search.allBeneficiaries}>{t.search.allBeneficiaries}</SelectItem>
                {beneficiaryTypes.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleClearFilters}><RotateCcw className="w-4 h-4 mr-2" />{t.search.clearFilters}</Button>
          </div>

          
        </div>
      </div>

      {/* Available Services and Districts - Compact Links */}
      <div className="container mx-auto px-2 md:px-4 mt-2">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Available Services Link */}
          {(selectedDistrict !== t.search.allDistricts || selectedBeneficiary !== t.search.allBeneficiaries) && getAvailableServices().length > 0 && (
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-primary hover:text-primary/80 underline font-medium cursor-pointer"
              >
                {t.search.availableServices} ({getAvailableServices().length})
              </button>
              {isServicesOpen && (
                <div className="inline-flex flex-wrap gap-2 ml-2">
                  {getAvailableServices().map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        handleServiceChange(service.name)
                        setIsServicesOpen(false)
                      }}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Available Districts Link */}
          {(selectedService !== t.search.allServiceTypes || selectedBeneficiary !== t.search.allBeneficiaries) && getAvailableDistricts().length > 0 && (
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => setIsDistrictsOpen(!isDistrictsOpen)}
                className="text-primary hover:text-primary/80 underline font-medium cursor-pointer"
              >
                {t.search.availableDistricts} ({getAvailableDistricts().length})
              </button>
              {isDistrictsOpen && (
                <div className="inline-flex flex-wrap gap-2 ml-2">
                  {getAvailableDistricts().map((district) => (
                    <button
                      key={district.id}
                      onClick={() => {
                        handleDistrictChange(district.name)
                        setIsDistrictsOpen(false)
                      }}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                    >
                      {district.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default SearchSection;
