import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { AdminPageHeader } from "@/components/admin/ui";
import { deleteProduct, saveProduct } from "@/app/admin/actions";
import { getProductById, listCollections } from "@/lib/db";

export const metadata: Metadata = { title: "Edit product · Admin" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();
  const collections = listCollections(true);

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title={product.title}
        description={`${product.sku || "No SKU"} · ${product.category} · updated ${new Date(product.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
        action={
          <Link
            href="/admin/products"
            className="inline-flex h-10 items-center gap-2 border border-line bg-white px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <ArrowLeft size={12} /> All products
          </Link>
        }
      />
      <ProductForm
        product={product}
        collections={collections}
        action={saveProduct}
        deleteAction={deleteProduct}
      />
    </>
  );
}
