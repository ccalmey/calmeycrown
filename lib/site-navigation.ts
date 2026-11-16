// Keep the global menu focused on real destinations; homepage anchors are only
// declared for sections that are present there, while Skills and Projects own their routes.
export const SITE_NAVIGATION = [
  { id: "home", label: "Home", href: "/#home", homeSection: "home" },
  { id: "about", label: "About", href: "/about", homeSection: undefined },
  { id: "skills", label: "Skills", href: "/skills", homeSection: undefined },
  { id: "projects", label: "Projects", href: "/projects", homeSection: "projects" },
  // Blog is a first-class destination so it stays visible across desktop, mobile, and command navigation.
  { id: "blog", label: "Blog", href: "/blog", homeSection: undefined },
  { id: "contact", label: "Contact", href: "/#contact", homeSection: "contact" },
] as const;

export type SitePageId = "home" | "about" | "skills" | "projects" | "blog";
