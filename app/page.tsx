'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 px-4 md:px-8 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Subtitle */}
          <div className="mb-8">
            <p className="text-sm md:text-base font-light tracking-wider text-muted-foreground">
              INTELLIGENT STYLING
            </p>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-6 tracking-tight text-pretty">
            Outfit Planner
          </h1>

          {/* Main Subtitle */}
          <p className="text-base md:text-lg lg:text-xl font-light text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            Plan your outfits with AI-powered styling. Upload your clothes and let the AI suggest perfect combinations tailored to your style.
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            className="rounded-full px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-light bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
          >
            Start Adding Clothes
          </Button>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-border"></div>

      {/* Secondary Section */}
      <section className="w-full py-24 md:py-32 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 md:mb-20">
            <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-foreground max-w-2xl">
              Upload your clothes and let the AI suggest perfect combinations.
            </p>
          </div>

          {/* Placeholder Grid */}
          <div className="mb-16 md:mb-20">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 aspect-video bg-card border border-border rounded-2xl p-8 md:p-12 flex items-center justify-center min-h-96">
              <div className="col-span-2 md:col-span-3 text-center">
                <div className="text-muted-foreground font-light">
                  Your Wardrobe Grid
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-start">
            {/* Primary Button */}
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-light bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
            >
              Add New Item
            </Button>

            {/* Secondary Button */}
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-base font-light border border-muted text-foreground hover:bg-card transition-all duration-300"
            >
              Generate Outfit
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            {/* Brand */}
            <div className="text-sm font-light text-muted-foreground">
              © 2024 Outfit Planner. All rights reserved.
            </div>

            {/* Links */}
            <nav className="flex gap-8 text-sm font-light">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
