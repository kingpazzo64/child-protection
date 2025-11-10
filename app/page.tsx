"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import ServiceCard from "@/components/ServiceCard";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Directory, District, ServiceType, BeneficiaryType } from '@/types'
import { servicesData, Service } from "@/data/services";
import "./custom.css";
import { toast } from 'react-hot-toast'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const [filteredServices, setFilteredServices] = useState<Service[]>(servicesData);
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  const [directories, setDirectories] = useState<Directory[]>([])
  const [filtered, setFiltered] = useState<Directory[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [beneficiaryTypes, setBeneficiaryTypes] = useState<BeneficiaryType[]>([])
const [currentFilters, setCurrentFilters] = useState<{
    district: string;
    sector: string;
    service: string;
    beneficiary: string;
    providerName: string;
  }>({
    district: t.search.allDistricts,
    sector: t.search.allSectors,
    service: t.search.allServiceTypes,
    beneficiary: t.search.allBeneficiaries,
    providerName: ""
  })

    useEffect(() => {
      fetchData()
    }, [])

    const fetchData = async () => {
    setLoading(true)
    try {
      // Use public endpoint to always get all directories regardless of authentication
      const [dirRes, svcRes, distRes, benfRes] = await Promise.all([
        fetch('/api/public/directories'),
        fetch('/api/service-types'),
        fetch('/api/districts'),
        fetch('/api/beneficiary-types'),
      ])

      const dirJson = await dirRes.json()
      const svcJson = await svcRes.json()
      const distJson = await distRes.json()
      const beneJson = await benfRes.json()

      setDirectories(dirJson.directories)
      setServiceTypes(svcJson.types)
      setDistricts(distJson)
      setBeneficiaryTypes(beneJson.types)
      // Initialize filtered with all directories
      setFiltered(dirJson.directories)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (
      district: string,
      sector: string,
      service: string,
      urgency: string,
      providerName: string
    ) => {
      // Store current filter values
      setCurrentFilters({
        district,
        sector,
        service,
        beneficiary: urgency,
        providerName
      });

      // Track directory search event (only if filters are applied)
      const hasFilters = 
        district !== t.search.allDistricts ||
        sector !== t.search.allSectors ||
        service !== t.search.allServiceTypes ||
        urgency !== t.search.allBeneficiaries ||
        (providerName && providerName.trim() !== "");

      if (hasFilters) {
        import('@/lib/analytics-client').then(({ trackEvent }) => {
          trackEvent('directory_search', {
            district: district !== t.search.allDistricts ? district : undefined,
            serviceType: service !== t.search.allServiceTypes ? service : undefined,
            beneficiaryType: urgency !== t.search.allBeneficiaries ? urgency : undefined,
            providerName: providerName && providerName.trim() !== "" ? providerName : undefined,
          });
        }).catch(() => {
          // Silently fail if tracking fails
        });
      }

      let filtered = [...directories];

      if (district !== t.search.allDistricts) {

        filtered = filtered.filter(dir =>
          dir.locations?.some(loc => String(loc.district.name) === district)
        )

      }

      if (sector && sector !== t.search.allSectors) {
        filtered = filtered.filter(dir =>
          dir.locations?.some(loc => String(loc.sector.name) === sector)
        )
      }

      if (service && service !== t.search.allServiceTypes) {
        filtered = filtered.filter(
          (dir) =>
            dir.services.some((s) => s.service.name === service) ||
            dir.otherServices?.toLowerCase().includes(service.toLowerCase())
        );
      }

      if (urgency && urgency !== t.search.allBeneficiaries) {
        filtered = filtered.filter(dir =>
          dir.beneficiaries?.some(b => b.beneficiary.name === urgency)
        )
      }

      if (providerName && providerName.trim() !== "") {
        const query = providerName.toLowerCase();
        filtered = filtered.filter(dir =>
          dir.nameOfOrganization.toLowerCase().includes(query) ||
          dir.email?.toLowerCase().includes(query) ||
          dir.phone?.toLowerCase().includes(query)
        );
      }

      setFiltered(filtered);
    };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchSection
        onFilter={handleFilter}
        districts={districts}
        serviceTypes={serviceTypes}
        beneficiaryTypes={beneficiaryTypes}
        directories={directories}
      />
      
      <div className="p-4 md:p-6">
        {loading && (
          <div className="mb-6 flex items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-primary font-medium animate-pulse">
                {t.mainPage.loading}
              </p>
            </div>
          </div>
        )}
        {!loading && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {t.mainPage.showingServices} {filtered.length} {t.mainPage.services}
            </p>
          </div>
        )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start auto-rows-max">
              {loading ? (
                <>
                  {[...Array(6)].map((_, index) => (
                    <Card 
                      key={index} 
                      className="border-l-4 border-l-primary shadow-lg"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 text-left space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <div className="flex flex-wrap gap-2">
                              <Skeleton className="h-5 w-20 rounded-full" />
                              <Skeleton className="h-5 w-24 rounded-full" />
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-12 rounded-full" />
                            <Skeleton className="h-4 w-4 rounded" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-5 w-28 rounded-full" />
                            <Skeleton className="h-5 w-32 rounded-full" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-4/5" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-border">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : filtered.length > 0 ? (
                filtered.map((directory) => (
                  <div
                    key={directory.id}
                    onMouseEnter={() => setHoveredServiceId(directory.id.toString())}
                    onMouseLeave={() => setHoveredServiceId(null)}
                  >
                    <ServiceCard directory={directory} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground mb-2">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.7-2.6L12 4.5l5.7 7.9A7.962 7.962 0 0112 15z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">{t.mainPage.noServicesFound}</h3>
                  {(() => {
                    const hasActiveFilters = 
                      (currentFilters.providerName && currentFilters.providerName.trim() !== "") ||
                      currentFilters.district !== t.search.allDistricts ||
                      currentFilters.service !== t.search.allServiceTypes ||
                      currentFilters.beneficiary !== t.search.allBeneficiaries ||
                      currentFilters.sector !== t.search.allSectors;
                    
                    if (hasActiveFilters) {
                      return (
                        <div className="text-muted-foreground mb-4">
                          <p className="mb-3">
                            {t.mainPage.noServicesFound}
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center items-center mb-4">
                            {currentFilters.providerName && currentFilters.providerName.trim() !== "" && (
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                {t.search.providerName}: &quot;{currentFilters.providerName}&quot;
                              </span>
                            )}
                            {currentFilters.district !== t.search.allDistricts && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {t.search.district}: {currentFilters.district}
                              </span>
                            )}
                            {currentFilters.service !== t.search.allServiceTypes && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                {t.search.serviceType}: {currentFilters.service}
                              </span>
                            )}
                            {currentFilters.beneficiary !== t.search.allBeneficiaries && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                {t.search.typeOfBeneficiaries}: {currentFilters.beneficiary}
                              </span>
                            )}
                            {currentFilters.sector !== t.search.allSectors && (
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                {t.search.sector}: {currentFilters.sector}
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {t.mainPage.tryAdjustingSearch}
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <p className="text-muted-foreground">
                          {t.mainPage.noServicesAvailable}
                        </p>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          </div>
        

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
