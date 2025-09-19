"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import {
  Zap,
  Shield,
  Palette,
  Database,
  Smartphone,
  Code2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description: "Generate production-ready boilerplate in seconds, not hours.",
  },
  {
    icon: Shield,
    title: "Best Practices",
    description: "Built-in security, testing, and performance optimizations.",
  },
  {
    icon: Palette,
    title: "Modern Design",
    description: "Beautiful, responsive designs with dark mode support.",
  },
  {
    icon: Database,
    title: "Database Ready",
    description: "Pre-configured database integrations and schema management.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Responsive designs that work perfectly on all devices.",
  },
  {
    icon: Code2,
    title: "TypeScript Ready",
    description: "Full TypeScript support with proper type definitions.",
  },
];

const benefits = [
  "Skip weeks of initial setup",
  "Production-ready code from day one",
  "Industry standard architecture",
  "Comprehensive documentation included",
  "Active community support",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={true} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Generate Your Perfect
              <span className="text-primary block mt-2">
                Project{" "}
                <span className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 bg-clip-text text-transparent font-bold text-6xl">
                  Boilerplate
                </span>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Skip the setup hassle. Choose your tech stack, generate
              production-ready boilerplate code, and start building your next
              project in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Start Now <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Examples
              </Button>
            </div>

            {/* Benefits List */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Get Started
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our boilerplates come packed with modern tools and best practices
              to accelerate your development process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="relative group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers who&apos;ve accelerated their projects
            with our boilerplates.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
