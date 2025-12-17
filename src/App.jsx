import { useState, useEffect } from "react";
import { motion, useReducedMotion } from 'framer-motion';
import "./App.css";
import { projects } from "./data/projects";

function App() {
  const [expandedCell, setExpandedCell] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  // ESC key to collapse expanded cell
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && expandedCell) {
        setExpandedCell(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [expandedCell]);

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

    switch (project.mediaType) {
      case "image":
      case "gif":
        return (
          <img
            src={project.mediaUrl}
            alt={project.description}
            className={className + clickableClass}
            onClick={handleClick}
          />
        );
      case "video":
        return (
          <video
            className={className + clickableClass}
            autoPlay
            loop
            muted
            playsInline
            onClick={handleClick}
          >
            <source src={project.mediaUrl} />
          </video>
        );
      case "iframe":
        return (
          <iframe
            src={project.mediaUrl}
            className={className}
            title={project.description}
          ></iframe>
        );
      default:
        return <div className="media-block placeholder"></div>;
    }
  };

  return (
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
            {renderMedia(project, index)}
            <div className="text-content">
              <div className="description">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.description}
                  </a>
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
  );
}

export default App;
