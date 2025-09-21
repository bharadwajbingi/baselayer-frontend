"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md sm:max-w-lg">
        <SignIn
          appearance={{
            elements: {
              card: "bg-white border border-gray-200 shadow-lg",
              headerTitle: "text-gray-900",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
              formFieldInput:
                "bg-white border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-primary/50",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      </div>
    </div>
  );
}
