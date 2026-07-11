"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";

interface PrizeImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

/**
 * Thin, domain-named wrapper around the generic `ImageUpload` component,
 * pinned to the `prize-images` bucket. Kept so existing imports
 * (`PrizeForm.tsx`) don't need to change; the actual upload logic lives in
 * `components/admin/ImageUpload.tsx` and is shared with Game Management.
 */
export function PrizeImageUpload({ value, onChange }: PrizeImageUploadProps) {
  return (
    <ImageUpload value={value} onChange={onChange} bucket="prize-images" alt="Prize" previewSize={128} />
  );
}
