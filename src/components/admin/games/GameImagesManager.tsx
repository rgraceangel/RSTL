"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { RoleGate } from "@/components/admin/RoleGate";
import { addGameImageAction, deleteGameImageAction } from "@/lib/actions/game-images";
import { GAME_IMAGE_TYPES, GAME_IMAGE_TYPE_LABELS } from "@/constants";
import type { GameImageItem } from "@/lib/queries/games";
import type { ImageType } from "@/types";

export function GameImagesManager({ gameId, images }: { gameId: string; images: GameImageItem[] }) {
  const router = useRouter();
  const [pendingUrl, setPendingUrl] = useState("");
  const [imageType, setImageType] = useState<ImageType>("banner");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (!pendingUrl) return;
    setError(null);
    startTransition(async () => {
      const result = await addGameImageAction(gameId, { image_url: pendingUrl, image_type: imageType });
      if (result?.error) {
        setError(result.error);
      } else {
        setPendingUrl("");
        router.refresh();
      }
    });
  };

  const handleDelete = (imageId: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteGameImageAction(gameId, imageId);
      if (result?.error) setError(result.error);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="space-y-1.5">
              <div className="relative aspect-square overflow-hidden rounded-md border border-border">
                <Image src={image.image_url} alt={image.alt_text ?? "Game image"} fill className="object-cover" sizes="200px" />
                <RoleGate allowed={["admin", "super_admin"]}>
                  <button
                    type="button"
                    onClick={() => handleDelete(image.id)}
                    disabled={isPending}
                    className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background hover:bg-foreground"
                    aria-label="Remove image"
                  >
                    {isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </RoleGate>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {GAME_IMAGE_TYPE_LABELS[image.image_type as (typeof GAME_IMAGE_TYPES)[number]] ??
                  image.image_type}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No images yet.</p>
      )}

      <RoleGate allowed={["admin", "super_admin"]}>
        <div className="flex flex-wrap items-end gap-3 rounded-md border border-border p-3">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">New image</p>
            <ImageUpload value={pendingUrl} onChange={setPendingUrl} bucket="game-images" alt="New game image" previewSize={80} />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Type</p>
            <Select
              value={imageType}
              onChange={(e) => setImageType(e.target.value as ImageType)}
              className="w-auto"
            >
              {GAME_IMAGE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {GAME_IMAGE_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>
          </div>
          <Button type="button" size="sm" disabled={!pendingUrl || isPending} onClick={handleAdd}>
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Add image"}
          </Button>
        </div>
      </RoleGate>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
