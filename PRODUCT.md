# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are public visitors. Most arrive looking for one specific person. They want to look up a profile, rewatch a story that has expired on Instagram, or see a post the owner has since deleted. Browsing needs no account of any kind. A Google sign-in is required only to add a new Instagram username to the archive.

## Product Purpose

InstArchiver is a public, searchable archive of Instagram profiles and their stories and posts. It lets visitors do four things Instagram itself does not allow:

- watch stories after Instagram's 24-hour window has closed
- see how a profile changed over time: username, full name, bio, avatar, private and verified status, and follower, following and post counts
- view posts and profiles after the owner deletes them or makes the account private
- browse all of it without an Instagram account, so the account owner never sees who looked

Success means a visitor finds the person they came for and the content they wanted, including content that no longer exists on Instagram.

## Positioning

Instagram shows the current state of an account. InstArchiver keeps what Instagram drops: expired stories, deleted posts, and every earlier version of a profile, all browsable in public without a login.

## Operating Context

Visitors usually arrive with a username or a shared link and go straight to one profile, story, or post. The home page shows archive totals and the most recently archived stories and posts. Users, Stories and Posts each have their own infinite-scrolling grid with search and sort kept in the URL, so filtered views can be shared. Every profile has a history timeline listing each recorded change as a before and after diff. Post and story pages show similar items, ranked by vector embeddings on the backend.

## Capabilities and Constraints

- The frontend is this Next.js app. A separate Django backend (`instarchiver-backend`) stores and serves the archive, and an internal service does the actual fetching from Instagram. This app never talks to Instagram directly.
- Signed-in visitors can add an Instagram username. The backend fetches the profile, and the visitor lands on the new profile page.
- Posts come in three variants: single image, carousel, and video.
- Profiles can be private or verified, and the UI marks both.
- Server-rendered titles and JSON-LD give each user, post and story page a useful link preview and search result.
- Light and dark themes are supported.
- Google Analytics is loaded on every page.
- Undecided: the backend includes Stripe, but no paid tier or pricing exists in the product. Don't design or imply one until it's decided.

## Brand Commitments

- The name is InstArchiver, written with that capitalization.
- UI copy is plain and neutral: factual labels, short descriptions, no jokes. The README's dry, self-deprecating humor belongs to the README only and stays out of the product.
- The public contact address is arter@instarchiver.net, shown in the footer.

## Evidence on Hand

- The archive itself: real profiles, stories, posts, and profile history served by the backend API, plus live totals from the statistics endpoint.
- A site Open Graph image at `app/opengraph-image.png`.
- There are no testimonials, user counts beyond the archive totals, press mentions, or partner logos. Future work must not invent any.

## Product Principles

1. The person being looked up is the entry point. Every surface should get a visitor from a name to that person's content in as few steps as possible.
2. Show what changed and when. Dates and before and after values are the product's core evidence, so they stay exact and visible.
3. Content that is gone from Instagram should look just as present here as content that still exists.
4. Browsing never asks for anything. Sign-in appears only at the moment someone tries to add a user.
5. Say what the archive holds, plainly, and don't claim anything it can't show.
