"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUpload({ onUpload, maxFiles = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      setUploadError(null);
      setIsUploading(true);

      try {
        const uploadedUrls: string[] = [];
        
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error("Failed to upload image");
          }

          const data = await res.json();
          uploadedUrls.push(data.url);
        }

        const newUrls = [...previewUrls, ...uploadedUrls].slice(0, maxFiles);
        setPreviewUrls(newUrls);
        onUpload(newUrls);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError("Failed to upload one or more images");
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, previewUrls, maxFiles]
  );

  const removeImage = (indexToRemove: number) => {
    const newUrls = previewUrls.filter((_, index) => index !== indexToRemove);
    setPreviewUrls(newUrls);
    onUpload(newUrls);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: maxFiles - previewUrls.length,
    disabled: isUploading || previewUrls.length >= maxFiles,
  });

  return (
    <div className="space-y-4">
      {previewUrls.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:bg-secondary/50"
          } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            {isUploading ? (
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            ) : (
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
            )}
            <div className="text-sm font-medium">
              {isUploading ? (
                "Uploading..."
              ) : isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag & drop some files here, or click to select files</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, WEBP. Max {maxFiles} files.
            </p>
          </div>
        </div>
      )}

      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-border">
              <Image
                src={url}
                alt={`Uploaded ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
