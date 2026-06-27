import Link from "next/link";
import ListProduct from "@/components/products/ListProduct";
import CategoryRow from "@/components/search/CategoryRow";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl mt-12 font-bold tracking-tight sm:text-6xl text-primary">
        Welcome to Perfect Market
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
        The ultimate marketplace for designers to showcase products and for customers to find high-quality design services.
      </p>
      
      <div className="mt-10 flex items-center justify-center gap-x-6">
        {/* TODO: Implement Hero Section with Search Bar */}
        <Link
          href="/products"
          className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
        >
          Explore Products
        </Link>
        <Link href="/designer/ranking" className="text-sm font-semibold leading-6">
          View Top Designers <span aria-hidden="true">→</span>
        </Link>
      </div>
        <CategoryRow />
        <ListProduct />
    </div>
  );
}
