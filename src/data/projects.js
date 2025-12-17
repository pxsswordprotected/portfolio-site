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
 * OPTIONAL LINK:
 * link: 'https://example.com' or 'https://github.com/username/repo'
 * (makes the description text clickable, opens in new tab)
 * If omitted, description is just plain text
 */

export const projects = [
  {
    id: 1,
    description: "rand.om - a site to randomize are.na blocks",
    date: "December 2025",
    mediaType: "gif",
    mediaUrl: "src/images/ezgif-40cdf7474ab8756e.gif",
    link: "https://rand-om.vercel.app/", // Optional: makes description clickable
  },
  {
    id: 2,
    description: "Pricing plans",
    date: "October 2025",
    mediaType: "image",
    mediaUrl:
      "https://d2w9rnfcy7mm78.cloudfront.net/38843484/original_6260add4f12de4483d00b7fa586fb1c6.png?1755458813?bc=0",
  },
  {
    id: 3,
    description: "3",
    date: "3",
    mediaType: "video",
    mediaUrl:
      "https://attachments.are.na/40980614/e1e3ce9f5d7d93fcc47bab6f2b8bac20.mp4?1762725115",
  },
  {
    id: 4,
    description: "4",
    date: "4",
    mediaType: "video",
    mediaUrl:
      "https://attachments.are.na/40980614/e1e3ce9f5d7d93fcc47bab6f2b8bac20.mp4?1762725115",
  },
  {
    id: 5,
    description: "5",
    date: "5",
    mediaType: null,
    mediaUrl: null,
  },

  {
    id: 6,
    description: "6",
    date: "6",
    mediaType: "video",
    mediaUrl:
      "https://attachments.are.na/40980614/e1e3ce9f5d7d93fcc47bab6f2b8bac20.mp4?1762725115",
  },
  {
    id: 7,
    description: "rand.om - a site to find random arena blocks",
    date: "December 2025",
    mediaType: "iframe",
    mediaUrl: "https://rand-om.vercel.app/",
  },
];
