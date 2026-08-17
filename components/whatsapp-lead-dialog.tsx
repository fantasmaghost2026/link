"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, MessageCircle } from "lucide-react"

// Numero de WhatsApp del agente en Cuba (solo digitos, con codigo de pais).
const WHATSAPP_NUMBER = "19454078640"

type WhatsAppLeadDialogProps = {
  open: boolean
  planName: string | null
  planPrice?: string
  planPriceNote?: string
  onClose: () => void
}

export function WhatsAppLeadDialog({
  open,
  planName,
  planPrice,
  planPriceNote,
  onClose,
}: WhatsAppLeadDialogProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const firstFieldRef = useRef<HTMLInputElement>(null)

  // Reinicia el formulario y enfoca el primer campo al abrir.
  useEffect(() => {
    if (open) {
      setName("")
      setPhone("")
      setAddress("")
      setError("")
      const t = setTimeout(() => firstFieldRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  // Cierra con la tecla Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Por favor completa todos los campos.")
      return
    }

    const message = [
      "Hola, quiero solicitar Uplink.",
      "",
      `Modalidad de pago: ${planName}${planPrice ? ` (${planPrice}${planPriceNote ? ` ${planPriceNote}` : ""})` : ""}`,
      `Nombre: ${name.trim()}`,
      `Número de móvil: ${phone.trim()}`,
      `Dirección: ${address.trim()}`,
      "",
      "Quedo a la espera de que un agente me contacte. Gracias.",
    ].join("\n")

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

    // Abre WhatsApp en una nueva pestaña (o la actual si estamos dentro de un iframe de preview).
    if (typeof window !== "undefined" && window.self !== window.top) {
      window.open(url, "_blank", "noopener,noreferrer")
    } else {
      window.open(url, "_blank", "noopener,noreferrer")
    }

    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-dialog-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Modalidad seleccionada
        </span>
        <h2
          id="whatsapp-dialog-title"
          className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground"
        >
          {planName}
          {planPrice ? (
            <span className="ml-2 text-lg font-semibold text-muted-foreground">
              {planPrice}
              {planPriceNote ? ` ${planPriceNote}` : ""}
            </span>
          ) : null}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Completa tus datos y uno de nuestros agentes en Cuba se pondrá en contacto
          contigo por WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-name" className="text-sm font-medium text-foreground">
              Nombre completo
            </label>
            <input
              id="lead-name"
              ref={firstFieldRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. María Rodríguez"
              className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-phone" className="text-sm font-medium text-foreground">
              Número de móvil
            </label>
            <input
              id="lead-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. +53 5 555 5555"
              className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-address" className="text-sm font-medium text-foreground">
              Dirección
            </label>
            <textarea
              id="lead-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle, número, municipio y provincia"
              rows={2}
              className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {error ? (
            <p className="text-sm font-medium text-destructive">{error}</p>
          ) : null}

          <Button type="submit" size="lg" className="mt-2 w-full gap-2">
            <MessageCircle className="h-4 w-4" />
            Enviar por WhatsApp
          </Button>
        </form>
      </div>
    </div>
  )
}
