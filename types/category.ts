export interface Category {
    id: string;
    name: string;
    slug?: string;
    icon?: string;
}

export interface PriceTier {
    id: string;
    name: string;
    minPrice: number;
    maxPrice: number;
}

export const PRICE_TIERS: PriceTier[] = [
    { id: "all", name: "All Prices", minPrice: 0, maxPrice: 99999999999 },
    { id: "entry", name: "Entry Atelier ($10+)", minPrice: 10, maxPrice: 49 },
    { id: "pro", name: "Professional ($50+)", minPrice: 50, maxPrice: 99 },
    { id: "luxury", name: "Luxury Bespoke ($100+)", minPrice: 100, maxPrice: 999999999 },
];