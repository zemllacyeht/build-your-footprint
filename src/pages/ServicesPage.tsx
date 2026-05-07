import { PageLayout } from "@/components/site/PageLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { ServiceCarousel, type Service } from "@/components/ui/services-card";
import {
  Palette,
  Code2,
  Globe,
  LineChart,
  Shield,
  Smartphone,
  Megaphone,
  Camera,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const services: Service[] = [
  {
    number: "001",
    title: "Brand Identity",
    description: "Logo systems, color palettes, and visual languages that make you unmistakable.",
    icon: Palette,
    details: [
      "Primary and secondary logo lockups",
      "Color, typography, and spacing tokens",
      "Brand guidelines PDF for your team",
      "Social avatars and favicons included",
    ],
  },
  {
    number: "002",
    title: "Custom Web Design",
    description: "Hand-crafted, conversion-focused websites built around your business goals.",
    icon: Code2,
    details: [
      "Bespoke layouts, never templates",
      "Built in React with modern tooling",
      "Conversion-focused page structures",
      "Accessibility and performance baked in",
    ],
  },
  {
    number: "003",
    title: "Domain & Hosting",
    description: "We handle the technical side: domains, SSL, hosting, and uptime monitoring.",
    icon: Globe,
    details: [
      "Domain purchase and DNS setup",
      "Free SSL certificates included",
      "Global CDN for fast load times",
      "24/7 uptime monitoring",
    ],
  },
  {
    number: "004",
    title: "Responsive Builds",
    description: "Pixel-perfect on every device, from 4-inch phones to 4K displays.",
    icon: Smartphone,
    details: [
      "Mobile-first design approach",
      "Tested across iOS, Android, and desktop",
      "Touch-friendly navigation",
      "Optimized images for every screen",
    ],
  },
  {
    number: "005",
    title: "SEO Foundations",
    description: "Built-in search optimization so your customers can actually find you.",
    icon: LineChart,
    details: [
      "Keyword research for your niche",
      "On-page SEO and meta tags",
      "Structured data and sitemaps",
      "Google Search Console setup",
    ],
  },
  {
    number: "006",
    title: "Marketing Collateral",
    description: "Social graphics, email banners, ads, and print pieces, always on-brand.",
    icon: Megaphone,
    details: [
      "Social media templates",
      "Paid ad creative for Meta and Google",
      "Email headers and signatures",
      "Print-ready business cards and flyers",
    ],
  },
  {
    number: "007",
    title: "Content & Photography",
    description: "Original photography, video, and copy that bring your brand story to life.",
    icon: Camera,
    details: [
      "On-location product and team photos",
      "Short-form video for social",
      "Copywriting for web and email",
      "Edited, color-graded, ready to ship",
    ],
  },
  {
    number: "008",
    title: "Email & Automation",
    description: "Branded email templates and automations that nurture leads while you sleep.",
    icon: Mail,
    details: [
      "Welcome and onboarding sequences",
      "Branded transactional templates",
      "Abandoned cart and re-engagement flows",
      "Integrated with your CRM",
    ],
  },
  {
    number: "009",
    title: "Ongoing Care",
    description: "Updates, security patches, content edits, all handled every month.",
    icon: Shield,
    details: [
      "Monthly security and dependency updates",
      "Content edits and small tweaks included",
      "Performance and uptime reports",
      "Priority support response times",
    ],
  },
];

const ServicesPage = () => {
  return (
    <PageLayout
      title="Services · Build Your Footprint"
      description="Custom web design, brand identity, hosting, SEO, and ongoing care: everything you need to launch and maintain a digital footprint that grows with your business."
    >
      <PageHeader
        eyebrow="Services"
        breadcrumb="Services"
        title={<>Everything you need to <span className="italic text-gradient-gold">go live</span>, and stay ahead.</>}
        description="From the first sketch to the monthly invoice, we handle the full stack of design, development, and care so you can focus on running your business."
      />

      <section id="services" className="py-24 md:py-32 relative">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">What we do</div>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
                A full studio, <span className="italic text-gradient-gold">under one roof</span>.
              </h2>
              <div className="h-px w-16 bg-gradient-gold mb-6" />
              <p className="text-muted-foreground text-lg leading-relaxed">
                Nine connected services covering brand, build, and growth, so nothing about your online presence is left to chance.
              </p>
            </div>
          </div>

          <ServiceCarousel services={services} />
        </div>
      </section>

      <section className="py-24 relative">
        <div className="container">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-10 md:p-14 text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Next step</div>
            <h2 className="font-display text-3xl md:text-5xl font-light leading-tight mb-6">
              See how we deliver these services, <span className="italic text-gradient-gold">step by step</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our process turns scope into a launched site without surprises, with full transparency through your private client portal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/process">View our process <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ServicesPage;
