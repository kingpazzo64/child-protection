export interface Service {
  id: number;
  name: string;
  mainService: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  services: string[];
  verified: boolean;
  rating: number;
  district: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const servicesData: Service[] = [
  {
    id: 1,
    name: "Central Family Support Center",
    mainService: "Case Management",
    category: "Case Management",
    description: "Comprehensive family support services including counseling, emergency assistance, and legal guidance.",
    address: "123 KN 3 Road, Kigali",
    phone: "+250 788 123 456",
    email: "info@centralfsc.gov.rw",
    services: ["Family Counseling", "Emergency Housing", "Legal Support"],
    verified: true,
    rating: 5,
    district: "Gasabo",
    urgency: "Medium"
  },
  {
    id: 2,
    name: "Child Advocacy Network",
    mainService: "Legal Aid",
    category: "General Child Protection",
    description: "Specialized advocacy services for children in legal proceedings and victim support programs.",
    address: "456 KG 15 Avenue, Kigali",
    phone: "+250 788 234 567",
    email: "help@childadvocacy.gov.rw",
    services: ["Child Advocacy", "Court Support", "Victim Services"],
    verified: true,
    rating: 4,
    district: "Kicukiro",
    urgency: "High"
  },
  {
    id: 3,
    name: "Safe Haven Crisis Center",
    mainService: "Emergency Response",
    category: "Emergency Response",
    description: "24/7 crisis intervention services with emergency shelter and immediate support for families in crisis.",
    address: "789 Butare Road, Huye District",
    phone: "+250 788 345 678",
    email: "crisis@safehaven.gov.rw",
    services: ["Crisis Intervention", "Emergency Shelter", "24/7 Hotline"],
    verified: true,
    rating: 5,
    district: "Huye",
    urgency: "Critical"
  },
  {
    id: 4,
    name: "Youth Protection Services",
    mainService: "General Child Protection",
    category: "Alternative Care",
    description: "Dedicated youth protection and development services with counseling and educational support programs.",
    address: "321 Ruhengeri Avenue, Musanze District",
    phone: "+250 788 456 789",
    email: "youth@yps.gov.rw",
    services: ["Youth Counseling", "Educational Support", "Mentorship"],
    verified: true,
    rating: 4,
    district: "Musanze",
    urgency: "Low"
  },
  {
    id: 5,
    name: "Community Child Welfare",
    mainService: "Alternative Care",
    category: "Alternative Care",
    description: "Community-based child welfare services focusing on family preservation and child safety.",
    address: "654 Gisenyi Road, Rubavu District",
    phone: "+250 788 567 890",
    email: "welfare@ccw.gov.rw",
    services: ["Welfare Assessment", "Family Reunification", "Foster Care"],
    verified: true,
    rating: 4,
    district: "Rubavu",
    urgency: "Medium"
  },
  {
    id: 6,
    name: "Therapeutic Family Center",
    mainService: "Psychosocial Support",
    category: "Psychosocial Support",
    description: "Specialized therapeutic services for families dealing with trauma and relationship challenges.",
    address: "987 Kayonza Main Road, Kayonza District",
    phone: "+250 788 678 901",
    email: "therapy@tfc.gov.rw",
    services: ["Family Therapy", "Trauma Treatment", "Support Groups"],
    verified: true,
    rating: 5,
    district: "Kayonza",
    urgency: "High"
  },
  {
    id: 7,
    name: "Rural Child Protection Unit",
    mainService: "General Child Protection",
    category: "General Child Protection",
    description: "Mobile child protection services reaching rural communities with education and emergency response.",
    address: "123 Nyagatare Center, Nyagatare District",
    phone: "+250 788 789 012",
    email: "rural@ncpu.gov.rw",
    services: ["Mobile Outreach", "Community Education", "Emergency Response"],
    verified: true,
    rating: 4,
    district: "Nyagatare",
    urgency: "Medium"
  },
  {
    id: 8,
    name: "Integrated Child Services",
    mainService: "Health Services",
    category: "Health Services",
    description: "Comprehensive integrated services addressing health, education, and protection needs of children.",
    address: "456 Gitarama Road, Muhanga District",
    phone: "+250 788 890 123",
    email: "integrated@ics.gov.rw",
    services: ["Case Management", "Health Services", "Education Support"],
    verified: true,
    rating: 4,
    district: "Muhanga",
    urgency: "Low"
  },
  {
    id: 9,
    name: "Children's Justice Center",
    mainService: "Justice Services",
    category: "Justice Services",
    description: "Specialized justice services for children involved in legal proceedings and juvenile justice system.",
    address: "789 Justice Avenue, Kicukiro District",
    phone: "+250 788 901 234",
    email: "justice@cjc.gov.rw",
    services: ["Legal Representation", "Court Preparation", "Juvenile Justice"],
    verified: true,
    rating: 5,
    district: "Kicukiro",
    urgency: "Critical"
  },
  {
    id: 10,
    name: "Special Needs Support Center",
    mainService: "Disability Services",
    category: "Disability Service",
    description: "Specialized support services for children with disabilities including assessment and adaptive care.",
    address: "321 Inclusive Road, Gisagara District",
    phone: "+250 788 012 345",
    email: "disability@snsc.gov.rw",
    services: ["Disability Assessment", "Adaptive Support", "Inclusive Education"],
    verified: true,
    rating: 4,
    district: "Gisagara",
    urgency: "High"
  },
  {
    id: 11,
    name: "Child Rehabilitation Center",
    mainService: "Rehabilitation",
    category: "Rehabilitation",
    description: "Comprehensive rehabilitation services for children with behavioral issues and substance abuse problems.",
    address: "654 Recovery Street, Burera District",
    phone: "+250 788 123 567",
    email: "rehab@crc.gov.rw",
    services: ["Behavioral Therapy", "Substance Abuse Recovery", "Life Skills Training"],
    verified: true,
    rating: 4,
    district: "Burera",
    urgency: "Medium"
  },
  {
    id: 12,
    name: "Educational Support Network",
    mainService: "Education Services",
    category: "Education Services",
    description: "Educational support services ensuring children's access to quality education and learning opportunities.",
    address: "987 Learning Avenue, Nyanza District",
    phone: "+250 788 234 678",
    email: "education@esn.gov.rw",
    services: ["School Enrollment", "Educational Advocacy", "Learning Support"],
    verified: true,
    rating: 5,
    district: "Nyanza",
    urgency: "Low"
  }
];