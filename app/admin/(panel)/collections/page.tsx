import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { deleteCollection, saveCollection } from "@/app/admin/actions";
import { CollectionManager } from "@/components/admin/collection-manager";
import { AdminPageHeader } from "@/components/admin/ui";
import { listCollections } from "@/lib/db";

export const metadata: Metadata = { title: "Collections · Admin" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminCollectionsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const saved = Array.isArray(raw.saved) ? raw.saved[0] : raw.saved;
  const deleted = Array.isArray(raw.deleted) ? raw.deleted[0] : raw.deleted;
  const collections = listCollections(true);

  return (
    <>
      <AdminPageHeader
        eyebrow="Merchandising"
        title="Collections"
        description="The edits shoppers browse — newborn, baby girl, baby boy, offers and more. Reorder, rename or hide them without touching the catalog."
      />

      {(saved || deleted) && (
        <div className="mb-4 flex items-center gap-2 border border-sage/40 bg-sage/10 px-4 py-2.5 text-[11px] text-sage">
          <CheckCircle2 size={14} /> {deleted ? "Collection deleted." : "Collection saved."}
        </div>
      )}

      <CollectionManager
        collections={collections}
        saveAction={saveCollection}
        deleteAction={deleteCollection}
      />
    </>
  );
}
