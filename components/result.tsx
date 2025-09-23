"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type Feature = { id: string; title: string; category?: string };
type Manifest = {
  zip_url?: string;
  pdf_url?: string;
  [key: string]: unknown; // allow other optional fields
};

export default function ProjectReadyCard({
  stack,
  version,
  selectedFeatures = [],
  availableFeatures = [],
  manifest = {},
  handleBackToDashboard = () => {},
}: {
  stack: string;
  version: string;
  selectedFeatures: string[];
  availableFeatures: Feature[];
  manifest: Manifest;
  handleBackToDashboard?: () => void;
}) {
  // Function to handle ZIP download
  const handleDownloadZip = () => {
    const zipUrl = manifest.zip_url;
    if (zipUrl) {
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = "project"; // You can specify the file name here
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  // Function to handle PDF download
  const handleDownloadPdf = () => {
    const pdfUrl = manifest.pdf_url;
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "project"; // You can specify the file name here
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="lg:fixed ">
      <div className="w-full px-4 sm:mt-5 sm:pt-0 pt-10  md:translate-y-[130px]">
        <Card className="mx-auto rounded-none  p-2 rounded-lg sm:h-auto border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between w-full gap-4">
              <div>
                <CardTitle>Starter kit</CardTitle>
                <CardDescription className="mt-2">
                  Your codebase has been generated. Download it below or
                  generate a new one.
                </CardDescription>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <div className="px-3 py-1 rounded-md bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-sm font-semibold shadow-sm">
                  Ready
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Show these only on small+ screens (hidden on mobile) */}
            <div>
              {/* Summary */}
              <div className="mb-6 hidden sm:block">
                <p className="font-medium">Summary</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-muted/60 p-3 rounded">
                    <p className="text-xs text-muted-foreground">Stack</p>
                    <p className="font-semibold">{stack}</p>
                  </div>
                  <div className="bg-muted/60 p-3 rounded">
                    <p className="text-xs text-muted-foreground">Version</p>
                    <p className="font-semibold">{version}</p>
                  </div>
                  <div className="bg-muted/60 p-3 rounded">
                    <p className="text-xs text-muted-foreground">Features</p>
                    <p className="font-semibold">
                      {selectedFeatures.length} selected
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <p className="font-medium">Selected Features</p>
                <ul className="mt-2 list-disc list-inside text-sm max-h-40 overflow-auto p-2 bg-muted/20 rounded">
                  {selectedFeatures.length ? (
                    selectedFeatures.map((id) => {
                      const f = availableFeatures.find((x) => x.id === id);
                      return (
                        <li
                          key={id}
                          className="flex items-center justify-between gap-2 py-1"
                        >
                          <div>
                            <span className="font-medium">
                              {f?.title ?? id}
                            </span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {f?.category}
                            </span>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-sm text-muted-foreground">
                      No features selected
                    </li>
                  )}
                </ul>
              </div>

              {/* Manifest */}
              {/* <div className="mb-6 hidden sm:block">
                <p className="font-medium">Manifest</p>
                <pre className="text-sm bg-muted p-3 rounded mt-2 overflow-auto max-h-48">
                  {JSON.stringify(manifest, null, 2)}
                </pre>
              </div> */}
            </div>

            {/* Always visible: buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 mt-6 mb-12">
              {/* Download Codebase */}
              <button
                onClick={handleDownloadZip}
                aria-label="Download codebase (zip)"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border shadow-md
               bg-white hover:bg-gray-50 transition-colors text-slate-900 font-semibold
               border-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 dark:focus-visible:ring-slate-600
               disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M7 10l5 5 5-5M12 15V3"
                  />
                </svg>

                <span className="text-sm">Download Codebase</span>
                <span className="ml-2 text-xs opacity-80">(zip)</span>
              </button>

              {/* Download Docs */}
              <button
                onClick={handleDownloadPdf}
                aria-label="Download documentation (PDF)"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border shadow-md
               bg-white hover:bg-gray-50 transition-colors text-slate-900 font-semibold
               border-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 dark:focus-visible:ring-slate-600
               disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="img"
                >
                  <path
                    d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-6z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 11h8M8 14h6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <g transform="translate(12,14)">
                    <rect
                      x="0"
                      y="1.2"
                      width="6"
                      height="3"
                      rx="0.5"
                      fill="#ef4444"
                    />
                    <text
                      x="1.2"
                      y="3.4"
                      fontSize="6"
                      fontWeight="600"
                      fill="#fff"
                    >
                      PDF
                    </text>
                  </g>
                </svg>

                <span className="text-sm">Download Docs</span>
                <span className="ml-2 text-xs opacity-80">(mini PDF)</span>
              </button>

              {/* Back to Dashboard */}
              <button
                onClick={handleBackToDashboard}
                aria-label="Back to Dashboard"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border shadow-md
               bg-white hover:bg-gray-50 transition-colors text-slate-900 font-semibold
               border-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 dark:focus-visible:ring-slate-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 18l-6-6 6-6"
                  />
                </svg>

                <span className="text-sm">Back to Dashboard</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
