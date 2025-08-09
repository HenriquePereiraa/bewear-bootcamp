"use client";

import { productTable, productVariantTable } from "@/db/schema";

import ProductItem from "./productItem";

interface ProductsListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variant: (typeof productVariantTable.$inferSelect)[];
  })[];
}

export default function ProductsList({ title, products }: ProductsListProps) {
  return (
    <>
      <div className="space-y-6">
        <h3 className="px-5 font-semibold">{title}</h3>
        <div className="ga-4 flex w-full overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
