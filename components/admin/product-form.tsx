"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import type { Collection, Product } from "@/lib/types";
import {
  Field,
  adminButton,
  adminButtonGhost,
  adminInput,
  adminSelect,
  adminTextarea,
} from "@/components/admin/ui";

const CATEGORIES = [
  "Everyday Essentials",
  "Sets & Combos",
  "Blankets & Swaddles",
  "Bath & Care",
  "Dresses",
  "Dungarees",
  "Co-ords & Sets",
  "Rompers & Onesies",
  "Accessories",
  "Muslin Cloths",
];

const BADGES = ["", "Bestseller", "New in", "Loved by parents", "Sale"];

export function ProductForm({
  product,
  collections,
  action,
  deleteAction,
}: {
  product?: Product;
  collections: Collection[];
  action: (formData: FormData) => void | Promise<void>;
  deleteAction?: (formData: FormData) => void | Promise<void>;
}) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    setUploadError("");
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message || "Upload failed.");
        uploaded.push(data.url);
      }
      setImages((current) => [...current, ...uploaded]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    setImages((current) => [...current, url]);
    setUrlInput("");
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={product?.id || ""} />
        <input type="hidden" name="images" value={JSON.stringify(images)} />

        <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
          <div className="space-y-4">
            <section className="border border-line bg-white p-5">
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
                The basics
              </p>
              <div className="grid gap-4">
                <Field label="Product title">
                  <input
                    name="title"
                    defaultValue={product?.title}
                    required
                    className={adminInput}
                    placeholder="Kimono muslin romper"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="URL handle" hint="Leave blank to generate from the title.">
                    <input
                      name="handle"
                      defaultValue={product?.handle}
                      className={adminInput}
                      placeholder="kimono-muslin-romper"
                    />
                  </Field>
                  <Field label="Category">
                    <input
                      name="category"
                      defaultValue={product?.category || "Everyday Essentials"}
                      list="product-categories"
                      className={adminInput}
                    />
                    <datalist id="product-categories">
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </Field>
                </div>
                <Field label="Lead line" hint="The short sentence shown beside the product.">
                  <textarea
                    name="lead"
                    defaultValue={product?.lead}
                    className={`${adminTextarea} min-h-[72px]`}
                    placeholder="A whisper-soft layer made for naps, cuddles and everything in between."
                  />
                </Field>
                <Field label="Highlights" hint="One per line or comma separated.">
                  <textarea
                    name="highlights"
                    defaultValue={product?.highlights.join("\n")}
                    className={`${adminTextarea} min-h-[86px]`}
                    placeholder={"Premium breathable muslin\nGets softer with every wash"}
                  />
                </Field>
                <Field label="Description (HTML allowed)">
                  <textarea
                    name="description"
                    defaultValue={product?.description}
                    className={`${adminTextarea} min-h-[180px] font-mono text-[11px]`}
                    placeholder="<p>...</p>"
                  />
                </Field>
              </div>
            </section>

            <section className="border border-line bg-white p-5">
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
                Pricing & stock
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Price (₹)" hint="Whole rupees, inclusive of GST.">
                  <input
                    name="price"
                    type="number"
                    min="0"
                    defaultValue={product?.price ?? ""}
                    required
                    className={adminInput}
                  />
                </Field>
                <Field label="Compare-at price (₹)" hint="Optional. Shows a strike-through.">
                  <input
                    name="compareAtPrice"
                    type="number"
                    min="0"
                    defaultValue={product?.compareAtPrice ?? ""}
                    className={adminInput}
                  />
                </Field>
                <Field label="SKU">
                  <input
                    name="sku"
                    defaultValue={product?.sku}
                    className={adminInput}
                    placeholder="BC-0001"
                  />
                </Field>
                <Field label="Stock on hand">
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={product?.stock ?? 20}
                    className={adminInput}
                  />
                </Field>
                <Field label="Sizes" hint="Comma separated, e.g. 0–3M, 3–6M, 6–12M." className="sm:col-span-2">
                  <input
                    name="sizes"
                    defaultValue={product?.sizes.join(", ")}
                    className={adminInput}
                    placeholder="0-3 months, 3-6 months, 6-12 months"
                  />
                </Field>
                <Field label="Prints / colours" hint="Comma separated. Shown as selectable chips." className="sm:col-span-2">
                  <input
                    name="colors"
                    defaultValue={product?.colors.join(", ")}
                    className={adminInput}
                    placeholder="Teddy, Strawberry, Tulip"
                  />
                </Field>
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <section className="border border-line bg-white p-5">
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
                Media
              </p>

              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={`${image}-${index}`} className="group relative">
                    <div className="relative aspect-[4/5] overflow-hidden border border-line bg-sand">
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        fill
                        sizes="140px"
                        className="object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 text-[7px] uppercase tracking-[0.1em] text-cream">
                          Main
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveImage(index, -1)}
                          className="flex h-5 w-5 items-center justify-center border border-line text-muted hover:text-ink"
                          aria-label="Move image up"
                        >
                          <ArrowUp size={9} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, 1)}
                          className="flex h-5 w-5 items-center justify-center border border-line text-muted hover:text-ink"
                          aria-label="Move image down"
                        >
                          <ArrowDown size={9} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
                        className="flex h-5 w-5 items-center justify-center border border-line text-muted hover:border-clay hover:text-clay"
                        aria-label="Remove image"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex aspect-[4/5] flex-col items-center justify-center gap-1 border border-dashed border-line bg-sand/30 text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={17} />}
                  <span className="text-[8px] uppercase tracking-[0.1em]">
                    {uploading ? "Uploading" : "Upload"}
                  </span>
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                multiple
                onChange={(event) => uploadFiles(event.target.files)}
                className="hidden"
              />

              {uploadError && <p className="mt-2 text-[10px] text-clay">{uploadError}</p>}

              <div className="mt-3 flex gap-2">
                <input
                  value={urlInput}
                  onChange={(event) => setUrlInput(event.target.value)}
                  placeholder="/images/products/... or https://..."
                  className={`${adminInput} h-9 text-[10.5px]`}
                />
                <button
                  type="button"
                  onClick={addUrl}
                  className="flex h-9 w-9 shrink-0 items-center justify-center border border-line text-muted hover:border-ink hover:text-ink"
                  aria-label="Add image URL"
                >
                  <Plus size={13} />
                </button>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[9px] text-muted">
                <UploadCloud size={10} /> JPG, PNG, WebP, AVIF or SVG · max 5MB each
              </p>
            </section>

            <section className="border border-line bg-white p-5">
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
                Collections
              </p>
              <div className="space-y-1.5">
                {collections.map((collection) => (
                  <label
                    key={collection.handle}
                    className="flex cursor-pointer items-center gap-2.5 text-[11.5px] text-muted"
                  >
                    <input
                      type="checkbox"
                      name="collections"
                      value={collection.handle}
                      defaultChecked={product?.collections.includes(collection.handle)}
                      className="h-3.5 w-3.5 accent-ink"
                    />
                    {collection.title}
                    {!collection.active && (
                      <span className="text-[8px] uppercase tracking-[0.08em] text-clay">hidden</span>
                    )}
                  </label>
                ))}
              </div>
            </section>

            <section className="border border-line bg-white p-5">
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
                Badge & visibility
              </p>
              <div className="space-y-4">
                <Field label="Product badge">
                  <select name="badge" defaultValue={product?.badge || ""} className={adminSelect}>
                    {BADGES.map((badge) => (
                      <option key={badge || "none"} value={badge}>
                        {badge || "No badge"}
                      </option>
                    ))}
                  </select>
                </Field>
                <label className="flex cursor-pointer items-start gap-2.5 border border-line p-3">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={product?.featured}
                    className="mt-0.5 h-3.5 w-3.5 accent-ink"
                  />
                  <span>
                    <span className="block text-[11.5px] font-medium text-ink">Featured piece</span>
                    <span className="mt-0.5 block text-[9.5px] text-muted">
                      Appears on the homepage and first in the shop.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-2.5 border border-line p-3">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={product ? product.active : true}
                    className="mt-0.5 h-3.5 w-3.5 accent-ink"
                  />
                  <span>
                    <span className="block text-[11.5px] font-medium text-ink">Visible on storefront</span>
                    <span className="mt-0.5 block text-[9.5px] text-muted">
                      Uncheck to hide without deleting.
                    </span>
                  </span>
                </label>
              </div>
            </section>
          </div>
        </div>

        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 border border-line bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
          <Link href="/admin/products" className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.14em] text-muted hover:text-ink">
            <ArrowLeft size={12} /> Back to products
          </Link>
          <div className="flex items-center gap-2">
            {product && (
              <Link
                href={`/products/${product.handle}`}
                target="_blank"
                className={adminButtonGhost}
              >
                View on store
              </Link>
            )}
            <button type="submit" className={adminButton}>
              <Check size={13} /> {product ? "Save changes" : "Create product"}
            </button>
          </div>
        </div>
      </form>

      {product && deleteAction && (
        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (!window.confirm("Delete this product permanently? This cannot be undone.")) {
              event.preventDefault();
            }
          }}
          className="flex justify-end"
        >
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-2 border border-line px-3 text-[9px] font-medium uppercase tracking-[0.12em] text-clay transition-colors hover:border-clay hover:bg-clay/5"
          >
            <Trash2 size={12} /> Delete product
          </button>
        </form>
      )}
    </div>
  );
}
