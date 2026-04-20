# BLRD - Blerd Vision Entertainment TODO

## Phase 3: Database & Schema
- [x] Design and apply full database schema (articles, reviews, ratings, events, blog posts, contacts, discover items)
- [x] Seed sample content for all pages

## Phase 4: Brand Assets
- [x] Generate BLRD logo (icon + wordmark, futuristic/stylish)
- [x] Generate favicon
- [x] Upload assets to CDN

## Phase 5: Global Layout & Auth
- [x] Design tokens: dark theme, high-contrast, retro/techy palette
- [x] Global CSS with Orbitron + Inter + Rajdhani fonts
- [x] Top navigation bar with logo, search, auth buttons
- [x] Mobile hamburger menu
- [x] Footer with social links
- [x] Auth: login/register/logout workflow
- [x] Role-based access (user / admin)
- [x] Ad zone components (top banner, bottom banner, sidebar rectangle)

## Phase 6: Home Page
- [x] Rotating hero banner (Gaming, Comics, Movies, TV, Creators)
- [x] Popular Now section
- [x] Latest News feed
- [x] Content category sections (Gaming, Comics, Movies, TV, Creators)
- [x] Top banner ad zone
- [x] Sidebar ad zone
- [x] Bottom banner ad zone

## Phase 7: About, News, Discover
- [x] About page: Why BLRD exists, mission, vision, community purpose
- [x] News page: article list with category filters (Gaming, Film, TV, Comics, Tech, Culture, Events)
- [x] News page: chronological sort options
- [x] News page: tag/filter system
- [x] Discover page: rotating premium sponsored marquee
- [x] Discover page: tagged content list (thumbnail, headline, subhead, CTA)
- [x] Discover page: mixed article/video/podcast content types

## Phase 8: Reviews Page
- [x] Reviews page: category tabs (Games, TV, Movies, Comics, Music)
- [x] Custom 0-5 Flames rating component
- [x] 2 example items per category (10 total)
- [x] Average user rating calculation
- [x] External ratings display (IGN, Metacritic, Rotten Tomatoes, Pitchfork, etc.)
- [x] Login-required rating workflow
- [x] Rating modal/login gate

## Phase 9: Events, Blog, Contact
- [x] Events page: sortable table (name, date, type, category, location)
- [x] Events page: card view + table view toggle
- [x] Events page: modal detail window
- [x] Events page: tracked external registration links (click counter in DB)
- [x] Blog page: UGC hub with article list
- [x] Blog page: submit-a-post form (login required)
- [x] Blog page: opinion/community voice content
- [x] Contact Us page: email form with category options
- [x] Contact Us page: partnership/advertising inquiries
- [x] Contact Us page: press contacts
- [x] Contact Us page: community submissions
- [x] Contact Us page: social media links

## Phase 10: Polish & Delivery
- [x] Wire all routes in App.tsx
- [x] Mobile responsiveness (mobile-first design throughout)
- [x] Write/run vitest tests (17 tests, all passing)
- [x] TypeScript: zero errors
- [x] Save checkpoint
- [x] Deliver to user

## Future Enhancements (Phase 2)
- [ ] Full-text search across articles, reviews, events
- [ ] User profile pages
- [ ] Comment system on articles and reviews
- [ ] Admin dashboard for content management
- [ ] Newsletter signup integration
- [ ] Real ad network integration (Google AdSense, etc.)
- [ ] Podcast player component
- [ ] Video embed support in articles
- [ ] Social sharing buttons
- [ ] Dark/light theme toggle
- [ ] SEO meta tags per page

## Brand Update v2 (Style Guide Compliance)
- [x] Regenerate BLRD logo matching style guide: "b" symbol with flame/eye, BLRD wordmark, Metropolis font
- [x] Generate favicon matching style guide "b" symbol
- [x] Update CSS: Primary Cyan #1BC9C9, Accent Orange #FF5722, Black #000000, White #FFFFFF
- [x] Switch typography to Metropolis font (Bold + Light weights)
- [x] Update all tag/accent colors to use brand-compliant palette
- [x] Update Layout.tsx with new logo CDN URL
- [x] Update favicon in client/public/favicon.ico
- [x] Apply brand colors across all 8 pages

## Admin Dashboard
- [x] Extend DB schema: add status fields, admin-only columns to blog_posts, reviews, events
- [x] Add admin tRPC procedures: blog approval, review CRUD, event CRUD, dashboard stats
- [x] Admin Dashboard layout with sidebar navigation and role-based access guard
- [x] Admin overview page with stats (pending posts, total reviews, upcoming events, contacts)
- [x] Blog Post approval queue: list pending/approved/rejected posts, approve/reject actions
- [x] Review management: add new review, edit existing, delete, manage Flames ratings
- [x] Event management: add new event, edit existing, delete, all sortable fields
- [x] Wire /admin routes in App.tsx with adminOnly guard
- [x] Write vitest tests for admin procedures

## v4 — Verticals, Author Profiles & Pipeline API
- [x] Update DB schema: authors table, article_verticals enum, pipeline_api_tokens table
- [x] Seed 5 beat writer author profiles (Kai, Amara, Sol, Noor, Taye)
- [x] Build author profile pages (/authors and /authors/:slug)
- [x] Add byline component with author name, vertical, date, and citation block
- [x] Update News page: 5 verticals as subcategory filter tags
- [x] Update Discover page: 5 verticals as subcategory filter tags
- [x] Update Reviews page: align categories to verticals
- [x] Build REST API endpoint for Python pipeline article ingestion (/api/pipeline/articles)
- [x] Update Admin: author management module
- [x] Update Admin: pipeline article queue (draft articles from API)
- [x] Write vitest tests for new procedures

## v5 — Latest by Vertical (Homepage)
- [ ] Add tRPC procedure: articles.latestByVertical — returns newest article per vertical
- [ ] Build LatestByVertical section component on Home page
- [ ] Seed at least one article per vertical for demo content
- [ ] Write vitest test for latestByVertical procedure

## v6 — Roadmap & Milestones Update
- [x] Rewrite About page roadmap: accelerated growth/revenue/profit milestones anchored to April 2027 scaling goal
- [x] Add event presence signposts: BlerdCon 2027, CES 2027, SXSW, Comic-Con KC/NY/SD, The Game Awards, US/UK/LatAm eSports
- [x] Align milestone phases to current date (April 2026) through end of 2027
