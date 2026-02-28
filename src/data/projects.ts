/**
 * MEDIA TYPE EXAMPLES:
 *
 * IMAGE:
 * mediaType: 'image'
 * mediaUrl: '/images/project1.jpg' or 'https://example.com/image.png'
 *
 * GIF:
 * mediaType: 'gif'
 * mediaUrl: '/images/animation.gif'
 *
 * VIDEO:
 * mediaType: 'video'
 * mediaUrl: '/videos/demo.mp4' or '/videos/demo.webm'
 * (will autoplay, loop, and be muted)
 * videoStart: 5.0 (optional - start time in seconds)
 * videoEnd: 15.0 (optional - end time in seconds, will loop back to start)
 *
 * IFRAME (for live site demos):
 * mediaType: 'iframe'
 * mediaUrl: 'https://example.com' or 'https://yoursite.netlify.app'
 *
 * PLACEHOLDER (no media):
 * mediaType: null
 * mediaUrl: null
 * (shows gray block)
 *
 * CAROUSEL (multiple images with auto-rotation):
 * mediaType: 'carousel'
 * carouselImages: ['/images/image1.png', '/images/image2.png', '/images/image3.png']
 * (auto-rotates every 2.5s when collapsed, shows dots when expanded)
 *
 * OPTIONAL LINK:
 * link: 'https://example.com' or 'https://github.com/username/repo'
 * (makes the description text clickable, opens in new tab)
 * If omitted, description is just plain text
 *
 * OPTIONAL MEDIA MAX HEIGHT:
 * mediaMaxHeight: '70%' or '200px'
 * (constrains tall media to a smaller height)
 *
 * OPTIONAL MEDIA CROP:
 * mediaCrop: '2px 0' or '5px 10px 5px 10px'
 * (crops media using CSS inset: top right bottom left)
 *
 * OPTIONAL MEDIA ZOOM:
 * mediaZoom: 1.5 or 2
 * (scales up the media content using CSS transform: scale())
 *
 * OPTIONAL EXPLANATION:
 * explanation: 'A short 1–4 sentence explanation of the project.'
 * (only shown when the cell is expanded, fades in below the description/date row)
 */

export interface Project {
  id: number;
  description: string;
  explanation?: string;
  date: string;
  mediaType?: "image" | "gif" | "video" | "iframe" | "carousel" | null;
  mediaUrl?: string;
  carouselImages?: string[];
  link?: string;
  mediaMaxHeight?: string;
  // mediaCrop?: string;
  // mediaZoom?: number;
  videoStart?: number;
  videoEnd?: number;
  showPdfPopup?: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    description: "Rand.om",
    date: "December 2025",
    mediaType: "video",
    mediaUrl: "/videos/randomvid_v3_opt.mp4",
    link: "https://rand-om.vercel.app/", // Optional- makes description clickable
    mediaCrop: "0px 24px",
    mediaZoom: 1.3,
    explanation:
      "Rand.om fetches random blocks from Are.na channels. I built this site as a way to remind oneself of what once was. It is designed to match Are.na's minimal black and white styling without impeding the user's interactions. Animations and styling contain small gestures users find helpful and delightful.",
  },
  {
    id: 2,
    description: "Drawer",
    date: "December 2025",
    mediaType: "video",
    mediaUrl: "/videos/drawer_v3_opt.mp4",
    link: "https://github.com/pxsswordprotected/Drawer",
    explanation:
      'Drawer is an open source browser extension for quick, delightful highlighting & notetaking. It stays out of your way by taking up a small amount of screen space, only appearing when you need it. Design and animations are inspired by Benji Taylor\'s <a href="https://benji.org/family-values" target="_blank" rel="noopener noreferrer">Family</a>.',
  },
  {
    id: 3,
    description: "Export options menu",
    date: "December 2025",
    mediaType: "video",
    mediaUrl: "/videos/export-options-menu-67.mp4",
  },
  {
    id: 4,
    description: "Drawer",
    date: "December 2025",
    mediaType: "video",
    mediaUrl: "/videos/draweradd_v3_opt.mp4",
    link: "https://github.com/pxsswordprotected/Drawer",
    explanation:
      "This is the add-to-highlights interaction for Drawer. Two small animations: the plus icon morphing into a checkmark on success, and the existing highlights smoothly shifting to make room for the new one.",
  },
  {
    id: 5,
    description: "Design & Branding guidelines",
    date: "October 2025",
    mediaType: "carousel",
    carouselImages: [
      "/images/1.webp",
      "/images/2.webp",
      "/images/3.webp",
      "/images/4.webp",
      "/images/5.webp",
    ],
    link: "https://chrislakin.blog/",
  },

  {
    id: 6,
    description: "Project folders",
    date: "August 2025",
    mediaType: "image",
    mediaUrl: "/images/project_nexus.png",
  },

  {
    id: 7,
    description: "Workflow progress",
    date: "October 2025",
    mediaType: "image",
    mediaUrl: "/images/running_good_1.png",
    mediaMaxHeight: "80%",
  },
];
