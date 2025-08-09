"use client";

import Image from "next/image";

interface PartnerBrandsProps {
  name: string;
  image: string;
}

export default function PartnerBrands({ name, image }: PartnerBrandsProps) {
  return (
    <div className="flex min-w-[100px] flex-col items-center justify-center self-center">
      <Image
        src={image}
        alt={name}
        width={80}
        height={110}
        className="rounded-3xl"
      />
      <div className="max-w-[80px]">
        <p className="truncate text-xs font-medium">{name}</p>
      </div>
    </div>
  );
}
