'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ExpandableImage({ src, alt, width = 320, height = 550 }) {
  const [open, setOpen] = useState(false)

  if (!src) return null // <- evita o erro se src vier vazio

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="inline-block mt-5 cursor-zoom-in rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
      >
        <Image src={src} alt={alt} width={width} height={height} className="block" />
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center cursor-zoom-out"
        >
          <Image
            src={src}
            alt={alt}
            width={500}
            height={750}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
          />
        </div>
      )}
    </>
  )
}