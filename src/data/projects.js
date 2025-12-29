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
 *
 * OPTIONAL MEDIA MAX HEIGHT:
 * mediaMaxHeight: '70%' or '200px'
 * (constrains tall media to a smaller height)
 *
 * OPTIONAL MEDIA CROP:
 * mediaCrop: '2px 0' or '5px 10px 5px 10px'
 * (crops media using CSS inset: top right bottom left)
 */

export const projects = [
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
    description: "Product design",
    date: "October 2025",
    mediaType: "image",
    mediaUrl: "/images/running_good_1.png",
    mediaMaxHeight: "80%",
  },
  {
    id: 4,
    description: "Product design",
    date: "August 2025",
    mediaType: "image",
    mediaUrl: "/images/project_nexus.png",
  },
  {
    id: 5,
    description: "Dropdown component",
    date: "October 2025",
    mediaType: "gif",
    mediaUrl: "/images/dropdown_gif_v1.gif",
    mediaCrop: "2px 0", // crops 2px from top and bottom
  },

  {
    id: 6,
    description: "6",
    date: "6",
    mediaType: null,
    mediaUrl: null,
  },
];
