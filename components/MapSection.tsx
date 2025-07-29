"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { servicesData } from '@/data/services';

interface MapSectionProps {
  hoveredServiceId?: string | null;
}

const MapSection = ({ hoveredServiceId }: MapSectionProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const [mapboxToken, setMapboxToken] = useState('pk.eyJ1IjoiZnVrdW50YSIsImEiOiJjbWRjNmhhOWMwd2EzMmpzNnE0OTh1eGczIn0.Lgh7q_ARKrFLyWFyLzfTYw');
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Service locations in Rwanda with IDs matching the services
  const serviceLocations = [
    { id: "1", name: "Central Family Support Center", coordinates: [-1.9441, 30.0619], district: "Kigali" },
    { id: "2", name: "Child Advocacy Network", coordinates: [-1.9706, 30.1044], district: "Kigali" },
    { id: "3", name: "Safe Haven Crisis Center", coordinates: [-2.5958, 29.7394], district: "Huye" },
    { id: "4", name: "Youth Protection Services", coordinates: [-1.4996, 29.6341], district: "Musanze" },
    { id: "5", name: "Community Child Welfare", coordinates: [-1.6778, 29.2667], district: "Rubavu" },
    { id: "6", name: "Therapeutic Family Center", coordinates: [-1.9736, 30.4264], district: "Kayonza" },
    { id: "7", name: "Rural Child Protection Unit", coordinates: [-1.2939, 30.3267], district: "Nyagatare" },
    { id: "8", name: "Integrated Child Services", coordinates: [-2.0850, 29.7467], district: "Muhanga" },
    { id: "9", name: "Children's Justice Center", coordinates: [-1.9667, 30.1333], district: "Kicukiro" },
    { id: "10", name: "Special Needs Support Center", coordinates: [-2.6686, 29.6236], district: "Gisagara" },
    { id: "11", name: "Child Rehabilitation Center", coordinates: [-1.4667, 29.8167], district: "Burera" },
    { id: "12", name: "Educational Support Network", coordinates: [-2.3167, 29.7500], district: "Nyanza" },
  ];

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [30.0619, -1.9441], // Center on Rwanda
      zoom: 8
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on('load', () => {
      // Add service location markers
      serviceLocations.forEach((location, index) => {
        // Find matching service data
        const serviceData = servicesData.find(service => service.id.toString() === location.id);
        
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.setAttribute('data-service-id', location.id);
        markerElement.innerHTML = `
          <div style="
            width: 24px; 
            height: 24px; 
            background-color: #dc2626; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
            cursor: pointer;
          ">
            <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `;

        // Create popup with service info
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: false,
          closeOnClick: false
        }).setHTML(`
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="margin: 0 0 6px 0; font-weight: bold; color: #1f2937; font-size: 16px;">${serviceData?.name || location.name}</h3>
            <p style="margin: 0 0 4px 0; color: #059669; font-weight: 600; font-size: 14px;">${serviceData?.mainService || 'Service Available'}</p>
            <p style="margin: 0; color: #6b7280; font-size: 12px;">${location.district} District</p>
          </div>
        `);

        // Add click event listener to marker
        markerElement.addEventListener('click', () => {
          // Close all other popups first
          popupsRef.current.forEach(p => {
            if (p.isOpen()) {
              p.remove();
            }
          });
          
          // Show popup for clicked marker
          popup.setLngLat([location.coordinates[1], location.coordinates[0]]).addTo(map.current!);
        });

        // Add marker to map and store references
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([location.coordinates[1], location.coordinates[0]])
          .addTo(map.current!);
        
        markersRef.current.push(marker);
        popupsRef.current.push(popup);
      });
    });
  };

  // Initialize map on component mount
  useEffect(() => {
    if (mapboxToken) {
      initializeMap(mapboxToken);
    }
  }, [mapboxToken]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      initializeMap(mapboxToken.trim());
    }
  };

  // Handle hover effect on pins with popup display
  useEffect(() => {
    if (!map.current) return;

    const markers = document.querySelectorAll('.marker');
    
    // Close all popups first
    popupsRef.current.forEach(popup => {
      if (popup.isOpen()) {
        popup.remove();
      }
    });

    markers.forEach((marker, index) => {
      const serviceId = marker.getAttribute('data-service-id');
      const pinElement = marker.querySelector('div') as HTMLElement;
      
      if (hoveredServiceId === serviceId) {
        // Highlight the pin
        if (pinElement) {
          pinElement.style.backgroundColor = '#ea580c';
          pinElement.style.transform = 'scale(1.2)';
          pinElement.style.zIndex = '1000';
        }
        
        // Show popup for the hovered service
        const correspondingMarker = markersRef.current[index];
        const correspondingPopup = popupsRef.current[index];
        if (correspondingMarker && correspondingPopup) {
          correspondingPopup.setLngLat(correspondingMarker.getLngLat()).addTo(map.current!);
        }
      } else {
        // Reset the pin
        if (pinElement) {
          pinElement.style.backgroundColor = '#dc2626';
          pinElement.style.transform = 'scale(1)';
          pinElement.style.zIndex = 'auto';
        }
      }
    });
  }, [hoveredServiceId]);

  return (
    <div className="h-full bg-white border-l border-border">
      {showTokenInput ? (
        <div className="h-full flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-sm">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Service Map
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter Mapbox token to view locations
            </p>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Mapbox token..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="w-full text-sm"
              />
              <Button onClick={handleTokenSubmit} className="w-full" size="sm">
                Load Map
              </Button>
              <p className="text-xs text-muted-foreground">
                Get token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              Service Locations
            </h3>
            <p className="text-sm text-muted-foreground">
              Hover over services to view details
            </p>
          </div>
          <div ref={mapContainer} className="h-[calc(100%-80px)]" />
        </div>
      )}
    </div>
  );
};

export default MapSection;