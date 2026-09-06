"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  acceptedFormats?: string[];
  maxSizeMB?: number;
}

export function FileDropzone({
  onFileSelect,
  isLoading = false,
  acceptedFormats = [".pdf", ".png", ".jpg", ".jpeg"],
  maxSizeMB = 10,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndProcess = (file: File) => {
    setErrorMessage(null);
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedFormats.includes(ext)) {
      setErrorMessage(`Unsupported format. Please upload ${acceptedFormats.join(", ")}`);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`File exceeds maximum size of ${maxSizeMB}MB`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Demo helper: simulate synthetic file for quick evaluator clicks
  const loadSyntheticDemo = (sampleName: string, issuer: string) => {
    let content = `Official Credential Document - Issuer: ${issuer}\n`;
    if (sampleName.includes("nptel")) {
      content += `National Programme on Technology Enhanced Learning (NPTEL)\nThis is to certify that Arjun Kumar has successfully completed Design and Analysis of Algorithms\nRoll No: NPTEL24CS82S15430091\nVerify at https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS82S15430091`;
    } else if (sampleName.includes("aws")) {
      content += `Amazon Web Services Training & Certification\nArjun Kumar has successfully achieved AWS Certified Solutions Architect – Associate\nBadge: https://www.credly.com/badges/3a7f8c9b-4e21-4f11-8912-1b5e3c9a2d4f`;
    } else if (sampleName.includes("coursera")) {
      content += `Coursera Verified Certificate\nThis certifies that Arjun Kumar has completed Generative AI with Large Language Models authorized by DeepLearning.AI\nCertificate ID: 9X8W7K2M4L\nVerify at: https://coursera.org/verify/9X8W7K2M4L`;
    } else {
      content += `Certificate of Cloud Architecture\nIssued to Sarah Jenkins\nAuthor: Adobe Photoshop 2024 Windows\nCertificate ID: INVALID999`;
    }
    const blob = new Blob([content], { type: "application/pdf" });
    const mockFile = new File([blob], `${sampleName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_credential.pdf`, {
      type: "application/pdf",
    });
    validateAndProcess(mockFile);
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
          isDragging
            ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
            : "border-slate-700/80 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-900/70",
          isLoading && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="rounded-full bg-indigo-500/10 p-3.5 border border-indigo-500/20 text-indigo-400">
            <UploadCloud className="h-7 w-7 animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">
              Drag & drop official credential (.pdf, .png, .jpg)
            </p>
            <p className="text-xs text-slate-400">
              Scans metadata tags for Canva/Photoshop splicing & validates signature hashes
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
              Max {maxSizeMB}MB
            </span>
            <span className="text-[11px] font-mono bg-indigo-950/60 text-indigo-300 px-2.5 py-1 rounded border border-indigo-800/40">
              SHA-256 Checksummed
            </span>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between rounded-lg border border-slate-700/80 bg-slate-900/90 p-3 text-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <FileText className="h-5 w-5 text-indigo-400 shrink-0" />
            <span className="truncate font-medium text-slate-200">{selectedFile.name}</span>
            <span className="text-xs text-slate-400">
              ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1-Click Preset Samples for Judges / Evaluators */}
      <div className="pt-2 border-t border-slate-800/60">
        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
          Or test with instant pre-loaded sample credentials:
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadSyntheticDemo("nptel_algorithms_iitm", "NPTEL")}
          >
            Sample NPTEL (IIT Madras)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadSyntheticDemo("aws_solutions_architect", "AWS")}
          >
            Sample AWS Architect
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadSyntheticDemo("coursera_deeplearning_ai", "Coursera")}
          >
            Sample Coursera Deep Learning
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => loadSyntheticDemo("canva_photoshop_manipulated_cert", "Suspicious")}
          >
            Sample Tampered (Photoshop Flagged)
          </Button>
        </div>
      </div>
    </div>
  );
}
