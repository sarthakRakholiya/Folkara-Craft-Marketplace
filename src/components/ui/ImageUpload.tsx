"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import type { UploadFolder } from "@/lib/cloudinary";
import axios from "axios";
import { useUnsavedImage } from "@/hooks/useUnsavedImage";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploadProps {
  folder: UploadFolder;
  onUploadComplete: (image: UploadedImage) => void;
  onUploadError?: (error: string) => void;
  currentImageUrl?: string; // shows existing image on load
  currentPublicId?: string;
  isUnsaved?: boolean;
  label?: string;
  hint?: string;
  shape?: "circle" | "rectangle";
  aspectRatio?: string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  minHeight?: number | string;
  width?: number | string;
  height?: number | string;
}

export function ImageUpload({
  folder,
  onUploadComplete,
  onUploadError,
  currentImageUrl,
  currentPublicId,
  isUnsaved = false,
  label = "Upload Image",
  hint = "JPG, PNG or WebP · max 5 MB",
  shape = "circle",
  aspectRatio = "1/1",
  maxWidth = 200,
  maxHeight,
  minHeight,
  width = "100%",
  height,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl ?? null,
  );
  const [activePublicId, setActivePublicId] = useState<string | null>(
    currentPublicId ?? null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useUnsavedImage(activePublicId, isUnsaved);

  const uploadFile = useCallback(
    async (file: File) => {
      const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!ALLOWED.includes(file.type)) {
        const msg = "Only JPG, PNG, or WebP files are allowed.";
        setError(msg);
        onUploadError?.(msg);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        const msg = "File is too large. Maximum size is 5 MB.";
        setError(msg);
        onUploadError?.(msg);
        return;
      }

      setError(null);
      setIsUploading(true);

      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        if (activePublicId) {
          formData.append("deletePublicId", activePublicId);
        }

        const response = await axios.post("/api/upload", formData);
        const data = response.data;

        setPreview(data.url);
        setActivePublicId(data.publicId);
        onUploadComplete({ url: data.url, publicId: data.publicId });
      } catch (err: any) {
        const msg =
          err.response?.data?.error ||
          err.message ||
          "Upload failed. Please try again.";
        setError(msg);
        onUploadError?.(msg);
        setPreview(currentImageUrl ?? null);
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onUploadComplete, onUploadError, currentImageUrl, activePublicId],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  return (
    <div
      className="flex flex-col gap-2 mx-auto"
      style={{ maxWidth, width, height }}
    >
      {label && (
        <span className="text-sm font-medium text-on-surface text-center">
          {label}
        </span>
      )}

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        className={`
          relative cursor-pointer border-2 transition-all mx-auto group/upload
          ${shapeClass}
          ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-dashed border-outline-variant hover:border-primary/50 hover:bg-surface-container-highest"
          }
          ${isUploading ? "pointer-events-none opacity-70" : ""}
        `}
        style={{
          aspectRatio: aspectRatio === "auto" ? undefined : aspectRatio,
          width: "100%",
          height: "100%",
          minHeight:
            minHeight ||
            (aspectRatio === "auto" ? "min(200px, 40vh)" : undefined),
          maxHeight: maxHeight,
        }}
      >
        {/* Content Wrapper (Clipped) */}
        <div className={cn("absolute inset-0 overflow-hidden", shapeClass)}>
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium flex items-center gap-1">
                  <Upload size={14} /> Change
                </span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <div className="rounded-full bg-surface-container-high p-3">
                <ImageIcon size={24} className="text-outline" />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">
                  Click to upload
                </p>
                <p className="text-xs text-outline mt-0.5">or drag and drop</p>
              </div>
            </div>
          )}
        </div>

        {/* Remove button (Outside the clipped wrapper but inside relative parent) */}
        {preview && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className={cn(
              "absolute z-20 bg-error hover:bg-error/80 text-white rounded-full p-1.5 shadow-lg transition-all",
              shape === "circle" ? "top-1 right-1" : "-top-2 -right-2"
            )}
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
        )}

        {/* Loading overlay (Inside parent to cover everything) */}
        {isUploading && (
          <div className={cn("absolute inset-0 bg-white/80 flex items-center justify-center z-30", shapeClass)}>
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-primary" />
              <span className="text-xs text-on-surface-variant">
                Uploading…
              </span>
            </div>
          </div>
        )}
      </div>

      <p className="text-[10px] uppercase font-bold text-outline text-center tracking-widest">
        {hint}
      </p>

      {error && <p className="text-xs text-error text-center">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
