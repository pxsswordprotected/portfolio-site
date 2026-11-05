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
 * posterUrl: '/videos/posters/demo.webp' (optional - first frame shown before playback
 *   and when reduced motion keeps the video paused)
 * Run scripts/optimize-media.sh on new videos and images before adding them here.
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
  mediaCrop?: string;
  mediaZoom?: number;
  videoStart?: number;
  videoEnd?: number;
  posterUrl?: string;
  showPdfPopup?: boolean;
}

export const projects: Project[] = [
  {
    id: 14,
    description: "Internal, then External",
    date: "June 2026 – Ongoing",
    mediaType: "carousel",
    carouselImages: [
      "/images/internalexternal1.webp",
      "/images/internalexternal2.webp",
      "/images/internalexternal3.webp",
    ],
    link: "https://internalthenexternal.com",
    explanation:
      "This website holds a living book I start in June of 2026 that explores human perception, knowledge, and phenomenology. I built the site as a means to present the book in a legible and beautiful manner as a way to express my love for design. The site is built in Next.js and React, using scroll-aware nav, inline MDX editing, and inline glossary typing. The contents of the book change as my own ontology does.",
  },
  {
    id: 13,
    description: "Semblocks",
    date: "May 2026",
    mediaType: "video",
    mediaUrl: "/videos/semblocksvideo.mp4",
    posterUrl: "/videos/posters/semblocksvideo.webp",
    link: "https://github.com/pxsswordprotected/aresearch",
    explanation:
      "Aresearch is an experimental research tool I’m designing and developing for turning an Are.na profile into a searchable, AI-assisted knowledge base. It indexes channels, blocks, images, links, and PDFs so you can semantically search your archive and ask where new ideas best fit. It combines OCR, webpage/PDF extraction, chunking, vector embeddings, and reranking to make personal research archives feel fast, searchable, and connected.",
  },
  {
    id: 12,
    description: "Rand.om",
    date: "December 2025",
    mediaType: "video",
    mediaUrl: "/videos/randomvid_v3_opt.mp4",
    posterUrl: "/videos/posters/randomvid_v3_opt.webp",
    link: "https://rand-om.vercel.app/", // Optional- makes description clickable
    mediaCrop: "0px 24px",
    mediaZoom: 1.3,
    explanation:
      "Rand.om fetches random blocks from Are.na channels. I built this site as a way to remind oneself of what once was. It is designed to match Are.na's minimal black and white styling without impeding the user's interactions. Animations and styling contain small gestures users find helpful and delightful.",
  },
  {
    id: 11,
    description: "Drawer",
    date: "December 2025",
    mediaType: "video",
    mediaUrl: "/videos/ezgif-75c388d6629f7431.mp4",
    posterUrl: "/videos/posters/ezgif-75c388d6629f7431.webp",
    link: "https://github.com/pxsswordprotected/Drawer",
    explanation:
      'Drawer is an open source browser extension for quick, delightful highlighting & notetaking. It stays out of your way by taking up a small amount of screen space, only appearing when you need it. Design and animations are inspired by Benji Taylor\'s <a href="https://benji.org/family-values" target="_blank" rel="noopener noreferrer">Family</a>.',
  },
  {
    id: 10,
    description: "Export options menu",
    date: "December 2025",
    mediaType: "video",
    mediaUrl: "/videos/export-options-menu-67.mp4",
    posterUrl: "/videos/posters/export-options-menu-67.webp",
  },
  {
    id: 9,
    description: "Drawer",
    date: "December 2025",
    mediaType: "video",
    mediaUrl: "/videos/ADDANDDELETEHIGHLIGHT_trim_crop.mp4",
    posterUrl: "/videos/posters/ADDANDDELETEHIGHLIGHT_trim_crop.webp",
    link: "https://github.com/pxsswordprotected/Drawer",
    explanation:
      "This is the add-to-highlights and delete-from-highlights interaction for Drawer. Two animations: the semi-realistic highlighter mark moves in from left to right and the hold to delete functionality deletes the highlight to zero width.",
  },
  {
    id: 8,
    description: "XP progress",
    date: "Febuary 2026",
    mediaType: "video",
    mediaUrl: "/videos/xp_bar_output.mp4",
    posterUrl: "/videos/posters/xp_bar_output.webp",
    explanation:
      "An experimental XP bar meant for my learning platform <a href='https://github.com/pxsswordprotected/dialectic' target='_blank' rel='noopener noreferrer'>Dialectic</a>. Uses spring physics for the bar and a small blur animation for text reveal on the pill.",
  },
  {
    id: 7,
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
    explanation:
      "These branding guidelines for <a href='https://x.com/chrislakin' target='_blank' rel='noopener noreferrer'>Chris Lakin</a> were built to serve his existing brand, Locally Optimal. I worked with him to understand what he needed and turned that into a visual language that helped grow the brand. I also created design templates that made it easier to produce consistent graphics for his writing.",
  },
  {
    id: 6,
    description: "Copy button redesign",
    date: "February  2026",
    mediaType: "video",
    mediaUrl: "/videos/button_redesign.mp4",
    posterUrl: "/videos/posters/button_redesign.webp",
    link: "https://submit-redesign.vercel.app/",
    explanation:
      "An unsolicited redesign of the copy email interaction on Adria Studio's job posting page. I noticed the button felt flat and unresponsive, so I rebuilt it with spring animations, a blurred crossfade between states, and proper accessibility support.",
  },
  {
    id: 5,
    description: "Dialectic",
    date: "January 2026",
    mediaType: "carousel",
    carouselImages: [
      "/images/1_dia.webp",
      "/images/2_dia.webp",
      "/images/3_dia.webp",
      "/images/4_dia.webp",
      "/images/5_dia.webp",
    ],
    link: "https://dialectic-lake.vercel.app/",
    explanation:
      "Dialectic is a philosophy learning platform that utilizes first principles of learning such as spaced repetition & deliberate practice to boost students' learning speed. Dialectic takes advantage of the \"Attempt, Feedback, Master, Observe\" learning loop used by <a href='https://www.mathacademy.com/how-it-works#:~:text=Math%20Academy%27s%20approach,receive%20immediate%20feedback.' target='_blank' rel='noopener noreferrer'>Math Academy</a>. Everything is designed and coded by me.",
  },
  {
    id: 4,
    description: "Drawer",
    date: "March 2026",
    mediaType: "video",
    mediaUrl: "/videos/drawer_export.mp4",
    posterUrl: "/videos/posters/drawer_export.webp",
    link: "https://github.com/pxsswordprotected/Drawer",
    explanation:
      "This is the export interaction for Drawer. Entering export mode gives the user freedom to choose what they want to export by providing selection boxes or choose a pre-filled option. It uses a floating island that dynamically changes shape to fit the options the user wants to see.",
  },
  {
    id: 3,
    description: "Workflow progress",
    date: "October 2025",
    mediaType: "image",
    mediaUrl: "/images/running_good_1.webp",
    mediaMaxHeight: "80%",
  },
  {
    id: 2,
    description: "File transfer screen",
    date: "September 2025",
    mediaType: "image",
    mediaUrl: "/images/smartwifitransfer-v3.webp",
  },
  {
    id: 1,
    description: "Project folders",
    date: "August 2025",
    mediaType: "image",
    mediaUrl: "/images/project_nexus.webp",
  },
];
