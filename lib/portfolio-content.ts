// Shared, proof-led portfolio records power Skills, Projects, and homepage highlights.
export type ProjectCategory = "Creative" | "Technology" | "STEM";

export const PENCIL_ARTWORKS = [
  { src: "/images/art_ella.jpg", alt: "Pencil portrait study of Ella", title: "Ella" },
  { src: "/images/art_fox.jpg", alt: "Pencil drawing of a fox", title: "Fox study" },
  { src: "/images/art_lisa.jpg", alt: "Pencil portrait study of Lisa", title: "Lisa" },
  { src: "/images/art_mountain.jpg", alt: "Pencil landscape drawing of a mountain path", title: "Mountain path" },
  { src: "/images/art_rose.jpeg", alt: "Pencil portrait study of a woman holding a rose", title: "Rose" },
  { src: "/images/art_siena.jpg", alt: "Pencil portrait study of Siena", title: "Siena" },
] as const;

export const MUSIC_COLLABORATOR = {
  name: "Reassess Teejay",
  href: "https://www.youtube.com/@reassessTjOfficial",
} as const;

export const SKILLS = [
  {
    id: "pencil-art",
    category: "Creative practice",
    title: "Pencil art",
    description:
      "I began exploring pencil art in May 2025. Portraits, name art and landscapes have become a practice I enjoy developing.",
    proof: "Six studies in this portfolio",
    href: "/projects#pencil-art",
    linkLabel: "See the pencil work",
  },
  {
    id: "python",
    category: "Learning by building",
    title: "Python",
    description:
      "I’m learning Python through dedicated projects, including Odundo and experiments connected to the Crown Space Probe concept.",
    proof: "Odundo · Crown Space Probe",
    href: "/projects#odundo",
    linkLabel: "See Python projects",
  },
  {
    id: "cybersecurity",
    category: "Learning by building",
    title: "Cybersecurity",
    description:
      "My current proof is early-stage project work: Odundo, a Python cybersecurity tool, and security ideas explored through the Crown Space Probe concept.",
    proof: "Early-stage project work",
    href: "/projects#odundo",
    linkLabel: "Explore the work",
  },
  {
    id: "web-development",
    category: "Built work",
    title: "Web development",
    description:
      "I’ve built this portfolio and I’m developing Youngsripes, a Kenya-focused digital STEM learning ecosystem. Some work is not hosted publicly yet.",
    proof: "Live portfolio · Youngsripes in development",
    href: "/projects#youngsripes",
    linkLabel: "See web projects",
  },
  {
    id: "filmmaking",
    category: "Published work",
    title: "Filmmaking & storytelling",
    description:
      "I’ve made short films and I’m producing Crown Narratives, a documentary project exploring stories of African civilizations, with new episodes released weekly.",
    proof: "Public YouTube channel",
    href: "/projects#crown-narratives",
    linkLabel: "Watch Crown Narratives",
  },
  {
    id: "voice-work",
    category: "Private samples",
    title: "Voice work",
    description:
      "I’ve recorded a few private, non-paid voiceovers. They aren’t published here; I can share selected samples directly when useful.",
    proof: "Private voiceover samples",
    href: "/#contact",
    linkLabel: "Ask about a sample",
  },
  {
    id: "music",
    category: "Personal practice",
    title: "Music",
    description:
      "Music is a hobby, and I’ve recorded a demo session with an established rapper.",
    collaborator: MUSIC_COLLABORATOR,
    proof: "Recorded demo · audio preview",
    href: "/projects#music-demo",
    linkLabel: "Listen to the demo",
  },
  {
    id: "writing",
    category: "Published work",
    title: "Writing",
    description:
      "Summer is my debut novel. It explores the devastating consequences of an unforgotten love.",
    proof: "Published debut novel",
    href: "/summer",
    linkLabel: "Explore the novel",
  },
  {
    id: "space-stem",
    category: "Learning by building",
    title: "Space & STEM",
    description:
      "My curiosity about space and STEM is taking shape in the early-stage Crown Space Probe concept, bringing together Python, cybersecurity and a possible African space mission.",
    proof: "Early-stage concept",
    href: "/projects#crown-space-probe",
    linkLabel: "Explore the concept",
  },
] as const;

export const PROJECTS: {
  id: string;
  title: string;
  featuredTitle?: string;
  category: ProjectCategory;
  status: string;
  description: string;
  proof: string;
  href?: string;
  external?: boolean;
  image?: string;
  imageAlt?: string;
  gallery?: typeof PENCIL_ARTWORKS;
  previewPlaceholder?: string;
  audioSrc?: string;
  collaborator?: typeof MUSIC_COLLABORATOR;
  tags: string[];
}[] = [
  {
    id: "pencil-art",
    title: "Pencil art studies",
    featuredTitle: "calmey.art",
    category: "Creative",
    status: "Ongoing practice · Started May 2025",
    description:
      "A growing collection of portrait, name-art and landscape drawings made while I explore pencil art. It's an exhilarating journey!",
    proof: "Six original drawings",
    image: "/images/art_ella.jpg",
    imageAlt: "Pencil portrait artwork from the calmey.art collection",
    gallery: PENCIL_ARTWORKS,
    tags: ["Pencil", "Portraits", "Name art", "Landscape"],
  },
  {
    id: "summer",
    title: "Summer",
    category: "Creative",
    status: "Published novel",
    description:
      "My debut novel, exploring the devastating consequences of an unforgotten love.",
    proof: "Available on Kobo",
    href: "/summer",
    image: "/images/books/summer/display.png",
    imageAlt: "Hardback display of Summer by Calmey Crown against a rain-lit background",
    tags: ["Writing", "Novel", "Published"],
  },
  {
    id: "crown-narratives",
    title: "Crown Narratives",
    category: "Creative",
    status: "Documentary series · Weekly episodes",
    description:
      "An ongoing documentary project exploring African civilization stories. I’ve also made short films shared through the same YouTube channel.",
    proof: "Public YouTube channel",
    href: "https://www.youtube.com/@crowncalmey",
    external: true,
    image: "/images/projects/crown-narratives/digital-africa.png",
    imageAlt: "Digital Africa episode artwork from Crown Narratives",
    tags: ["Documentary", "Short films", "African stories"],
  },
  {
    id: "odundo",
    title: "Odundo Security System",
    category: "Technology",
    status: "Early-stage build",
    description:
      "A Python cybersecurity tool in its initial stages. The project gives me a focused way to learn by building; a public demo and fuller build notes can be added as it develops.",
    proof: "Active project · details in progress",
    previewPlaceholder: "Python · Cybersecurity · Early stage",
    image: "/images/project-odundo.avif",
    imageAlt: "Illustrative cybersecurity workstation image for the early-stage Odundo project",
    tags: ["Python", "Cybersecurity", "Learning project"],
  },
  {
    id: "smartbiz-lite",
    title: "SmartBiz Lite",
    category: "Technology",
    status: "In development",
    description:
      "A small-business operations tool intended to help everyday businesses—such as produce sellers and barbers—manage daily work through a simple, usable experience. A few features are already in place.",
    proof: "Early build · feature details to add",
    previewPlaceholder: "A simpler day-to-day for small business",
    tags: ["Small business", "Product thinking", "In progress"],
  },
  {
    id: "crown-space-probe",
    title: "Crown Space Probe",
    category: "STEM",
    status: "Initial-stage concept",
    description:
      "A project shaped by my love of space and curiosity about STEM. It explores how Python and cybersecurity could contribute to a potential African probe or space mission.",
    proof: "Concept in development · no mission hardware claimed",
    previewPlaceholder: "Space · Python · Cybersecurity",
    image: "/images/project-space.jfif",
    imageAlt: "Illustrative satellite image representing the Crown Space Probe concept",
    tags: ["Space", "STEM", "Python", "Cybersecurity"],
  },
  {
    id: "youngsripes",
    title: "Youngsripes",
    category: "Technology",
    status: "In development · Not hosted",
    description:
      "A Kenya-focused digital STEM learning ecosystem. The project is being developed; a public preview and fuller feature notes can be added when ready.",
    proof: "Active web project · preview to come",
    previewPlaceholder: "A digital home for learning STEM",
    tags: ["Web development", "STEM education", "Kenya"],
  },
  {
    id: "portfolio-homepage",
    title: "Calmey Crown portfolio",
    category: "Technology",
    status: "Live",
    description:
      "This portfolio brings my technical, creative and STEM interests together in one place. It is also a hands-on web development project that continues to evolve.",
    proof: "Live on this site",
    href: "/",
    image: "/images/hero-cover.png",
    imageAlt: "Atmospheric space-themed cover art used on the portfolio homepage",
    tags: ["Next.js", "React", "Web development"],
  },
  {
    id: "music-demo",
    title: "Music demo session",
    category: "Creative",
    status: "Demo recorded · Hobby project",
    description:
      "A demo session recorded with Reassess Teejay. Music is a hobby, and this clip offers a small preview of that collaboration.",
    proof: "Recorded demo · audio preview available",
    audioSrc: "/audio/the%20saga%20demo.mp3",
    collaborator: MUSIC_COLLABORATOR,
    tags: ["Music", "Demo session", "Hobby"],
  },
];
