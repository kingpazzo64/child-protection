"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import MapSection from "@/components/MapSection";
import ServiceCard from "@/components/ServiceCard";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Directory, District, ServiceType } from '@/types'
import { servicesData, Service } from "@/data/services";
import "./custom.css";
import { toast } from 'react-hot-toast'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}


const Index = () => {
  const [filteredServices, setFilteredServices] = useState<Service[]>(servicesData);
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  const [directories, setDirectories] = useState<Directory[]>([])
  const [filtered, setFiltered] = useState<Directory[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [districtFilter, setDistrictFilter] = useState('')
  const [serviceTypeFilter, setServiceTypeFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const debouncedQuery = useDebounce(searchQuery, 300)

    useEffect(() => {
      fetchData()
    }, [])

    const fetchData = async () => {
    setLoading(true)
    try {
      const [dirRes, svcRes, distRes] = await Promise.all([
        fetch('/api/directories'),
        fetch('/api/service-types'),
        fetch('/api/districts'),
      ])

      const dirJson = await dirRes.json()
      const svcJson = await svcRes.json()
      const distJson = await distRes.json()

      setDirectories(dirJson.directories)
      setServiceTypes(svcJson.types)
      setDistricts(distJson)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let results = [...directories]

    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase()
      results = results.filter(dir =>
        dir.nameOfOrganization.toLowerCase().includes(query) ||
        dir.email.toLowerCase().includes(query) ||
        dir.phone.toLowerCase().includes(query)
      )
    }

    if (districtFilter) {
      results = results.filter(dir => String(dir.districtId) === districtFilter)
    }

    if (serviceTypeFilter) {
      results = results.filter(dir => String(dir.serviceTypeId) === serviceTypeFilter)
    }

    setFiltered(results)
  }, [directories, debouncedQuery, districtFilter, serviceTypeFilter])

  const handleFilter = (district: string, service: string, urgency: string) => {
    let filtered = [...directories]

    if (district !== "All Districts") {
      filtered = filtered.filter(s => s.district.name === district);
    }

    if (service !== "All service types") {
      filtered = filtered.filter(s => 
        s.serviceType.name === service || s.otherServices?.toLowerCase().includes(service)
      );
    }

    if (urgency !== "All urgency levels") {
      filtered = filtered.filter(s => s.urgency === urgency.toUpperCase());
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
        directories={directories}
      />
      
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-200px)]">
        {/* Services Section - Mobile: top. Desktop: left side, scrollable */}
        <div className="order-1 md:w-[60%] md:overflow-y-auto">
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filtered.length} child protection services
              </p>
            </div>
            
            <div className="space-y-4">
              {filtered.length > 0 ? (
                filtered.map((directory) => (
                  <div
                    key={directory.id}
                    onMouseEnter={() => setHoveredServiceId(directory.id.toString())}
                    onMouseLeave={() => setHoveredServiceId(null)}
                  >
                    <ServiceCard directory={directory} />
                  </div>
                ))
              ): (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-2">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.7-2.6L12 4.5l5.7 7.9A7.962 7.962 0 0112 15z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">No services found</h3>
                  <p className="text-muted-foreground">
                    No child protection services match your current filters. Try adjusting your search criteria or clear filters to see all available services.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Section - Mobile: bottom. Desktop: right side, sticky */}
        <div className="order-2 h-[400px] md:w-[40%] md:sticky md:top-0 md:h-full">
          <MapSection hoveredServiceId={hoveredServiceId}  directories={filtered} />
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchSection
        onFilter={handleFilter}
        districts={districts}
        serviceTypes={serviceTypes}
        directories={directories}
      />
      
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-200px)]">
        {/* Services Section - Mobile: top. Desktop: left side, scrollable */}
        <div className="order-1 md:w-[60%] md:overflow-y-auto">
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filtered.length} child protection services
              </p>
            </div>
            
            <div className="space-y-4">
              {filtered.length > 0 ? (
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
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-2">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.7-2.6L12 4.5l5.7 7.9A7.962 7.962 0 0112 15z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">No directory found</h3>
                  <p className="text-muted-foreground">
                    No child protection services match your current filters. Try adjusting your search criteria or clear filters to see all available services.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Section - Mobile: bottom. Desktop: right side, sticky */}
        <div className="order-2 h-[400px] md:w-[40%] md:sticky md:top-0 md:h-full">
          <MapSection hoveredServiceId={hoveredServiceId} directories={directories} />
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
