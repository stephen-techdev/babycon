"use client";

import Image from "next/image";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import type { Collection } from "@/lib/types";
import {
  Field,
  adminButton,
  adminInput,
  adminTextarea,
} from "@/components/admin/ui";
import { AdminDrawer } from "@/components/admin/drawer";

type Action = (formData: FormData) => void | Promise<void>;

function CollectionFields({ collection }: { collection?: Collection }) {
  return (
    <div className="space-y-4">
      <input type="hidden" name="id" value={collection?.id || ""} />
      <Field label="Collection title">
        <input
          name="title"
          defaultValue={collection?.title}
          required
          className={adminInput}
          placeholder="Newborn essentials"
        />
      </Field>
      <Field label="URL handle" hint="Leave blank to generate from the title.">
        <input
          name="handle"
          defaultValue={collection?.handle}
          className={adminInput}
          placeholder="new-born-essentials"
        />
      </Field>
      <Field label="Description">
        <textarea
          name="description"
          defaultValue={collection?.description}
          className={`${adminTextarea} min-h-[110px]`}
          placeholder="Everything for the first tiny days…"
        />
      </Field>
      <Field label="Cover image" hint="A path under /images or an https URL.">
        <input
          name="image"
          defaultValue={collection?.image}
          className={adminInput}
          placeholder="/images/collections/new-born-essentials.jpg"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sort order" hint="Lower numbers appear first.">
          <input
            name="sortOrder"
            type="number"
            defaultValue={collection?.sortOrder ?? 0}
            className={adminInput}
          />
        </Field>
        <label className="flex cursor-pointer items-start gap-2.5 border border-line bg-white p-3">
          <input
            type="checkbox"
            name="active"
            defaultChecked={collection ? collection.active : true}
            className="mt-0.5 h-3.5 w-3.5 accent-ink"
          />
          <span>
            <span className="block text-[11.5px] font-medium text-ink">Visible on storefront</span>
            <span className="mt-0.5 block text-[9.5px] text-muted">Uncheck to hide the collection.</span>
          </span>
        </label>
      </div>
      <button type="submit" className={`${adminButton} w-full`}>
        {collection ? "Save collection" : "Create collection"}
      </button>
    </div>
  );
}

export function CollectionManager({
  collections,
  saveAction,
  deleteAction,
}: {
  collections: Collection[];
  saveAction: Action;
  deleteAction: Action;
}) {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
          {collections.length} collections · {collections.filter((c) => c.active).length} visible
        </p>
        <AdminDrawer
          label={
            <>
              <Plus size={13} /> New collection
            </>
          }
          title="New collection"
          description="Create an edit for the storefront."
        >
          <form action={saveAction}>
            <CollectionFields />
          </form>
        </AdminDrawer>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          <article key={collection.id} className="border border-line bg-white">
            <div className="relative aspect-[16/9] overflow-hidden bg-sand">
              {collection.image ? (
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">
                  <Layers size={22} />
                </div>
              )}
              <span
                className={`absolute left-2 top-2 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.1em] ${
                  collection.active ? "bg-sage text-white" : "bg-ink/70 text-cream"
                }`}
              >
                {collection.active ? "Visible" : "Hidden"}
              </span>
            </div>
            <div className="p-4">
              <p className="font-serif text-[19px] leading-tight text-ink">{collection.title}</p>
              <p className="mt-0.5 text-[9.5px] text-muted">
                /{collection.handle} · {collection.productCount ?? 0} products
              </p>
              <p className="mt-2 line-clamp-2 text-[10.5px] leading-relaxed text-muted">
                {collection.description || "No description yet."}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <AdminDrawer
                  label={
                    <>
                      <Pencil size={11} /> Edit
                    </>
                  }
                  variant="ghost"
                  title={`Edit ${collection.title}`}
                  description="Changes appear on the storefront immediately."
                >
                  <form action={saveAction}>
                    <CollectionFields collection={collection} />
                  </form>
                </AdminDrawer>
                <form
                  action={deleteAction}
                  onSubmit={(event) => {
                    if (!window.confirm(`Delete “${collection.title}”? Products stay in the catalog.`)) {
                      event.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="id" value={collection.id} />
                  <button
                    type="submit"
                    className="flex h-7 items-center gap-1 px-1.5 text-[9px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-clay"
                    aria-label={`Delete ${collection.title}`}
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
