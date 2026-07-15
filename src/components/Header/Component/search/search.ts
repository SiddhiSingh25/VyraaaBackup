export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  category: string;
  tags: string[];
}

export interface RecentSearch {
  id: string;
  term: string;
  timestamp: number;
}

export type SearchSection = "recent" | "recentlyViewed" | "results" | "noResults";
