"use client";

import PartnerBrands from "./partner-brands";

interface PartnerBrandsList {
  title: string;
}

const partnerBrands = [
  { name: "Nike", image: "/nike.png" },
  { name: "Adidas", image: "/adidas.png" },
  { name: "Puma", image: "/puma.png" },
  { name: "New Balance", image: "/new-balance.png" },
];

export default function PartnerBrandsList({ title }: PartnerBrandsList) {
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">{title}</h3>
      <div className="flex w-full gap-1 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {partnerBrands.map((partnerBrand) => (
          <PartnerBrands
            key={partnerBrand.name}
            name={partnerBrand.name}
            image={partnerBrand.image}
          />
        ))}
      </div>
    </div>
  );
}
