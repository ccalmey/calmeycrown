// Portable book metadata can feed this website now and a native app presentation later.
export type BookPageContent = {
  slug: string;
  title: string;
  author: string;
  tagline: string;
  teaser: string;
  synopsis: string[];
  themes: string[];
  coverImage: string;
  coverAlt: string;
  retailer: string;
  retailerUrl: string;
  projectHref: string;
  skillHref: string;
};
