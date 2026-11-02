import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { AdminPageHeader } from "@/components/admin/ui";
import { saveProduct } from "@/app/admin/actions";
import { listCollections } from "@/lib/db";

export const metadata: Metadata = { title: "New product · Admin" };
export const dynamic = "force-dynamic";

export default function NewProductPage() {
  const collections = listCollections(true);

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="New product"
        description="Add a piece to the storefront. You can save it as a hidden draft first and publish when it's ready."
        action={
          <Link
            href="/admin/products"
            className="inline-flex h-10 items-center gap-2 border border-line bg-white px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <ArrowLeft size={12} /> All products
          </Link>
        }
      />
      <ProductForm collections={collections} action={saveProduct} />
    </>
  );
}
