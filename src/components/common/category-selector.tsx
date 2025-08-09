"use client";

import { categoryTable } from "@/db/schema";

import { Button } from "../ui/button";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

export default function CategorySelector({
  categories,
}: CategorySelectorProps) {
  return (
    <div className="rounded-3xl bg-[#F4EFFF] p-6">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Button
            className="rounded-full bg-white text-xs font-semibold"
            key={category.id}
            variant="ghost"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
