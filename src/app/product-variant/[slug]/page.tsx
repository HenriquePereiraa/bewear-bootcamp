import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductsList from "@/components/common/products-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variant: true,
        },
      },
    },
  });

  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: { variant: true },
  });

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6">
        {/* outra maneira para fazer com que a imagem não perca qualidade e fica na altura especificada
         <div className="relative h-[380px] w-full rounded-3xl">
          <Image
            src={productVariant.imageUrl}
            alt={productVariant.name}
            fill
            className="object-cover"
          />
        </div> */}
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.name}
          height={0}
          width={0}
          sizes="100vw"
          className="h-auto w-full object-cover"
        />

        <div className="px-5">
          {/*VARIANTS */}
          <VariantSelector
            selectedVariantSlug={slug}
            variants={productVariant.product.variant}
          />
        </div>

        <div className="px-5">
          {/*Titles */}
          <h2 className="text-lg text-sm font-semibold">
            {productVariant.product.name}
          </h2>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h3>
        </div>

        <ProductActions productVariantId={productVariant.id} />

        <div className="px-5">
          {/*Description */}
          <p className="text-sm">{productVariant.product.description}</p>
        </div>

        <ProductsList title="Talvez você goste" products={likelyProducts} />

        <Footer />
      </div>
    </>
  );
}
