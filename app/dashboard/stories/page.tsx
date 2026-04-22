"use client";

import Masonry from "react-masonry-css";
import { useState } from "react";
import { SUGGESTED_TAGS } from "@/lib/config";
import { useTheme } from "@/providers/ThemeProvider";

// ── Background decoration assets ─────────────────────────────────────────────
const BG_LIGHT_GRADIENT =
  "https://www.figma.com/api/mcp/asset/66293d29-cbad-42dd-a92a-1751f532beaa";
const BG_LIGHT_PATTERN =
  "https://www.figma.com/api/mcp/asset/e4dcbbf0-de74-44e7-9525-f4b4d2c396e7";
const BG_DARK_MAIN =
  "https://www.figma.com/api/mcp/asset/134a0591-10cd-47be-bd9d-aa7ebf14ecef";
const BG_DARK_PATTERN =
  "https://www.figma.com/api/mcp/asset/230dcb1c-27ca-4106-b102-40ee164b50ee";

const FONT_VAR =
  "'GRAD' 0, 'XOPQ' 96, 'XTRA' 468, 'YOPQ' 79, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738, 'YTLC' 514, 'YTUC' 712, 'wdth' 100";

const MASONRY_COLS = { default: 3, 1280: 3, 1024: 2, 640: 1 };

// ── Mock data ─────────────────────────────────────────────────────────────────
interface Story {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  imgH: number;
  author: { name: string; avatar: string };
  tags: string[];
  likes: number;
  date: string;
}

const STORIES: Story[] = [
  {
    id: 1,
    title: "From Garage to IPO: My Decade-Long Founder Journey",
    excerpt:
      "I started this company with nothing but a broken laptop and an obsessive belief in the problem I was solving. Ten years, four pivots, and one near-bankruptcy later, we rang the bell on the NYSE. Here is everything I wish someone had told me before I started building.",
    image: "https://picsum.photos/seed/founder1/600/400",
    imgH: 220,
    author: { name: "Alex Rivera", avatar: "https://picsum.photos/seed/alex1/80/80" },
    tags: ["Founder", "IPO"],
    likes: 847,
    date: "Apr 18, 2026",
  },
  {
    id: 2,
    title: "The Art of Saying No",
    excerpt:
      "Every great product is defined as much by what it doesn't do as by what it does.",
    image: "https://picsum.photos/seed/product2/600/400",
    imgH: 300,
    author: { name: "Sara Kim", avatar: "https://picsum.photos/seed/sara2/80/80" },
    tags: ["Product"],
    likes: 512,
    date: "Apr 15, 2026",
  },
  {
    id: 3,
    title: "How We Bootstrapped to $1M ARR Without a Single VC Meeting",
    excerpt:
      "Everyone told us we needed funding. We ignored them. Instead we focused obsessively on one customer segment, charged more than felt comfortable, and reinvested every dollar of profit. Three years later, we crossed $1M ARR with zero dilution and a team of seven people who actually enjoy their jobs.",
    image: "https://picsum.photos/seed/bootstrap3/600/400",
    imgH: 200,
    author: { name: "James Okonkwo", avatar: "https://picsum.photos/seed/james3/80/80" },
    tags: ["Entrepreneur", "Bootstrap"],
    likes: 1204,
    date: "Apr 12, 2026",
  },
  {
    id: 4,
    title: "What Losing My First Company Taught Me About Leadership",
    excerpt:
      "The failure wasn't the product. It was me. I didn't know how to hire, how to delegate, or how to have hard conversations. I blamed the market. I blamed the timing. It took two years and a good therapist to realize the common denominator in all my problems was the person in the mirror. Here is what I learned.",
    image: "https://picsum.photos/seed/leadership4/600/400",
    imgH: 260,
    author: { name: "Maria Santos", avatar: "https://picsum.photos/seed/maria4/80/80" },
    tags: ["Leadership", "Co-founder"],
    likes: 932,
    date: "Apr 10, 2026",
  },
  {
    id: 5,
    title: "Remote-First Is Not the Same as Remote-Friendly",
    excerpt:
      "We made the switch in 2022 and spent 18 months undoing the mistakes of treating remote work as an afterthought bolted onto an office-first culture.",
    image: "https://picsum.photos/seed/remote5/600/400",
    imgH: 180,
    author: { name: "Priya Nair", avatar: "https://picsum.photos/seed/priya5/80/80" },
    tags: ["Managing Director"],
    likes: 674,
    date: "Apr 8, 2026",
  },
  {
    id: 6,
    title: "The Cold Email That Changed My Career",
    excerpt:
      "I was 24, unemployed, and had sent 200 job applications with zero responses. On a whim, I emailed the CEO of the company I most wanted to work for with a short, brutally honest message. She replied in four minutes. Here is what I said.",
    image: "https://picsum.photos/seed/career6/600/400",
    imgH: 240,
    author: { name: "Lena Fischer", avatar: "https://picsum.photos/seed/lena6/80/80" },
    tags: ["Developer"],
    likes: 2381,
    date: "Apr 6, 2026",
  },
  {
    id: 7,
    title: "Building a Board That Actually Helps You",
    excerpt:
      "Most founders treat their board like a compliance exercise. I used to too. Then our company nearly ran out of money and I finally learned how to use board members as real partners.",
    image: "https://picsum.photos/seed/board7/600/400",
    imgH: 320,
    author: { name: "Thomas Weber", avatar: "https://picsum.photos/seed/thomas7/80/80" },
    tags: ["Board Member"],
    likes: 388,
    date: "Apr 4, 2026",
  },
  {
    id: 8,
    title: "Why I Turned Down a $40M Acquisition Offer",
    excerpt: "It was the hardest decision I ever made.",
    image: "https://picsum.photos/seed/acquisition8/600/400",
    imgH: 280,
    author: { name: "Yuki Tanaka", avatar: "https://picsum.photos/seed/yuki8/80/80" },
    tags: ["Founding Partner", "Entrepreneur in residence"],
    likes: 1876,
    date: "Apr 2, 2026",
  },
  {
    id: 9,
    title: "Lessons from Managing a 40-Person Engineering Team Across 12 Time Zones",
    excerpt:
      "The problems are never technical. They are always about communication, clarity, and trust. After five years of remote engineering leadership, here are the frameworks that actually work versus the ones that sound great in blog posts but fall apart in practice.",
    image: "https://picsum.photos/seed/engineering9/600/400",
    imgH: 200,
    author: { name: "Carlos Mendez", avatar: "https://picsum.photos/seed/carlos9/80/80" },
    tags: ["Developer", "Project manager"],
    likes: 1102,
    date: "Mar 30, 2026",
  },
  {
    id: 10,
    title: "The Loneliness of the Founder",
    excerpt:
      "Nobody talks about this enough. The isolation, the imposter syndrome that never fully goes away, the inability to be fully honest with your team, investors, or even your co-founder. Here is what helped me.",
    image: "https://picsum.photos/seed/lonely10/600/400",
    imgH: 250,
    author: { name: "Amara Diallo", avatar: "https://picsum.photos/seed/amara10/80/80" },
    tags: ["Co-founder"],
    likes: 3240,
    date: "Mar 28, 2026",
  },
  {
    id: 11,
    title: "How to Run a Sprint Review That People Actually Want to Attend",
    excerpt: "Make it a celebration, not a status report.",
    image: "https://picsum.photos/seed/sprint11/600/400",
    imgH: 210,
    author: { name: "Nico Bauer", avatar: "https://picsum.photos/seed/nico11/80/80" },
    tags: ["Project manager"],
    likes: 455,
    date: "Mar 25, 2026",
  },
  {
    id: 12,
    title: "From Idea to First Dollar: A 90-Day Journal",
    excerpt:
      "I documented every single day of building and launching my first product. The euphoria, the dead ends, the embarrassing launch-day numbers, and the slow climb that followed. This is the full, unfiltered account of what it actually looks like to go from zero to your first paying customer.",
    image: "https://picsum.photos/seed/journal12/600/400",
    imgH: 190,
    author: { name: "Sophie Laurent", avatar: "https://picsum.photos/seed/sophie12/80/80" },
    tags: ["Founder", "Entrepreneur"],
    likes: 789,
    date: "Mar 22, 2026",
  },
];

// ── StoryCard ─────────────────────────────────────────────────────────────────
function StoryCard({ title, excerpt, image, imgH, author, tags, likes, date }: Story) {
  return (
    <div className="border border-outline rounded-sm bg-surface shadow-hard-sm overflow-hidden">
      <div className="w-full overflow-hidden" style={{ height: imgH }}>
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-[2px] bg-on-surface text-surface text-xs font-bold leading-4"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-base font-bold text-on-surface leading-snug">{title}</h2>
        <p className="text-sm text-on-surface/70 leading-relaxed">{excerpt}</p>
        <div className="flex items-center gap-3 pt-1">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-7 h-7 rounded-full border border-outline object-cover"
          />
          <span className="flex-1 text-xs font-medium text-on-surface truncate">{author.name}</span>
          <span className="text-xs text-on-surface/50">{date}</span>
          <div className="flex items-center gap-1 text-xs text-on-surface/60">
            <span className="material-icons text-sm leading-none">favorite_border</span>
            <span>{likes.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function StoriesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="relative flex flex-col items-center w-full min-h-full">
      {/* ── Decorative background (top-right) ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[min(694px,50%)] h-[610px] pointer-events-none overflow-hidden"
      >
        {isDark ? (
          <>
            <img
              src={BG_DARK_MAIN}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <img
              src={BG_DARK_PATTERN}
              alt=""
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
            />
          </>
        ) : (
          <>
            <img
              src={BG_LIGHT_GRADIENT}
              alt=""
              className="absolute inset-0 w-full h-full object-cover rotate-180"
            />
            <img
              src={BG_LIGHT_PATTERN}
              alt=""
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
            />
          </>
        )}
      </div>

      {/* ── Hero: title + search + example hint + suggested tags ──────────── */}
      <div className="relative flex flex-col gap-6 items-center w-full max-w-[660px] mt-0 lg:mt-[84px] px-6 lg:px-4">
        <h1
          className="text-[48px] font-extrabold leading-[56px] text-on-surface whitespace-normal lg:whitespace-nowrap text-center lg:text-left"
          style={{ fontVariationSettings: FONT_VAR }}
        >
          Explore Stories
        </h1>

        {/* Search bar */}
        <div className="flex items-center justify-between w-full px-5 py-4 border border-outline rounded-sm shadow-hard-sm bg-surface">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for stories..."
            className="flex-1 bg-transparent text-base font-medium text-on-surface placeholder:text-on-surface/50 outline-none"
          />
          <button
            className="flex-none flex items-center justify-center w-8 h-8 bg-primary border border-black rounded-sm"
            aria-label="Search"
          >
            <span className="material-icons text-base leading-none text-black">search</span>
          </button>
        </div>

        {/* "For example" hint */}
        <div className="flex gap-1.5 items-center justify-center text-sm text-on-surface whitespace-nowrap">
          <span className="font-normal">For example</span>
          <span className="font-bold">Startup founder journey</span>
        </div>

        {/* Suggested tags — hidden on mobile */}
        <div className="hidden lg:flex flex-wrap gap-1.5 items-center justify-center">
          {SUGGESTED_TAGS.map((tag) => (
            <button
              key={tag}
              className="px-2 py-1 rounded-[2px] bg-on-surface text-surface text-xs font-bold leading-4 whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Masonry grid ──────────────────────────────────────────────────── */}
      <div className="relative w-full px-6 lg:px-[70px] mt-10 pb-8">
        <Masonry
          breakpointCols={MASONRY_COLS}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {STORIES.map((story) => (
            <div key={story.id}>
              <StoryCard {...story} />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
}
