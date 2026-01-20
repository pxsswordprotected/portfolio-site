import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, useInView } from 'framer-motion';
import "./App.css";
import { projects } from "./data/projects";

function VideoMedia({ project, shouldReduceMotion, mediaStyle, onClickHandler }) {
  const videoRef = useRef(null);
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

    const handleTimeUpdate = () => {
      if (video.currentTime >= project.videoEnd) {
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
  const [expandedCell, setExpandedCell] = useState(null);
  const [showPdfPopup, setShowPdfPopup] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // ESC key to collapse expanded cell
  useEffect(() => {
    const handleEscape = (event) => {
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

  // Ctrl+Shift+D to toggle dev panel
  useEffect(() => {
    const handleDevPanelToggle = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setShowDevPanel(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleDevPanelToggle);
    return () => document.removeEventListener('keydown', handleDevPanelToggle);
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/draft_v5_guidelines.pdf';
    link.download = 'Draft_v5_Guidelines.pdf';
    link.click();
    setShowPdfPopup(false);
  };

  const getExpansionDirection = (index) => {
    const col = index % 3; // 0, 1, or 2 (left, middle, right)
    return col === 2 ? 'left' : 'right';
  };

  const getGridPositionStyle = (index, isExpanded) => {
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

  const renderMedia = (project, index) => {
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
    const clickableClass = project.mediaType !== "iframe" ? " clickable" : "";
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

      {showDevPanel && (
        <div className="dev-panel">
          <h3>Popup Dev Controls</h3>

          <div className="dev-control">
            <label>Padding (V):</label>
            <input
              type="range"
              min="0"
              max="80"
              defaultValue="22"
              onChange={(e) => {
                const val = e.target.value + 'px';
                document.documentElement.style.setProperty('--popup-padding-vertical', val);
                e.target.nextElementSibling.textContent = val;
              }}
            />
            <span>22px</span>
          </div>

          <div className="dev-control">
            <label>Padding (H):</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="48"
              onChange={(e) => {
                const val = e.target.value + 'px';
                document.documentElement.style.setProperty('--popup-padding-horizontal', val);
                e.target.nextElementSibling.textContent = val;
              }}
            />
            <span>48px</span>
          </div>

          <div className="dev-control">
            <label>Title Font Size:</label>
            <input
              type="range"
              min="16"
              max="40"
              defaultValue="20"
              onChange={(e) => {
                const val = e.target.value + 'px';
                document.documentElement.style.setProperty('--popup-title-size', val);
                e.target.nextElementSibling.textContent = val;
              }}
            />
            <span>20px</span>
          </div>

          <div className="dev-control">
            <label>Title Margin:</label>
            <input
              type="range"
              min="0"
              max="40"
              defaultValue="18"
              onChange={(e) => {
                const val = e.target.value + 'px';
                document.documentElement.style.setProperty('--popup-title-margin', val);
                e.target.nextElementSibling.textContent = val;
              }}
            />
            <span>18px</span>
          </div>

          <div className="dev-control">
            <label>Button Pad (V):</label>
            <input
              type="range"
              min="0"
              max="24"
              defaultValue="6"
              onChange={(e) => {
                const val = e.target.value + 'px';
                document.documentElement.style.setProperty('--popup-btn-padding-vertical', val);
                e.target.nextElementSibling.textContent = val;
              }}
            />
            <span>6px</span>
          </div>

          <div className="dev-control">
            <label>Button Pad (H):</label>
            <input
              type="range"
              min="0"
              max="60"
              defaultValue="16"
              onChange={(e) => {
                const val = e.target.value + 'px';
                document.documentElement.style.setProperty('--popup-btn-padding-horizontal', val);
                e.target.nextElementSibling.textContent = val;
              }}
            />
            <span>16px</span>
          </div>

          <div className="dev-control">
            <label>Button Font:</label>
            <input
              type="range"
              min="12"
              max="28"
              defaultValue="14"
              onChange={(e) => {
                const val = e.target.value + 'px';
                document.documentElement.style.setProperty('--popup-btn-font-size', val);
                e.target.nextElementSibling.textContent = val;
              }}
            />
            <span>14px</span>
          </div>

          <div className="dev-control">
            <label>Button Gap:</label>
            <input
              type="range"
              min="0"
              max="32"
              defaultValue="16"
              onChange={(e) => {
                const val = e.target.value + 'px';
                document.documentElement.style.setProperty('--popup-btn-gap', val);
                e.target.nextElementSibling.textContent = val;
              }}
            />
            <span>16px</span>
          </div>

          <div className="dev-control">
            <label>Vertical Offset:</label>
            <input
              type="range"
              min="0"
              max="50"
              defaultValue="16"
              onChange={(e) => {
                const val = e.target.value + 'px';
                document.documentElement.style.setProperty('--popup-offset-bottom', val);
                e.target.nextElementSibling.textContent = val;
              }}
            />
            <span>16px</span>
          </div>

          <button onClick={() => setShowDevPanel(false)}>Close Panel</button>
          <div className="dev-panel-hint">Press Ctrl+Shift+D to toggle</div>
        </div>
      )}
    </>
  );
}

export default App;
