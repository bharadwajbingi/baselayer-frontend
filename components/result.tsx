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

export default function ProjectReadyCard({
  stack,
  version,
  selectedFeatures = [],
  availableFeatures = [],
  manifest = {},
  downloadUrl = "",
  handleBackToDashboard = () => {},
  handleDownloadClick = () => {},
}: {
  stack: string;
  version: string;
  selectedFeatures: string[];
  availableFeatures: Feature[];
  manifest: unknown;
  downloadUrl?: string | null;
  handleBackToDashboard?: () => void;
  handleDownloadClick?: () => void;
}) {
  const handleDownloadDocs = () => {
    const featuresList = selectedFeatures
      .map((id) => {
        const f = availableFeatures.find((x) => x.id === id);
        return `- ${f?.title ?? id} ${f?.category ? `(${f.category})` : ""}`;
      })
      .join("\n");

    const docs = `Project Mini Documentation\n\nStack: ${stack}\nVersion: ${version}\nSelected features (${
      selectedFeatures.length
    }):\n${featuresList || "- None"}\n\nManifest:\n${JSON.stringify(
      manifest,
      null,
      2
    )}\n\nGenerated on: ${new Date().toISOString()}\n`;

    const blob = new Blob([docs], { type: "text/plain" }); // plain text mini-doc
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-docs.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="lg:fixed">
      <div className="w-full px-4 sm:mt-5 sm:pt-0 pt-10">
        <Card className="mx-auto rounded-none h-screen sm:rounded-lg sm:h-auto border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-start justify-between w-full gap-4">
              <div>
                <CardTitle>Project Ready</CardTitle>
                <CardDescription className="mt-2">
                  Your project has been generated. Download it below or generate
                  a new one.
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
              <div className="mb-6 hidden sm:block">
                <p className="font-medium">Manifest</p>
                <pre className="text-sm bg-muted p-3 rounded mt-2 overflow-auto max-h-48">
                  {JSON.stringify(manifest, null, 2)}
                </pre>
              </div>
            </div>

            {/* Always visible: buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 mt-6 mb-12">
              <button
                onClick={handleDownloadClick}
                disabled={!downloadUrl}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 2v4m0 0V2m0 4h6a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 12h8M8 16h8"
                  />
                </svg>
                <span className="text-sm">Download Codebase</span>
                <span className="ml-2 text-xs opacity-80">(zip)</span>
              </button>

              <button
                onClick={handleDownloadDocs}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-red-100 shadow-md bg-white hover:bg-red-50 transition-colors text-red-700 font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-6-6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M13 3v6h6"
                  />
                  <text x="6" y="17" fontSize="9" fill="currentColor">
                    PDF
                  </text>
                </svg>
                <span className="text-sm">Download Docs</span>
                <span className="ml-2 text-xs opacity-80">(mini PDF)</span>
              </button>

              <button
                className="btn-outline px-4 py-2 rounded-lg border muted:text-muted-foreground"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
