import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './ImageCarousel.css';

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

  // Auto-rotation logic (only when collapsed, in view, and motion not reduced)
  useEffect(() => {
    // Clear any existing timer
    if (autoRotateTimerRef.current) {
      window.clearInterval(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }

    // Only auto-rotate if: in viewport, motion not reduced, not paused by user, and more than 1 image
    if (isInView && !shouldReduceMotion && !isPausedByUser && images.length > 1) {
      autoRotateTimerRef.current = window.setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2500); // 2.5 seconds
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autoRotateTimerRef.current) {
        window.clearInterval(autoRotateTimerRef.current);
        autoRotateTimerRef.current = null;
      }
    };
  }, [isInView, shouldReduceMotion, isPausedByUser, images.length]);

  // Reset to first image and clear pause when cell collapses
  useEffect(() => {
    if (!isExpanded) {
      setActiveIndex(0);
      setIsPausedByUser(false);

      // Clear any pending pause timeout
      if (pauseTimeoutRef.current) {
        window.clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
    }
  }, [isExpanded]);

  // Keyboard navigation (only when expanded)
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();

        // Pause auto-rotation
        setIsPausedByUser(true);

        // Clear any existing pause timeout
        if (pauseTimeoutRef.current) {
          window.clearTimeout(pauseTimeoutRef.current);
        }

        // Resume auto-rotation after 3 seconds
        pauseTimeoutRef.current = window.setTimeout(() => {
          setIsPausedByUser(false);
        }, 3000);

        // Navigate
        if (event.key === 'ArrowRight') {
          setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
        } else {
          setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Clean up pause timeout when unmounting
      if (pauseTimeoutRef.current) {
        window.clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [isExpanded, images.length]);

  // Handle dot click
  const handleDotClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent cell collapse

    // Pause auto-rotation
    setIsPausedByUser(true);

    // Clear any existing pause timeout
    if (pauseTimeoutRef.current) {
      window.clearTimeout(pauseTimeoutRef.current);
    }

    // Resume auto-rotation after 3 seconds
    pauseTimeoutRef.current = window.setTimeout(() => {
      setIsPausedByUser(false);
    }, 3000);

    setActiveIndex(index);
  };

  // Base media styles
  const mediaStyle = {
    ...(mediaMaxHeight && { maxHeight: mediaMaxHeight }),
    ...(mediaCrop && { clipPath: `inset(${mediaCrop})` }),
    ...(mediaZoom && { transform: `scale(${mediaZoom})` }),
  };

  // Spring animation config
  const springConfig = {
    stiffness: 250,
    damping: 25,
    mass: 0.5,
  };

  // Fallback for empty images array
  if (images.length === 0) {
    return <div className="media-block placeholder"></div>;
  }

  return (
    <div
      className="media-button carousel-button"
      onClick={onClickHandler}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClickHandler();
        }
      }}
      aria-label={
        isExpanded
          ? `${projectDescription} carousel, image ${activeIndex + 1} of ${images.length}`
          : `Expand ${projectDescription} carousel`
      }
      aria-expanded={isExpanded}
    >
      <div ref={carouselRef} className="carousel-wrapper">
        {/* Render stacked images */}
        {images.map((imageSrc, index) => {
          const offsetIndex = index - activeIndex;
          const isVisible = offsetIndex >= 0 && offsetIndex < 3;

          // Animation values for stacked depth effect
          const scale = shouldReduceMotion ? 1 : 1 - offsetIndex * 0.05; // 5% per layer
          const y = shouldReduceMotion ? 0 : offsetIndex * 15; // 15px per layer
          const blur = shouldReduceMotion ? 0 : Math.max(0, offsetIndex * 1); // 1px per layer, never negative
          const opacity = offsetIndex < 0 ? 0 : 1; // Hide previous images
          const zIndex = 100 - offsetIndex; // Higher z-index for images closer to front

          return (
            <motion.img
              key={index}
              src={imageSrc}
              alt={`${projectDescription} - image ${index + 1} of ${images.length}`}
              className="carousel-image-layer media-block"
              style={{
                ...mediaStyle,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                zIndex: isVisible ? zIndex : -1,
                pointerEvents: 'none',
              }}
              initial={false}
              animate={{
                scale,
                y,
                filter: `blur(${blur}px)`,
                opacity,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      type: 'spring',
                      ...springConfig,
                    }
              }
              aria-current={index === activeIndex ? 'true' : 'false'}
            />
          );
        })}

        {/* Dot indicators (only when expanded and on desktop) */}
        {isExpanded && images.length > 1 && (
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={(e) => handleDotClick(index, e)}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageCarousel;
