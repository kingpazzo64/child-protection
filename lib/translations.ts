// lib/translations.ts
export type Language = 'en' | 'rw';

export interface Translations {
  // Header
  header: {
    english: string;
    kinyarwanda: string;
  };
  
  // Search Section
  search: {
    searchPlaceholder: string;
    allDistricts: string;
    allSectors: string;
    allServiceTypes: string;
    allBeneficiaries: string;
    providerName: string;
    providerNamePlaceholder: string;
    clearFilters: string;
    filterBy: string;
    expandSearch: string;
    district: string;
    sector: string;
    serviceType: string;
    typeOfBeneficiaries: string;
    servicesIn: string;
    districtsWith: string;
    title: string;
    availableServices: string;
    availableDistricts: string;
    show: string;
    hide: string;
    expand: string;
    collapse: string;
  };
  
  // Service Card
  serviceCard: {
    services: string;
    beneficiaries: string;
    beneficiariesLabel: string;
    location: string;
    locations: string;
    contact: string;
    phone: string;
    email: string;
    website: string;
    share: string;
    copied: string;
    reportIncorrect: string;
    paid: string;
    free: string;
    viewDetails: string;
    hideDetails: string;
    otherServices: string;
    shareSuccess: string;
    shareError: string;
    linkCopied: string;
    shareTitle: string;
    foundVia: string;
  };
  
  // Footer
  footer: {
    custodian: string;
    custodianDescription: string;
    copyright: string;
    serviceDistricts: string;
    availableServices: string;
  };
  
  // Main Page
  mainPage: {
    title: string;
    noServicesFound: string;
    showingServices: string;
    services: string;
    tryAdjustingSearch: string;
    noServicesAvailable: string;
    loading: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      english: 'English',
      kinyarwanda: 'Kinyarwanda',
    },
    search: {
      searchPlaceholder: 'Search by provider name, email, or phone...',
      allDistricts: 'All Districts',
      allSectors: 'All Sectors',
      allServiceTypes: 'All service types',
      allBeneficiaries: 'All Beneficiaries',
      providerName: 'Provider Name',
      providerNamePlaceholder: 'Search by provider name...',
      clearFilters: 'Clear Filters',
      filterBy: 'Filter by',
      expandSearch: 'Expand Search',
      district: 'District',
      sector: 'Sector',
      serviceType: 'Service Type',
      typeOfBeneficiaries: 'Type of Beneficiaries',
      servicesIn: 'Services in',
      districtsWith: 'Districts with',
      title: 'CHILD PROTECTION SERVICES DIRECTORY',
      availableServices: 'Available Services',
      availableDistricts: 'Available Districts',
      show: 'Show',
      hide: 'Hide',
      expand: 'Expand',
      collapse: 'Collapse',
    },
    serviceCard: {
      services: 'Services',
      beneficiaries: 'Beneficiaries',
      beneficiariesLabel: 'Beneficiaries:',
      location: 'Location',
      locations: 'Locations:',
      contact: 'Contact',
      phone: 'Phone',
      email: 'Email',
      website: 'Website',
      share: 'Share',
      copied: 'Copied!',
      reportIncorrect: 'Report Incorrect',
      paid: 'PAID',
      free: 'FREE',
      viewDetails: 'View Details',
      hideDetails: 'Hide Details',
      otherServices: 'Other Services:',
      shareSuccess: 'Shared successfully!',
      shareError: 'Failed to share. Please try again.',
      linkCopied: 'Link copied to clipboard!',
      shareTitle: 'Child Protection Service',
      foundVia: 'Found via Child Protection Services Directory',
    },
    footer: {
      custodian: 'Custodian',
      custodianDescription: 'MIGEPROF/NCDA serves as the national owner and coordinator of the Child Protection Services Directory.',
      copyright: '© 2024 National Child Development Agency (NCDA). All rights reserved.',
      serviceDistricts: 'Service Districts',
      availableServices: 'Available Services',
    },
    mainPage: {
      title: 'Child Protection Services Directory',
      noServicesFound: 'No services found',
      showingServices: 'Showing',
      services: 'services',
      tryAdjustingSearch: 'Try adjusting your search criteria or clear filters to see all available services.',
      noServicesAvailable: 'No child protection services are currently available.',
      loading: 'Loading services...',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
    },
  },
  rw: {
    header: {
      english: 'Icyongereza',
      kinyarwanda: 'Ikinyarwanda',
    },
    search: {
      searchPlaceholder: 'Shakisha ku izina, imeyili, cyangwa telefoni...',
      allDistricts: 'Intara Zose',
      allSectors: 'Uturere Twose',
      allServiceTypes: 'Ubwoko bwose bw\'inshingano',
      allBeneficiaries: 'Abatsindiye Bose',
      providerName: 'Izina ry\'Umuyobora',
      providerNamePlaceholder: 'Shakisha ku izina ry\'umuyobora...',
      clearFilters: 'Siba Amashyirahamwe',
      filterBy: 'Shyirahamwe',
      expandSearch: 'Kongeraho Gushaka',
      district: 'Intara',
      sector: 'Akarere',
      serviceType: 'Ubwoko bw\'Inshingano',
      typeOfBeneficiaries: 'Ubwoko bw\'Abatsindiye',
      servicesIn: 'Inshingano mu',
      districtsWith: 'Intara zifite',
      title: 'URUTONDE RW\'INSHINGANO Z\'UMUTEKANO W\'ABANA',
      availableServices: 'Inshingano Ziboneka',
      availableDistricts: 'Intara Ziboneka',
      show: 'Erekana',
      hide: 'Hisha',
      expand: 'Kongera',
      collapse: 'Kugabanya',
    },
    serviceCard: {
      services: 'Inshingano',
      beneficiaries: 'Abatsindiye',
      beneficiariesLabel: 'Abatsindiye:',
      location: 'Aho biherereye',
      locations: 'Aho biherereye:',
      contact: 'Kwihuza',
      phone: 'Telefoni',
      email: 'I Meyili',
      website: 'Urubuga',
      share: 'Gawana',
      copied: 'Wakiriye!',
      reportIncorrect: 'Tangaza Ikosa',
      paid: 'YISHYURA',
      free: 'CYUBAKWA',
      viewDetails: 'Reba Ibisobanuro',
      hideDetails: 'Hisha Ibisobanuro',
      otherServices: 'Inshingano Zindi:',
      shareSuccess: 'Wagabiye neza!',
      shareError: 'Ntago wagabije. Ongera ugerageze.',
      linkCopied: 'Ihuza ryakiriwe mu clipboard!',
      shareTitle: 'Inshingano z\'Umutekano w\'Abana',
      foundVia: 'Byaboneka binyuze ku Rutonde rw\'Inshingano z\'Umutekano w\'Abana',
    },
    footer: {
      custodian: 'Umukoresha',
      custodianDescription: 'MIGEPROF/NCDA ni ukoresha w\'igihugu kandi n\'umuyobozi mukuru w\'Urutonde rw\'Inshingano z\'Umutekano w\'Abana.',
      copyright: '© 2024 Ikigo cy\'Igihugu cy\'Iterambere ry\'Abana (NCDA). Uburenganzira bwose ni ubwayo.',
      serviceDistricts: 'Intara z\'Inshingano',
      availableServices: 'Inshingano Ziboneka',
    },
    mainPage: {
      title: 'Urutonde rw\'Inshingano z\'Umutekano w\'Abana',
      noServicesFound: 'Ntago inshingano zaboneka',
      showingServices: 'Erekana',
      services: 'inshingano',
      tryAdjustingSearch: 'Gerageza guhindura ibisabwa cyangwa siba amashyirahamwe kugira ngo ubone inshingano zose ziboneka.',
      noServicesAvailable: 'Ntago inshingano z\'umutekano w\'abana ziboneka ubu.',
      loading: 'Kwiyongera inshingano...',
    },
    common: {
      loading: 'Kwiyongera...',
      error: 'Ikosa',
      success: 'Intsinzi',
      cancel: 'Kureka',
      save: 'Bika',
      delete: 'Siba',
      edit: 'Hindura',
      close: 'Funga',
    },
  },
};

