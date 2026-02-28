import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import "./ImageCarousel.css";

interface ImageCarouselProps {
  images: string[];
  projectDescription: string;
  isExpanded: boolean;
  shouldReduceMotion: boolean | null;
  onClickHandler: () => void;
  mediaMaxHeight?: string;
  mediaCrop?: string;
  mediaZoom?: number;
}

function ImageCarousel({
  images,
  projectDescription,
  isExpanded,
  shouldReduceMotion,
  onClickHandler,
  mediaMaxHeight,
  mediaCrop,
  mediaZoom,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const autoRotateTimerRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(carouselRef, { once: false, amount: 0.01 });

  // Auto-rotation logic
  useEffect(() => {
    if (autoRotateTimerRef.current) {
      window.clearInterval(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }

    if (
      isInView &&
      !shouldReduceMotion &&
      !isPausedByUser &&
      images.length > 1
    ) {
      autoRotateTimerRef.current = window.setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2500);
    }

    return () => {
      if (autoRotateTimerRef.current) {
        window.clearInterval(autoRotateTimerRef.current);
      }
    };
  }, [isInView, shouldReduceMotion, isPausedByUser, images.length]);

  // Reset logic
  useEffect(() => {
    if (!isExpanded) {
      setActiveIndex(0);
      setIsPausedByUser(false);
      if (pauseTimeoutRef.current) {
        window.clearTimeout(pauseTimeoutRef.current);
      }
    }
  }, [isExpanded]);

  // Keyboard navigation
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setIsPausedByUser(true);
        if (pauseTimeoutRef.current)
          window.clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = window.setTimeout(
          () => setIsPausedByUser(false),
          3000,
        );

        if (event.key === "ArrowRight") {
          setActiveIndex((prev) => (prev + 1) % images.length);
        } else {
          setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, images.length]);

  const handleDotClick = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.stopPropagation();
      setIsPausedByUser(true);
      if (pauseTimeoutRef.current) window.clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = window.setTimeout(
        () => setIsPausedByUser(false),
        3000,
      );
      setActiveIndex(index);
    },
    [],
  );

  const mediaStyle = useMemo(
    () => ({
      ...(mediaMaxHeight && { maxHeight: mediaMaxHeight }),
      ...(mediaCrop && { clipPath: `inset(${mediaCrop})` }),
      ...(mediaZoom && { transform: `scale(${mediaZoom})` }),
    }),
    [mediaMaxHeight, mediaCrop, mediaZoom],
  );

  const springConfig = useMemo(
    () => ({
      stiffness: 250,
      damping: 25,
      mass: 0.5,
    }),
    [],
  );

  const handleCarouselKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClickHandler();
      }
    },
    [onClickHandler],
  );

  if (images.length === 0)
    return <div className="media-block placeholder"></div>;

  return (
    <div
      className="media-button carousel-button"
      onClick={onClickHandler}
      role="button"
      tabIndex={0}
      onKeyDown={handleCarouselKeyDown}
      aria-label={
        isExpanded
          ? `${projectDescription} carousel`
          : `Expand ${projectDescription} carousel`
      }
      aria-expanded={isExpanded}
    >
      <div ref={carouselRef} className="carousel-wrapper">
        {images.map((imageSrc, index) => {
          // MATH: Calculate the relative distance from the active image
          let offsetIndex = index - activeIndex;

          // Wrap-around logic to ensure the "previous" image transitions behind
          if (offsetIndex === images.length - 1) offsetIndex = -1;
          else if (offsetIndex < -1) offsetIndex += images.length;

          // PERFORMANCE: Prune DOM - Only keep active, previous, and next 2 layers
          if (offsetIndex < -1 || offsetIndex > 2) return null;

          const isVisible = offsetIndex >= 0 && offsetIndex < 3;

          // Visual constants
          const scale = shouldReduceMotion ? 1 : 1 - offsetIndex * 0.05;
          const y = shouldReduceMotion ? 0 : offsetIndex * 15;
          const opacity = offsetIndex < 0 ? 0 : 1;
          const zIndex = 100 - offsetIndex;

          return (
            <motion.img
              key={index}
              src={imageSrc}
              loading="lazy"
              decoding="async" // Off-thread decoding
              alt={`${projectDescription} image ${index + 1}`}
              className="carousel-image-layer media-block"
              style={{
                ...mediaStyle,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                zIndex: isVisible ? zIndex : -1,
                pointerEvents: "none",
                willChange: "transform, opacity", // Hardware acceleration hint
              }}
              initial={false}
              animate={{
                scale,
                y,
                opacity,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", ...springConfig }
              }
            />
          );
        })}

        {isExpanded && images.length > 1 && (
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`carousel-dot ${index === activeIndex ? "active" : ""}`}
                onClick={(e) => handleDotClick(index, e)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageCarousel;
