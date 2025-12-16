import { useState } from "react";
import "./App.css";
import { projects } from "./data/projects";

function App() {
  const [expandedCell, setExpandedCell] = useState(null);

  const getExpansionDirection = (index) => {
    const col = index % 3; // 0, 1, or 2 (left, middle, right)
    return col === 2 ? 'left' : 'right';
  };

  const renderMedia = (project, index) => {
    if (!project.mediaType || !project.mediaUrl) {
      return <div className="media-block placeholder"></div>;
    }

    const handleClick = () => {
      if (project.mediaType !== "iframe") {
        const direction = getExpansionDirection(index);
        setExpandedCell({ id: project.id, direction });
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

        return (
          <div key={project.id} className={`grid-item ${expandClass}`}>
            {renderMedia(project, index)}
            <div className="text-content">
              <div className="description">{project.description}</div>
              <div className="date">{project.date}</div>
            </div>
            {isExpanded && (
              <button
                className={`back-button back-button-${expandedCell.direction}`}
                onClick={() => setExpandedCell(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M213.66,53.66,163.31,104H192a8,8,0,0,1,0,16H144a8,8,0,0,1-8-8V64a8,8,0,0,1,16,0V92.69l50.34-50.35a8,8,0,0,1,11.32,11.32ZM112,136H64a8,8,0,0,0,0,16H92.69L42.34,202.34a8,8,0,0,0,11.32,11.32L104,163.31V192a8,8,0,0,0,16,0V144A8,8,0,0,0,112,136Z"></path>
                </svg>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
