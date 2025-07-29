"use client";

import { useState } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import MapSection from "@/components/MapSection";
import ServiceCard from "@/components/ServiceCard";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { servicesData, Service } from "@/data/services";

const Index = () => {
  const [filteredServices, setFilteredServices] = useState<Service[]>(servicesData);
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  const handleFilter = (district: string, service: string) => {
    let filtered = servicesData;

    if (district !== "All Districts") {
      filtered = filtered.filter(s => s.district === district);
    }

    if (service !== "All service types") {
      filtered = filtered.filter(s => 
        s.mainService === service || s.services.includes(service)
      );
    }

    setFilteredServices(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchSection onFilter={handleFilter} />
      
      {/* Mobile-first responsive layout */}
      <div className="block md:flex md:h-[calc(100vh-200px)]">
        {/* Map Section - Mobile: top, scrollable. Desktop: right side, sticky */}
        <div className="h-[400px] md:w-[40%] md:sticky md:top-0 md:h-full md:order-2">
          <MapSection hoveredServiceId={hoveredServiceId} />
        </div>

        {/* Services Section - Mobile: bottom. Desktop: left side, scrollable */}
        <div className="md:w-[60%] md:overflow-y-auto md:order-1">
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredServices.length} child protection services
              </p>
            </div>
            
            <div className="space-y-4">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onMouseEnter={() => setHoveredServiceId(service.id.toString())}
                    onMouseLeave={() => setHoveredServiceId(null)}
                  >
                    <ServiceCard
                      name={service.name}
                      mainService={service.mainService}
                      category={service.category}
                      description={service.description}
                      address={service.address}
                      phone={service.phone}
                      email={service.email}
                      services={service.services}
                      verified={service.verified}
                      rating={service.rating}
                    />
                  </div>
                ))
              ) : (
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
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
