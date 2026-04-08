'use client'

import { Button } from '@/components/ui/button'
import { ClothingUploadForm } from '@/components/clothing-upload-form'

export default function Home() {
  const scrollToForm = () => {
    document.getElementById('upload-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 px-4 md:px-8 overflow-hidden">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <p className="text-sm md:text-base font-light tracking-wider text-muted-foreground">
              INTELLIGENT STYLING
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-6 tracking-tight text-pretty">
            Outfit Planner
          </h1>

          <p className="text-base md:text-lg lg:text-xl font-light text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            Plan your outfits with AI-powered styling. Upload your clothes and let the AI suggest
            perfect combinations tailored to your style.
          </p>

          <Button
            size="lg"
            onClick={scrollToForm}
            className="rounded-full px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-light bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
          >
            Start Adding Clothes
          </Button>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-border" aria-hidden="true" />

      {/* Secondary Info Section */}
      <section className="w-full py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-foreground max-w-2xl mb-10">
            Upload your clothes and let the AI suggest perfect combinations.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <Button
              size="lg"
              onClick={scrollToForm}
              className="rounded-full px-8 py-6 text-base font-light bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
            >
              Add New Item
            </Button>

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

      {/* Divider */}
      <div className="w-full h-px bg-border" aria-hidden="true" />

      {/* Upload Form Section */}
      <section
        id="upload-form"
        className="w-full py-20 md:py-28 px-4 md:px-8 bg-[#f7f7f7] scroll-mt-8"
        aria-label="Formulario de carga de prendas"
      >
        <ClothingUploadForm />
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="text-sm font-light text-muted-foreground">
              &copy; 2025 Outfit Planner. All rights reserved.
            </div>
            <nav className="flex gap-8 text-sm font-light" aria-label="Footer navigation">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
