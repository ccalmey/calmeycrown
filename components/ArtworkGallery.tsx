"use client";

// This reusable gallery lets the same pencil-art collection work on Skills and Projects pages.
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Each image keeps its existing portfolio metadata so the accessible name follows the artwork.
type Artwork = { src: string; alt: string; title: string };

type ArtworkGalleryProps = {
  artworks: readonly Artwork[];
  label: string;
  className?: string;
};

export default function ArtworkGallery({ artworks, label, className = "" }: ArtworkGalleryProps) {
  // Store the selected image index so previous/next controls and keyboard arrows stay in sync.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const selectedArtwork = selectedIndex === null ? null : artworks[selectedIndex];

  // Lock page scrolling while viewing a full-size image and support Escape/arrow-key navigation.
  useEffect(() => {
    if (selectedIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lightboxRef.current?.focus();

    function handleGalleryKeys(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") setSelectedIndex((current) => current === null ? null : (current + 1) % artworks.length);
      if (event.key === "ArrowLeft") setSelectedIndex((current) => current === null ? null : (current - 1 + artworks.length) % artworks.length);
    }

    window.addEventListener("keydown", handleGalleryKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleGalleryKeys);
    };
  }, [artworks.length, selectedIndex]);

  // Close the viewer and return keyboard focus to the image that opened it.
  function closeLightbox() {
    setSelectedIndex(null);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }

  // Use one track with native horizontal scrolling so touch, trackpad, and keyboard users can browse.
  return (
    <div className={`artwork-gallery ${className}`}>
      <div className="artwork-gallery-track" role="list" aria-label={label} tabIndex={0}>
        {artworks.map((artwork, index) => (
          <figure className="artwork-gallery-item" role="listitem" key={artwork.src}>
            <button
              className="artwork-gallery-open"
              type="button"
              aria-label={`View ${artwork.title} full size`}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setSelectedIndex(index);
              }}
            >
              <Image src={artwork.src} alt={artwork.alt} width={700} height={960} sizes="(max-width: 700px) 72vw, 300px" />
              <span className="artwork-gallery-zoom" aria-hidden="true">View full size ↗</span>
            </button>
            <figcaption>{artwork.title}</figcaption>
          </figure>
        ))}
      </div>
      <p className="artwork-gallery-hint">Scroll or swipe to explore · Select an image to view it full size</p>

      {/* The modal serves the original public image without Next's thumbnail optimization. */}
      {selectedArtwork && selectedIndex !== null && (
        <div
          className="artwork-lightbox"
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="artwork-lightbox-title"
          tabIndex={-1}
          onClick={closeLightbox}
        >
          <div className="artwork-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <div className="artwork-lightbox-toolbar">
              <div><span>CALMEY.ART</span><h2 id="artwork-lightbox-title">{selectedArtwork.title}</h2></div>
              <button className="artwork-lightbox-close" type="button" onClick={closeLightbox} aria-label="Close full-size artwork">×</button>
            </div>
            <div className="artwork-lightbox-image-wrap">
              <Image src={selectedArtwork.src} alt={selectedArtwork.alt} fill unoptimized sizes="90vw" />
            </div>
            <div className="artwork-lightbox-toolbar artwork-lightbox-bottom">
              <button type="button" onClick={() => setSelectedIndex((selectedIndex - 1 + artworks.length) % artworks.length)} aria-label="View previous artwork">← Previous</button>
              <span>{selectedIndex + 1} / {artworks.length}</span>
              <a href={selectedArtwork.src} target="_blank" rel="noreferrer">Open original file ↗</a>
              <button type="button" onClick={() => setSelectedIndex((selectedIndex + 1) % artworks.length)} aria-label="View next artwork">Next →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
