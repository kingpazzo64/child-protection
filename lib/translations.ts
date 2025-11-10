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
  
  // Service Types
  serviceTypes: {
    [key: string]: string;
  };
  
  // Beneficiary Types
  beneficiaryTypes: {
    [key: string]: string;
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
    serviceTypes: {
      'Alternative Care': 'Alternative Care',
      'CP Case Management': 'CP Case Management',
      'CP Specialised Services': 'CP Specialised Services',
      'Education': 'Education',
      'GBV Case Management': 'GBV Case Management',
      'Health Services': 'Health Services',
      'Legal Services': 'Legal Services',
      'Psychosocial Support': 'Psychosocial Support',
      'Rehabilitation': 'Rehabilitation',
    },
    beneficiaryTypes: {
      'GBV survivor (gender based violence, early pregnancies...)': 'GBV survivor (gender based violence, early pregnancies...)',
      'Unaccompanied and separated children': 'Unaccompanied and separated children',
      'Asylum seeker children': 'Asylum seeker children',
      'Children in conflict with law': 'Children in conflict with law',
      'Children with disabilities': 'Children with disabilities',
      'Refugee children': 'Refugee children',
      'Street-connected children': 'Street-connected children',
      'Survivor of CP violence/abuse (non gender based violence)': 'Survivor of CP violence/abuse (non gender based violence)',
    },
  },
  rw: {
    header: {
      english: 'Icyongereza',
      kinyarwanda: 'Ikinyarwanda',
    },
    search: {
      searchPlaceholder: 'Shakisha ku izina, imeyili, cyangwa telefoni...',
      allDistricts: 'Uturere twose',
      allSectors: 'Imirenge Twose',
      allServiceTypes: 'Ubwoko bwose bwa serivisi',
      allBeneficiaries: 'Abafashwa Bose',
      providerName: 'Izina ry\'utanga serivisi',
      providerNamePlaceholder: 'Shakisha izina ry\'utanga serivisi...',
      clearFilters: 'Siba byose',
      filterBy: 'Shyirahamwe',
      expandSearch: 'Kongeraho Gushaka',
      district: 'Akarere',
      sector: 'Umurenge',
      serviceType: 'Ubwoko bwa serivisi',
      typeOfBeneficiaries: 'Ubwoko bw\'abafashwa',
      servicesIn: 'Serivisi mu',
      districtsWith: 'Uturere dufite',
      title: 'URUTONDE RWA SERVISI Z\'UMUTEKANO W\'ABANA',
      availableServices: 'Serivisi Zibonekamo',
      availableDistricts: 'Uturere Zibonekamo',
      show: 'Erekana',
      hide: 'Hisha',
      expand: 'Kongera',
      collapse: 'Kugabanya',
    },
    serviceCard: {
      services: 'Serivisi',
      beneficiaries: 'Abafashwa',
      beneficiariesLabel: 'Abafashwa:',
      location: 'Aho baherereye',
      locations: 'Aho baherereye:',
      contact: 'Kwihuza',
      phone: 'Telefoni',
      email: 'I Meyili',
      website: 'Urubuga',
      share: 'Sangiza',
      copied: 'Wakiriye!',
      reportIncorrect: 'Tangaza Ikosa',
      paid: 'IRISHYURWA',
      free: 'UBUNTU',
      viewDetails: 'Reba Ibisobanuro',
      hideDetails: 'Hisha Ibisobanuro',
      otherServices: 'Izindi serivisi:',
      shareSuccess: 'Wasangije neza!',
      shareError: 'Ntabwo. Ongera ugerageze.',
      linkCopied: 'Ihuza ryakiriwe mu clipboard!',
      shareTitle: 'Serivisi z\'Umutekano w\'Abana',
      foundVia: 'Byaboneka binyuze ku Rutonde rwa serivisi z\'Umutekano w\'Abana',
    },
    footer: {
      custodian: 'Umukoresha',
      custodianDescription: 'MIGEPROF/NCDA ni umukoresha w\'igihugu kandi n\'umuyobozi mukuru w\'Urutonde rwa serivisi z\'Umutekano w\'Abana.',
      copyright: '© 2025 Ikigo cy\'Igihugu cy\'Iterambere ry\'Abana (NCDA). Uburenganzira bwose ni ubwayo.',
      serviceDistricts: 'Uturere dutangirwamo serivisi',
      availableServices: 'Serivisi Zibonekamo',
    },
    mainPage: {
      title: 'Urutonde rwa serivisi z\'Umutekano w\'Abana',
      noServicesFound: 'Nta serivisi yabonetse',
      showingServices: 'Harimo',
      services: 'inshingano',
      tryAdjustingSearch: 'Gerageza guhindura ibisabwa cyangwa siba byose kugira ngo ubone serivisi zose ziboneka.',
      noServicesAvailable: 'Nta serivisi z\'umutekano w\'abana ziboneka ubu.',
      loading: 'Mutegereze serivisi...',
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
    serviceTypes: {
      'Alternative Care': 'Ubundi buryo bwo kurera abana',
      'CP Case Management': 'Gukurikirana ibibazo by\'abana bahohotewe',
      'CP Specialised Services': 'Serivisi zihariye ku bana bafite ibibazo',
      'Education': 'Uburezi',
      'GBV Case Management': 'Gukurikirana ibibazo by\'abana bakorewe ihohoterwa rishingiye ku gitsina',
      'Health Services': 'Serivisi z\'ubuvuzi',
      'Legal Services': 'Serivisi z\'amategeko',
      'Psychosocial Support': 'Ubufasha bwo mu mitekerereze n\'imibanire',
      'Rehabilitation': 'Gusubiza abana mu buzima busanzwe',
    },
    beneficiaryTypes: {
      'GBV survivor (gender based violence, early pregnancies...)': 'Uwakorewe ihohoterwa rishingiye ku gitsina (harimo guterwa inda imburagihe n\'ibindi)',
      'Unaccompanied and separated children': 'Abana batari kumwe n\'ababyeyi cyangwa batandukanye n\'imiryango yabo',
      'Asylum seeker children': 'Abana bashaka ubuhungiro',
      'Children in conflict with law': 'Abana bafitanye ibibazo n\'amategeko',
      'Children with disabilities': 'Abana bafite ubumuga',
      'Refugee children': 'Abana b\'impunzi',
      'Street-connected children': 'Abana baba ku muhanda',
      'Survivor of CP violence/abuse (non gender based violence)': 'Uwakorewe ihohoterwa rikorerwa abana ritari irishingiye ku gitsina',
    },
  },
};

