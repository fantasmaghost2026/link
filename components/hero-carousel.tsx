"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

const slides = [
  {
    src: "/uplink-dashboard.png",
    alt: "Panel de Uplink mostrando ventas, inventario y reportes",
    label: "Panel de control",
  },
  {
    src: "/uplink-pos-terminal.png",
    alt: "Terminal de punto de venta de Uplink en una tablet",
    label: "Punto de venta",
  },
  {
    src: "/uplink-inventory.png",
    alt: "Gestión de inventario en tiempo real con Uplink",
    label: "Inventario",
  },
  {
    src: "/uplink-reports.png",
    alt: "Reportes y analíticas de ventas de Uplink",
    label: "Reportes",
  },
  {
    src: "/uplink-checkout.png",
    alt: "Cobro con terminal de pago usando Uplink",
    label: "Cobros",
  },
]

export function HeroCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-all duration-[900ms] ease-out"
            style={{
              opacity: index === active ? 1 : 0,
              transform:
                index === active
                  ? "scale(1) translateX(0)"
                  : index < active
                    ? "scale(1.05) translateX(-4%)"
                    : "scale(1.05) translateX(4%)",
            }}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src || "/placeholder.svg"}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 rounded-full border border-border/40 bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              {slide.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Mostrar ${slide.label}`}
            aria-current={index === active}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: index === active ? "1.75rem" : "0.5rem",
              backgroundColor:
                index === active
                  ? "var(--color-primary)"
                  : "var(--color-border)",
            }}
          />
        ))}
      </div>
    </div>
  )
}
