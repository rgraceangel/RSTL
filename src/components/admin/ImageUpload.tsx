"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageUp, Loader2, X } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";

export interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  /** Supabase Storage bucket to upload into (must already exist + have admin-write RLS). */
  bucket: string;
  /** Alt text used for the preview thumbnail. */
  alt?: string;
  /** Preview thumbnail size in pixels (square). Defaults to 128. */
  previewSize?: number;
  maxSizeMb?: number;
  disabled?: boolean;
}

const DEFAULT_ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/**
 * Generic, bucket-parameterized image uploader: uploads directly from the
 * browser to Supabase Storage and reports back the resulting public URL.
 * Reused by Prize Management (`prize-images`) and Game Management
 * (`game-images`) rather than duplicating this logic per domain.
 */
export function ImageUpload({
  value,
  onChange,
  bucket,
  alt = "Uploaded image",
  previewSize = 128,
  maxSizeMb = 5,
  disabled = false,
}: ImageUploadProps) {
  const { supabase } = useSupabase();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  const handleFile = async (file: File) => {
    setError(null);

    if (!DEFAULT_ACCEPTED_TYPES.includes(file.type)) {
      setError("Use PNG, JPEG, WebP, or GIF.");
      return;
    }
    if (file.size > maxSizeBytes) {
      setError(`Image must be under ${maxSizeMb}MB.`);
      return;
    }

    setIsUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    setIsUploading(false);

    if (uploadError) {
      setError("Upload failed. Please try again.");
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={DEFAULT_ACCEPTED_TYPES.join(",")}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {value ? (
        <div
          className="relative overflow-hidden rounded-md border border-border"
          style={{ height: previewSize, width: previewSize }}
        >
          <Image src={value} alt={alt} fill className="object-cover" sizes={`${previewSize}px`} />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background hover:bg-foreground"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={isUploading || disabled}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageUp className="h-4 w-4" />
          )}
          {isUploading ? "Uploading…" : "Upload image"}
        </Button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
