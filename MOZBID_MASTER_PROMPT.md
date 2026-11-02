# MASTER PROMPT — MOZBID FRONTEND
## Premium Online Auction Marketplace — UI/UX Engineering

### 1. ROLE

Act as a Principal Product Designer, Senior Frontend Architect and Senior Vue.js Engineer specialized in premium marketplace platforms, auction systems, automotive digital commerce and high-end SaaS interfaces.

Your mission is to design and implement the complete frontend of MOZBID, a professional online auction marketplace initially targeting Mozambique.

You must produce a polished, production-oriented frontend with a coherent design system, reusable components, realistic interactions and excellent user experience.

The platform backend is built with Node.js and uses **SQLite** as its database (see section 14.1). The frontend never accesses the database directly: it communicates only through the REST API and Socket.IO.

### 2. VISUAL REFERENCE — MANDATORY

Use the user-provided reference image as the primary and mandatory visual reference.

Do not replace its visual identity with a generic ecommerce template, conventional admin dashboard or generic AI-generated SaaS interface.

The visual direction must preserve these characteristics:

- Deep black backgrounds.
- Premium dark surfaces.
- Orange and golden accent colours.
- Large cinematic automotive photography.
- Elegant product cards.
- High-contrast typography.
- Spacious and carefully structured layouts.
- Premium marketplace composition.
- Sophisticated gradients and lighting.
- Minimalist navigation.
- Carefully controlled shadows.
- Modern and refined visual hierarchy.

The homepage must preserve the composition and visual language of the reference image:

1. Dark premium hero section.
2. Large automotive or featured auction imagery.
3. Strong headline and action buttons.
4. Search and filtering section.
5. Product auction cards.
6. Featured auction collections.
7. Premium marketplace experience.

The reference image is the source of truth for visual direction.

Do not blindly reproduce the screenshot as a static image. Rebuild the design as a functional, responsive interface using real frontend components.

### 3. TECHNOLOGY STACK

Use:

- Quasar Framework.
- Vue 3.
- TypeScript.
- Composition API.
- Pinia.
- Vue Router.
- Axios.
- Socket.IO Client.
- SCSS.
- Vite.

Use reusable components and strict TypeScript typing.

Avoid:
- jQuery.
- Unnecessary dependencies.
- Excessive component libraries.
- Monolithic Vue components.
- Inline styling scattered throughout the application.
- Fake backend logic presented as real transactions.

### 4. DESIGN SYSTEM

Create a centralized design system.

Suggested colour tokens:

```scss
:root {
  --color-background: #080808;
  --color-surface: #111111;
  --color-surface-elevated: #191919;
  --color-surface-hover: #222222;

  --color-primary: #f59e0b;
  --color-primary-hover: #d97706;
  --color-primary-soft: rgba(245, 158, 11, 0.12);

  --color-text-primary: #ffffff;
  --color-text-secondary: #a3a3a3;
  --color-text-muted: #737373;

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  --color-border: rgba(255, 255, 255, 0.09);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
}
```

Typography:
- Primary font: Inter.
- Alternative: Manrope.
- Strong headings.
- Readable descriptions.
- Clear numerical hierarchy.

Use a consistent spacing system.

Buttons must have consistent heights, radius, typography and interaction states.

### 5. GLOBAL LAYOUT

Create the following reusable layouts:

- PublicLayout.
- AuthenticationLayout.
- BuyerLayout.
- SellerLayout.
- AdminLayout.

Maintain the same design language throughout the application.

Public pages must have a premium horizontal navigation.

Authenticated dashboards must have a refined dark sidebar, compact navigation, profile section and contextual content area.

### 6. PUBLIC MARKETPLACE

Implement the following pages:

#### 6.1 Homepage

Sections:

- Premium navigation.
- Cinematic hero.
- Main search.
- Category shortcuts.
- Featured auctions.
- Ending soon.
- Most competitive auctions.
- Recently published.
- Automotive auctions.
- Electronics auctions.
- Business equipment auctions.
- Trusted sellers.
- How it works.
- Footer.

Hero content:

Headline: "Discover. Bid. Win."

Supporting text: "Explore exclusive auctions and compete for exceptional products."

Primary CTA: "Explore Auctions".

Secondary CTA: "Start Selling".

Use a large cinematic automotive photograph with dark overlays and orange lighting.

#### 6.2 Auction catalog

Implement:

- Search.
- Category filtering.
- Location filtering.
- Price filtering.
- Auction status filtering.
- Sorting.
- Pagination.
- Grid and list views.
- Responsive product cards.

#### 6.3 Auction product card

Each card must include:

- Product image.
- Product title.
- Category.
- Location.
- Current bid.
- Starting price when relevant.
- Bid count.
- Countdown timer.
- Auction status.
- Favourite control.
- View auction action.

Cards must visually distinguish active, ending soon, ended and sold auctions.

#### 6.4 Auction details

This is a critical page.

Use a two-column layout on desktop.

Left:
- Image gallery.
- Product information.
- Specifications.
- Description.
- Seller information.
- Delivery details.

Right:
- Auction status.
- Countdown.
- Current highest bid.
- Minimum next bid.
- Bid input.
- Place bid action.
- Automatic bidding configuration.
- Favourite action.
- Reserve status.
- Bidder count.

Below:
- Bid history.
- Questions and answers.
- Similar auctions.
- Terms and conditions.

The bidding area must have strong visual prominence.

Never hide the current bid or remaining time.

### 7. AUCTION EXPERIENCE

Implement the frontend states for:

- Upcoming auction.
- Active auction.
- Leading bidder.
- Outbid user.
- Ending soon.
- Auction ended.
- Winner.
- Reserve not met.
- Awaiting payment.
- Sold.
- Unsold.

Provide appropriate visual feedback.

The frontend must receive auction updates through Socket.IO when connected.

Display:
- Current highest bid.
- Number of bids.
- Remaining time.
- Auction extensions.
- Bid notifications.

Countdown must be synchronized with server-provided timestamps.

Never treat the browser countdown as the authority for auction closure.

### 8. BUYER DASHBOARD

Create a premium buyer dashboard with:

- Overview.
- My bids.
- Auctions I am winning.
- Outbid auctions.
- Watchlist.
- Won auctions.
- Pending payments.
- Completed purchases.
- Deliveries.
- Notifications.
- Profile and verification.

Use dark cards, restrained orange accents and clear numerical indicators.

### 9. SELLER DASHBOARD

Create:

- Overview.
- My products.
- Create product.
- My auctions.
- Create auction.
- Active auctions.
- Completed auctions.
- Bids received.
- Sales.
- Payments.
- Deliveries.
- Reviews.
- Analytics.
- Seller profile.

The auction creation process must use a guided multi-step interface.

Steps:
1. Product information.
2. Product photographs.
3. Auction configuration.
4. Delivery and conditions.
5. Review and submission.

### 10. ADMIN DASHBOARD

Create an administrative interface consistent with the main design system.

Modules:

- Overview.
- Users.
- Seller verification.
- Categories.
- Product moderation.
- Auction management.
- Bid monitoring.
- Orders.
- Payments.
- Commissions.
- Disputes.
- Notifications.
- Audit logs.
- Platform settings.

Use data tables with:
- Search.
- Filters.
- Pagination.
- Status indicators.
- Contextual actions.
- Detail drawers or pages.

Administrative actions must require appropriate permissions.

### 11. AUTHENTICATION

Create:

- Login page.
- Registration page.
- Forgot password.
- Reset password.
- Email verification.
- Phone verification.
- Seller onboarding.

Maintain the dark premium design.

Registration must distinguish between individual and business sellers without creating separate account systems unnecessarily.

### 12. REUSABLE COMPONENTS

Create components such as:

- AppNavbar.
- AppFooter.
- AuctionCard.
- AuctionGrid.
- AuctionTimer.
- AuctionStatusBadge.
- BidPanel.
- BidHistory.
- ProductGallery.
- ProductSpecifications.
- SellerCard.
- CategoryCard.
- SearchBar.
- AuctionFilters.
- FavouriteButton.
- NotificationDropdown.
- UserMenu.
- DashboardSidebar.
- DashboardHeader.
- DataTable.
- EmptyState.
- LoadingState.
- ConfirmationDialog.

Avoid duplicating UI logic.

### 13. FRONTEND ARCHITECTURE

Use the following structure:

```text
src/
├── assets/
├── boot/
├── components/
│   ├── auction/
│   ├── product/
│   ├── marketplace/
│   ├── dashboard/
│   └── common/
├── composables/
├── layouts/
├── pages/
│   ├── public/
│   ├── auth/
│   ├── buyer/
│   ├── seller/
│   └── admin/
├── router/
├── services/
├── stores/
├── types/
├── utils/
├── css/
└── App.vue
```

Use:
- Pinia for shared state.
- Services for API communication.
- Composables for reusable logic.
- Types for domain models.
- Route guards for protected pages.

### 14. API INTEGRATION

Prepare a clean API integration layer for the Node.js backend.

Use Axios with:

- Centralized API configuration.
- Authentication handling.
- Token refresh where applicable.
- Error handling.
- Request cancellation where useful.
- Typed responses.

Prepare services for:

- AuthService.
- UserService.
- ProductService.
- AuctionService.
- BidService.
- PaymentService.
- NotificationService.
- SellerService.
- AdminService.

The frontend must not calculate or determine auction winners.

The backend is the source of truth.

#### 14.1 Database — SQLite

The backend uses **SQLite** as its only database. The frontend must be designed around the API contract and must not depend on any database detail.

Backend rules the frontend must respect:

- The database is a single file (for example `data/mozbid.db`), accessed only by the Node.js backend. The frontend never reads or writes it.
- Recommended driver: `better-sqlite3`. Avoid heavy ORMs; use plain SQL with versioned migration files (`migrations/001_init.sql`, `002_...`) and a small migration runner.
- Enable on every connection: `PRAGMA journal_mode = WAL;`, `PRAGMA foreign_keys = ON;` and `PRAGMA busy_timeout = 5000;`.
- Money is stored as an integer in the smallest unit (centavos of MZN), never as a floating-point number. The API returns amounts as integers plus a formatting helper in the frontend (`utils/money.ts`).
- Dates are stored in UTC (ISO-8601 text or Unix milliseconds). The API always returns server timestamps, and the frontend uses them for countdowns.
- Placing a bid is a single database transaction (`BEGIN IMMEDIATE`) that: checks the auction is active, checks the minimum next bid, inserts the bid, updates the auction's current price and bid count, applies the auction extension rule if the bid arrives in the final minutes, and writes an audit record. Socket.IO events (`bid.created`, `bid.outbid`, `auction.extended`) are emitted only after the transaction commits.
- SQLite allows one writer at a time. Keep write transactions short and never hold a transaction open while waiting for the network.
- The frontend must handle `409 Conflict` and `422` responses on bids (for example, "your bid is no longer the minimum", "auction has ended") with a clear message and a refresh of the auction state.

Core tables expected by the API (the frontend types in `src/types/` must mirror these entities):

```text
users              seller_profiles     categories
products           product_images      auctions
bids               auto_bids           watchlist
orders             payments            deliveries
notifications      reviews             audit_logs
```

Minimal reference for the two most critical tables:

```sql
CREATE TABLE auctions (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id         INTEGER NOT NULL REFERENCES products(id),
  seller_id          INTEGER NOT NULL REFERENCES users(id),
  status             TEXT NOT NULL CHECK (status IN
                     ('upcoming','active','ended','sold','unsold','awaiting_payment')),
  starting_price     INTEGER NOT NULL,   -- centavos MZN
  reserve_price      INTEGER,            -- centavos MZN
  current_price      INTEGER NOT NULL,
  bid_increment      INTEGER NOT NULL,
  bid_count          INTEGER NOT NULL DEFAULT 0,
  starts_at          TEXT NOT NULL,      -- UTC
  ends_at            TEXT NOT NULL,      -- UTC
  winner_id          INTEGER REFERENCES users(id),
  created_at         TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bids (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  auction_id  INTEGER NOT NULL REFERENCES auctions(id),
  bidder_id   INTEGER NOT NULL REFERENCES users(id),
  amount      INTEGER NOT NULL,          -- centavos MZN
  is_auto     INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_bids_auction ON bids(auction_id, amount DESC);
CREATE INDEX idx_auctions_status_end ON auctions(status, ends_at);
```

Operational notes for the documentation deliverable:

- Back up the database with SQLite's online backup (not by copying the file while the server is writing).
- Uploaded product images are stored on disk (or object storage), and the database stores only their paths.
- If the platform outgrows SQLite, the API contract allows migrating to another database without changing the frontend.

### 15. REAL-TIME EXPERIENCE

Integrate Socket.IO Client.

Prepare subscriptions for:

- auction.updated
- bid.created
- bid.outbid
- auction.extended
- auction.ended
- auction.won
- payment.updated
- notification.created

Handle:
- Connection state.
- Reconnection.
- Subscription cleanup.
- Authentication.
- Duplicate events.
- Stale data.

When disconnected, use an appropriate fallback to refresh auction information.

### 16. INTERACTION AND UX

Every visible interactive element must have a meaningful behaviour.

Do not create:
- Fake buttons.
- Empty navigation links.
- Decorative forms without validation.
- Non-functional filters.
- Inert dropdowns.
- Placeholder actions presented as completed features.

Implement:
- Loading indicators.
- Success messages.
- Error messages.
- Empty states.
- Confirmation dialogs.
- Form validation.
- Keyboard accessibility.
- Focus states.
- Hover states.

### 17. RESPONSIVE DESIGN

The application must support:

- Large desktop.
- Standard desktop.
- Laptop.
- Tablet.
- Smartphone.

On mobile:
- Use a compact navigation.
- Make auction cards responsive.
- Keep the bid action accessible.
- Ensure countdown visibility.
- Avoid horizontal overflow.
- Use touch-friendly controls.

Do not simply shrink the desktop design. Adapt layouts intelligently.

### 18. PERFORMANCE AND QUALITY

Implement:

- Lazy loading.
- Image optimization.
- Route-level code splitting.
- Reusable components.
- Efficient Pinia stores.
- Minimal unnecessary reactivity.
- Accessible markup.
- Error boundaries or equivalent error handling.

Use ESLint and TypeScript strict mode.

Write tests for important UI and interaction flows.

### 19. MOCK DATA

If the backend is not yet available, create a clearly separated mock data layer.

Use realistic Mozambican examples:

- BMW 320d.
- Toyota Hilux.
- HP EliteBook.
- MacBook Pro.
- Industrial generators.
- Office equipment.

Use realistic prices in MZN.

Never mix mock data with real API responses.

The mock layer must be replaceable without rewriting the components. When the SQLite-backed API is available, switching must require only changing a single configuration value (for example `VITE_USE_MOCKS=false`).

### 20. IMPLEMENTATION STRATEGY

Work in controlled phases.

Phase 1:
- Initialize Quasar.
- Configure theme.
- Create typography and design tokens.
- Implement global layouts.
- Implement homepage.

Phase 2:
- Catalog.
- Filters.
- Auction cards.
- Product details.

Phase 3:
- Authentication.
- Buyer dashboard.
- Seller dashboard.

Phase 4:
- Admin dashboard.
- Management tables.
- Moderation interfaces.

Phase 5:
- API services.
- Pinia integration.
- WebSocket integration.
- Real-time states.
- Connection to the SQLite-backed Node.js API (replacing the mock layer).

Phase 6:
- Testing.
- Responsive refinement.
- Accessibility.
- Performance optimization.

### 21. NON-NEGOTIABLE DESIGN RULES

1. Preserve the reference image's dark premium identity.
2. Black must remain the dominant background colour.
3. Orange/gold must be used as the main accent.
4. Automotive photography must be cinematic and high quality.
5. Product cards must look premium and editorial.
6. Avoid generic purple and blue SaaS themes.
7. Avoid excessive gradients.
8. Avoid excessive rounded cards.
9. Avoid unnecessary visual clutter.
10. Maintain consistency across every page.
11. Use realistic content and prices in MZN.
12. Prioritize the bidding experience.
13. Maintain excellent readability.
14. Never sacrifice usability for visual effects.

### 22. FINAL DELIVERY

Deliver:

- Fully configured Quasar frontend.
- Complete folder structure.
- Design system.
- Public marketplace.
- Auction details.
- Authentication interfaces.
- Buyer dashboard.
- Seller dashboard.
- Admin dashboard.
- Reusable components.
- Mock data layer.
- API integration structure.
- WebSocket integration structure.
- Types mirroring the SQLite entities (section 14.1).
- Responsive implementation.
- Documentation.
- Setup instructions for Windows PowerShell, including how to run the Node.js backend with SQLite (installing `better-sqlite3`, running migrations and starting the server).

Before finishing, inspect every page for visual consistency and functional completeness.

The result must look and feel like a premium international auction marketplace, with the exact visual direction established by the provided reference image.

Do not stop after creating the homepage. Implement the complete frontend architecture and all specified modules.
