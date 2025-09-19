# Baselayer Frontend

Baselayer is a SaaS boilerplate generator 🚀.  
The **frontend** is built with **Next.js 14 (App Router) + TypeScript + TailwindCSS + shadcn/ui**.  
It provides the user interface where developers can select their **tech stack, features, and versions**, then generate a ready-to-use boilerplate codebase.

---

## 📌 Features

- ⚡ Built with Next.js 14 + App Router
- 🎨 TailwindCSS + shadcn/ui for modern UI
- 🌗 Light/Dark mode toggle
- 🔐 Authentication (Clerk – placeholder)
- 📦 Dashboard where users choose:
  - Tech stack (e.g., Next.js, MERN, etc.)
  - Features (e.g., Auth, Billing, Dashboard, File Upload…)
  - Versions (stable by default, but configurable)
- ⏳ Loading animation while generating code
- 📥 Downloadable ZIP of the generated boilerplate
- 📄 Auto-generated mini documentation with the code

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **Auth:** Clerk (planned)
- **State Management:** React hooks (for now)
- **Deployment:** Vercel (recommended)

---

## 📂 Folder Structure (planned)

```bash
frontend/
 ├── app/                # Next.js App Router pages
 │   ├── layout.tsx      # Root layout
 │   ├── page.tsx        # Landing page
 │   ├── dashboard/      # User dashboard
 │   └── api/            # (Optional) API routes
 ├── components/         # Reusable UI components
 ├── hooks/              # Custom hooks
 ├── lib/                # Utils/helpers
 ├── public/             # Static assets
 ├── styles/             # Global styles
 ├── .env.local          # Env variables
 └── README.md
```
