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
 */

export interface Project {
  id: number;
  description: string;
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
  showPdfPopup?: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    description: "Rand.om",
    date: "December 2025",
    mediaType: "gif",
    mediaUrl: "/images/random-profile.gif",
    link: "https://rand-om.vercel.app/", // Optional: makes description clickable
  },
  {
    id: 2,
    description: "Pricing plans",
    date: "October 2025",
    mediaType: "image",
    mediaUrl:
      "https://d2w9rnfcy7mm78.cloudfront.net/38843484/original_6260add4f12de4483d00b7fa586fb1c6.png?1755458813?bc=0",
    mediaMaxHeight: "80%",
  },
  {
    id: 3,
    description: "Workflow progress",
    date: "October 2025",
    mediaType: "image",
    mediaUrl: "/images/running_good_1.png",
    mediaMaxHeight: "80%",
  },
  {
    id: 4,
    description: "Project folders",
    date: "August 2025",
    mediaType: "image",
    mediaUrl: "/images/project_nexus.png",
  },

  {
    id: 5,
    description: "Export options menu",
    date: "December 2025",
    mediaType: "video",
    mediaUrl: "/videos/export-options-menu-67.mp4",
    mediaZoom: 1.1,
  },
  {
    id: 6,
    description: "Design & Branding guidelines",
    date: "October 2025",
    mediaType: "carousel",
    carouselImages: [
      "/images/1.png",
      "/images/2.png",
      "/images/3.png",
      "/images/4.png",
      "/images/5.png",
    ],
    link: "https://chrislakin.blog/",
  },
];
