import React, { useState, useRef } from "react";
import { Upload, FileText, Image as ImageIcon, X, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

/**
 * Professional Document & Photo Uploader Component
 * Supports: PDF, JPG, PNG, WEBP with 5MB strict limit
 * Features: Drag & Drop, Live Image Preview, PDF details, Existing Document View
 */
export default function DocumentUploader({
  label = "Upload Document",
  description = "PDF, JPG, PNG or WEBP (Max 5MB)",
  selectedFile,
  onFileSelect,
  hasExistingDoc = false,
  existingDocUrl = null,
  existingDocName = "View Stored Document",
  disabled = false,
  accept = ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*",
  required = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Check size (5MB max)
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please select a smaller file.`);
      return;
    }

    // Check type
    const validMimes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    const validExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validMimes.includes(file.type) && !validExtensions.includes(fileExt)) {
      toast.error("Unsupported file type. Please upload a PDF or Image (JPG, PNG, WEBP).");
      return;
    }

    onFileSelect(file);
    toast.success(`Selected "${file.name}" (${(file.size / 1024).toFixed(0)} KB)`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = (file) => {
    if (!file) return false;
    return (
      file.type?.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp)$/i.test(file.name)
    );
  };

  const isPDF = (file) => {
    if (!file) return false;
    return (
      file.type === "application/pdf" ||
      /\.pdf$/i.test(file.name)
    );
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {description && (
          <span className="text-[11px] text-gray-400 font-medium">
            {description}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {/* Case 1: File is currently selected by user */}
      {selectedFile ? (
        <div className="relative border-2 border-emerald-300 bg-emerald-50/50 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 overflow-hidden">
            {isImage(selectedFile) ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-emerald-200 flex-shrink-0 bg-white">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-200">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <p className="text-xs font-bold text-gray-900 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; {selectedFile.type || "Document"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : hasExistingDoc ? (
        /* Case 2: Document is already stored in database */
        <div className="border border-blue-200 bg-blue-50/60 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-blue-900 truncate">
                {existingDocName || "Document Uploaded"}
              </p>
              <p className="text-[11px] text-blue-600">
                Stored in database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {existingDocUrl && (
              <a
                href={existingDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-white border border-blue-200 px-2.5 py-1 rounded-md hover:bg-blue-50 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View
              </a>
            )}
            {!disabled && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-gray-700 hover:text-blue-600 bg-white border border-gray-200 px-2.5 py-1 rounded-md hover:border-gray-300 shadow-xs"
              >
                Upload New
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Case 3: Empty upload dropzone */
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
            disabled
              ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
              : isDragging
              ? "bg-blue-50 border-blue-500 scale-[0.99]"
              : "bg-gray-50/70 border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Upload className="w-4 h-4" />
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-bold text-blue-600 hover:underline">Click to upload</span> or drag and drop
          </div>
          <div className="text-[10px] text-gray-400 font-medium">
            PDF, PNG, JPG, WEBP &bull; Max 5MB
          </div>
        </div>
      )}
    </div>
  );
}
