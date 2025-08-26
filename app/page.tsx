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
  const [beneficiaryTypes, setBeneficiaryTypes] = useState<BeneficiaryType[]>([])
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
      const [dirRes, svcRes, distRes, benfRes] = await Promise.all([
        fetch('/api/directories'),
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
      results = results.filter(dir =>
        dir.locations?.some(loc => String(loc.districtId) === districtFilter)
      )
    }


    if (serviceTypeFilter) {
      results = results.filter(dir => dir.services.some((s) => String(s.service.id) === serviceTypeFilter))
    }

    setFiltered(results)
  }, [directories, debouncedQuery, districtFilter, serviceTypeFilter])

  const handleFilter = (
      district: string,
      sector: string,
      service: string,
      urgency: string
    ) => {
      let filtered = [...directories];

      if (district !== "All Districts") {

        filtered = filtered.filter(dir =>
          dir.locations?.some(loc => String(loc.district.name) === district)
        )

      }

      if (sector && sector !== "All Sectors") {
        filtered = filtered.filter(dir =>
          dir.locations?.some(loc => String(loc.sector.name) === sector)
        )
      }

      if (service && service !== "All service types") {
        filtered = filtered.filter(
          (dir) =>
            dir.services.some((s) => s.service.name === service) ||
            dir.otherServices?.toLowerCase().includes(service.toLowerCase())
        );
      }

      if (urgency && urgency !== "All Beneficiaries") {
        filtered = filtered.filter(dir =>
          dir.beneficiaries?.some(b => b.beneficiary.name === urgency)
        )
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
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filtered.length} child protection services
          </p>
        </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start auto-rows-max">
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
        

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
