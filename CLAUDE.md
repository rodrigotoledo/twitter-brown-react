# twitter-brown-react – Frontend Agent Instructions

## Stack

- **React 19** + **TypeScript**
- **Vite** (build tool, dev server on port 5173)
- **Tailwind CSS** + **Flowbite React** (component library)
- **React Router DOM v7** (client-side routing)
- **TanStack Query v5** (server state, API calls)
- **react-international-phone** (phone input on signup)
- **@faker-js/faker** (mock data – will be removed once backends are live)

## Commands

```bash
npm start          # dev server → http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build
npm test           # vitest
```

## Project Structure

```
src/
├── App.tsx                    # Router setup, global providers
├── index.tsx                  # React root mount
├── index.css                  # Tailwind directives + base styles
├── components/
│   ├── AuthLayout.tsx          # Shared layout for auth pages
│   ├── FormField.tsx           # Reusable input with label + error
│   ├── PhoneField.tsx          # International phone input
│   ├── SideBar.tsx             # Generic sidebar wrapper
│   ├── TopBar.tsx              # Top navigation bar
│   ├── TweetCard.tsx           # Legacy tweet card (to be replaced)
│   ├── TweetForm.tsx           # Legacy tweet form (to be replaced)
│   ├── ToastIcons.tsx          # Icons for toast notifications
│   ├── toastTheme.ts           # Flowbite toast theme config
│   └── home/
│       ├── LeftNav.tsx         # Left navigation (desktop)
│       ├── NavIcon.tsx         # Icon + label nav item
│       ├── PostCard.tsx        # Single post display with actions
│       ├── PostComposer.tsx    # New post textarea + submit
│       └── RightSidebar.tsx    # Search + filter sidebar
├── constants/
│   └── post.ts                # MAX_POST_LENGTH = 280
├── context/
│   ├── ToastContext.tsx        # Global toast system
│   └── UserContext.tsx        # Authenticated user state + login/logout
├── pages/
│   ├── SignIn.tsx
│   ├── SignUp.tsx
│   ├── ForgotPassword.tsx
│   └── Home.tsx               # Main feed page
├── types/
│   └── post.ts                # Post, PostAuthor, PostFilter types
└── utils/
    ├── generatePosts.ts       # Faker-based mock post generator
    └── postFilters.ts         # Filter/search logic on post arrays
```

## Routing

| Path              | Component        | Auth required |
|-------------------|------------------|---------------|
| `/`               | → redirect `/home` | No           |
| `/signin`         | `SignIn`         | No            |
| `/signup`         | `SignUp`         | No            |
| `/forgot-password`| `ForgotPassword` | No            |
| `/home`           | `Home`           | Yes (guard)   |

## Current State (Mock Data)

All data is currently **generated with Faker** and exists only in memory. The backend integration task is to replace Faker calls with real API calls via TanStack Query.

### What needs to be wired to the API

1. **Auth pages** (`SignIn`, `SignUp`, `ForgotPassword`) – currently only update local state via `UserContext`. Must call the backend and store the JWT.
2. **`UserContext`** – `login()` should store JWT in `localStorage` (key: `x_clone_token`). `logout()` should call `POST /api/auth/signout`.
3. **Home feed** – replace `generatePosts(50)` with `GET /api/posts` via TanStack Query. Support all `PostFilter` values mapped to `filter` query param.
4. **PostComposer** – `handlePost` should call `POST /api/posts`.
5. **PostCard** actions (like, repost) should call the respective API endpoints.
6. **RightSidebar** search should pass `q` param to the feed query.

## API Integration Guidelines

- Base URL: read from `import.meta.env.VITE_API_URL` (default: `http://localhost:8000` for the iRails/FastAPI backend).
- Attach JWT from `localStorage` in an axios/fetch interceptor as `Authorization: Bearer <token>`.
- All responses follow the envelope `{ data, meta }` from the root `CLAUDE.md`.
- Use TanStack Query for all GET requests (caching, background refetch).
- Use TanStack Mutation for POST/PATCH/DELETE.
- On 401, clear localStorage token and redirect to `/signin`.

### PostFilter → API filter param mapping

| Frontend `PostFilter` | API `filter` value |
|-----------------------|--------------------|
| `latest50`            | `latest`           |
| `today`               | `today`            |
| `yesterday`           | `yesterday`        |
| `thisWeek`            | `this_week`        |
| `lastWeek`            | `last_week`        |
| `thisMonth`           | `this_month`       |
| `thisYear`            | `this_year`        |

## Types to keep/extend

```typescript
// src/types/post.ts – keep as-is, extend with:
export type PostAuthor = {
  id: string        // add this
  name: string
  username: string
  avatar: string
}

export type Post = {
  id: string
  author: PostAuthor
  content: string
  createdAt: Date
  likes: number
  reposts: number
  comments: number
  isFollowing: boolean
  likedByMe: boolean   // add this
  repostedByMe: boolean // add this
}
```

## Styling Conventions

- Custom Tailwind colors: `cursor-light`, `cursor-foreground`, `cursor-border`, `cursor-focus` (defined in `tailwind.config`).
- Prefer Tailwind utility classes over custom CSS.
- Use Flowbite React components for UI elements where available.
- Dark/light theme is driven by the `cursor-*` palette — do not hardcode `#hex` colors.

## Environment Variables

```dotenv
# .env.local
VITE_API_URL=http://localhost:8000
```

## Testing

- Use **Vitest** + **@testing-library/react**.
- Test files: `*.test.tsx` co-located with components or in `src/`.
- Run: `npm test`.
