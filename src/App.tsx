import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, useInView } from 'framer-motion';
import "./App.css";
import { projects, type Project } from "./data/projects";
import ImageCarousel from './components/ImageCarousel';

// TypeScript Interfaces
interface ExpandedCell {
  id: number;
  direction: string;
}

interface VideoMediaProps {
  project: Project;
  shouldReduceMotion: boolean | null;
  mediaStyle: React.CSSProperties;
  onClickHandler: () => void;
}

function VideoMedia({ project, shouldReduceMotion, mediaStyle, onClickHandler }: VideoMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isInView = useInView(videoRef, { amount: 0.1 });

  // Set initial video time
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !project.videoStart) return;

    video.currentTime = project.videoStart;
  }, [project.videoStart]);

  // Handle trimming
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !project.videoEnd) return;

    const videoEnd = project.videoEnd;
    const handleTimeUpdate = () => {
      if (video.currentTime >= videoEnd) {
        video.currentTime = project.videoStart || 0;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [project.videoStart, project.videoEnd]);

  // Play/pause based on viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView && !shouldReduceMotion) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView, shouldReduceMotion]);

  return (
    <button
      type="button"
      className="media-button"
      onClick={onClickHandler}
      aria-label={`Expand ${project.description}`}
    >
      <video
        ref={videoRef}
        className="media-block"
        style={mediaStyle}
        loop
        muted
        playsInline
      >
        <source src={project.mediaUrl} type="video/mp4" />
      </video>
    </button>
  );
}

function App() {
  const [expandedCell, setExpandedCell] = useState<ExpandedCell | null>(null);
  const [showPdfPopup, setShowPdfPopup] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // ESC key to collapse expanded cell
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showPdfPopup) {
          // Close popup first, don't collapse cell
          event.stopPropagation();
          setShowPdfPopup(false);
        } else if (expandedCell) {
          // Only collapse cell if popup isn't open
          setExpandedCell(null);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [expandedCell, showPdfPopup]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/draft_v5_guidelines.pdf';
    link.download = 'Draft_v5_Guidelines.pdf';
    link.click();
    setShowPdfPopup(false);
  };

  const getExpansionDirection = (index: number) => {
    const col = index % 3; // 0, 1, or 2 (left, middle, right)
    return col === 2 ? 'left' : 'right';
  };

  const getGridPositionStyle = (index: number, isExpanded: boolean) => {
    if (!isExpanded) return {};

    const col = index % 3; // 0, 1, or 2
    const row = Math.floor(index / 3) + 1; // 1-indexed for CSS Grid

    // Calculate explicit grid column start/end
    let gridColumn;
    if (col === 0) {
      // Left column: expand right (columns 1-2)
      gridColumn = '1 / 3';
    } else if (col === 1) {
      // Middle column: expand right (columns 2-3)
      gridColumn = '2 / 4';
    } else {
      // Right column: expand left (columns 2-3)
      gridColumn = '2 / 4';
    }

    // Calculate explicit grid row start/end (always current row + 2)
    const gridRow = `${row} / ${row + 2}`;

    return { gridColumn, gridRow };
  };

  const renderMedia = (project: Project, index: number) => {
    // Handle carousel media type
    if (project.mediaType === "carousel" && project.carouselImages) {
      const isExpanded = expandedCell?.id === project.id;

      const handleClick = () => {
        // Disable expansion on mobile (screens <= 768px)
        if (window.innerWidth <= 768) return;

        if (isExpanded) {
          // Collapse if already expanded
          setExpandedCell(null);
        } else {
          // Expand if not expanded
          const direction = getExpansionDirection(index);
          setExpandedCell({ id: project.id, direction });
        }
      };

      return (
        <ImageCarousel
          images={project.carouselImages}
          projectDescription={project.description}
          isExpanded={isExpanded}
          shouldReduceMotion={shouldReduceMotion}
          onClickHandler={handleClick}
          mediaMaxHeight={project.mediaMaxHeight}
          mediaCrop={project.mediaCrop}
          mediaZoom={project.mediaZoom}
        />
      );
    }

    if (!project.mediaType || !project.mediaUrl) {
      return <div className="media-block placeholder"></div>;
    }

    const handleClick = () => {
      // Disable expansion on mobile (screens <= 768px)
      if (window.innerWidth <= 768) return;

      if (project.mediaType !== "iframe") {
        // Check if this cell is already expanded
        const isExpanded = expandedCell?.id === project.id;

        if (isExpanded) {
          // Collapse if already expanded
          setExpandedCell(null);
        } else {
          // Expand if not expanded
          const direction = getExpansionDirection(index);
          setExpandedCell({ id: project.id, direction });
        }
      }
    };

    const className = "media-block";
    const mediaStyle = {
      ...(project.mediaMaxHeight && { maxHeight: project.mediaMaxHeight }),
      ...(project.mediaCrop && { clipPath: `inset(${project.mediaCrop})` }),
      ...(project.mediaZoom && { transform: `scale(${project.mediaZoom})` }),
    };

    switch (project.mediaType) {
      case "image":
      case "gif":
        return (
          <button
            type="button"
            className="media-button"
            onClick={handleClick}
            aria-label={`Expand ${project.description}`}
          >
            <img
              src={project.mediaUrl}
              alt={project.description}
              className={className}
              style={mediaStyle}
            />
          </button>
        );
      case "video":
        return (
          <VideoMedia
            project={project}
            shouldReduceMotion={shouldReduceMotion}
            mediaStyle={mediaStyle}
            onClickHandler={handleClick}
          />
        );
      case "iframe":
        return (
          <iframe
            src={project.mediaUrl}
            className={className}
            style={mediaStyle}
            title={project.description}
          ></iframe>
        );
      default:
        return <div className="media-block placeholder"></div>;
    }
  };

  return (
    <>
      <div className="grid-container">
        {projects.map((project, index) => {
        const isExpanded = expandedCell?.id === project.id;
        const expandClass = isExpanded ? `expanded expand-${expandedCell.direction}` : '';
        const gridPositionStyle = getGridPositionStyle(index, isExpanded);

        return (
          <motion.div
            key={project.id}
            className={`grid-item ${expandClass}`}
            style={gridPositionStyle}
            layout
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.3,
              ease: shouldReduceMotion ? 'linear' : [0.16, 1, 0.3, 1]
            }}
          >
            <div className="media-wrapper">
              {renderMedia(project, index)}
            </div>
            <div className="text-row">
              {project.showPdfPopup && showPdfPopup && (
                <>
                  <div className="popup-backdrop" onClick={() => setShowPdfPopup(false)} />
                  <div className="popup-container">
                    <h2 className="popup-title">Download full pdf?</h2>
                    <div className="popup-buttons">
                      <button className="popup-btn popup-yes" onClick={handleDownload}>
                        Yes
                      </button>
                      <button className="popup-btn popup-no" onClick={() => setShowPdfPopup(false)}>
                        No
                      </button>
                    </div>
                  </div>
                </>
              )}
              <div className="description">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.description}
                  </a>
                ) : project.showPdfPopup ? (
                  <span
                    className="description-clickable"
                    onClick={() => setShowPdfPopup(true)}
                  >
                    {project.description}
                  </span>
                ) : (
                  project.description
                )}
              </div>
              <div className="date">{project.date}</div>
            </div>
          </motion.div>
        );
      })}
      </div>
    </>
  );
}

export default App;
