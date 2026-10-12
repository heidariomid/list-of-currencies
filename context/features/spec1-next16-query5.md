# Spec 1 — Next.js 16 and TanStack Query 5

## Overview

Spec 1 of 1. Lowest priority of the portfolio upgrades: build it
after the new portfolio site is live, and before or after the Amazon
shop as time allows.

The whole app is one page and about twenty source files, so the
upgrade is a single spec: Next 13.1 Pages Router to Next 16 App
Router, React 18 to 19, `@tanstack/react-query` 4.20 to 5,
TypeScript 4.9 to 6, Tailwind 3.2 to 4. Same table, same search,
same pagination. "Done" is the redeployed demo at
`https://cryptocurrenciesprice.vercel.app/` behaving as it does now.

## Requirements

- Read `node_modules/next/dist/docs/` after the install and before
  writing App Router code
- Match the versions in `../bakery/package.json`: Next 16, React 19,
  Tailwind 4 with `@tailwindcss/postcss`, ESLint 9 flat config,
  TypeScript 6
- `pages/index.tsx`, `pages/_app.tsx`, and `pages/_document.tsx`
  become `app/layout.tsx`, `app/page.tsx`, and one client
  `app/providers.tsx`. `pages/api/hello.ts` is deleted
- `app/page.tsx` is a server component that renders `Header` and
  `Currencies`. The title and description from `next/head` move to
  the `metadata` export
- `providers.tsx` holds `ThemeProvider`, the `StateProvider` from
  `store/context/ContextManager`, and `QueryClientProvider`. The
  `QueryClient` is created once with `useState`; today `_app.tsx`
  creates a new one on every render. `Hydrate` is removed: no page
  ever set `dehydratedState`. The devtools render in development
  only
- `next-themes` moves to 0.4. `<html>` gets
  `suppressHydrationWarning`, and `attribute='class'` stays
- Tailwind 4 has no `darkMode: 'class'` setting. Add
  `@custom-variant dark (&:where(.dark, .dark *));` to
  `globals.css`, or every `dark:` class follows the operating system
  instead of the toggle
- `tailwind.config.js` is deleted. Its four colours (`primary`,
  `secondary`, `tertiary`, `ocean`) and the `wiggle` and `textColor`
  animations move into `@theme` with the same values
- `globals.css` names Roboto but nothing loads it. Load it with
  `next/font/google`, and remove `@next/font` from `package.json`
- TanStack Query 5 in `components/Lists/Currencies.tsx`:
  - both `useQuery` calls take one object,
    `useQuery({ queryKey, queryFn, staleTime })`
  - `keepPreviousData: true` becomes
    `placeholderData: keepPreviousData`, and `isPreviousData`
    becomes `isPlaceholderData`. The `Pagination` prop is renamed
    to match
  - `isLoading` becomes `isPending` on both queries
  - `queryClient.prefetchQuery` takes one object
- `react-currency-format` declares React up to 17 and is unmaintained.
  Replace its six uses in `components/Lists/TBodyCurrencies.tsx` with
  one helper built on `Intl.NumberFormat`: dollars with thousands
  separators, and a percentage with two decimals. Remove the package
  and its types
- `FetcherApi/fetchCurrencyAPI.ts` swallows errors: each function
  catches, logs, and returns `undefined`, so `isError` never turns
  true and the error component cannot show. Let the error throw.
  Remove the `console.log` calls
- Remove `json-server` and the two mocked fetchers that call
  `localhost:3001`. Nothing uses them. Delete `db.json` and
  `db-1671968929979.json`
- `axios`, `react-hook-form`, `@headlessui/react`, and the Font
  Awesome packages move to their current majors only if the install
  demands it for React 19. Check with
  `npm view <package> peerDependencies`

## Out of scope

- Fetching on the server, streaming, or `HydrationBoundary`. The
  card says the app shows React Query caching and prefetch in the
  browser; keep that the thing it shows
- Replacing the Context reducer in `store/` with another state
  library, or converting its `.js` files beyond what `tsc` needs
- New columns, charts, a coin detail page
- A CoinGecko API key

## Done when

- The redeployed demo, opened signed out on a phone, lists coins
  with price, 24h and 7d change, market cap, volume, and supply,
  formatted as before
- Next page keeps the current rows on screen until the new ones
  arrive, and the following page is already in the cache: the
  network tab shows it fetched before the click
- Search by name and by symbol filters the list, shows
  "No Result Found" for nonsense, and clearing it restores page 1
- The theme toggle switches light and dark, and a reload keeps it
  with no flash
- With the CoinGecko request blocked in devtools, the error
  component shows instead of an empty table
- 375px, 768px, and 1280px with a clean console
- `npm run build`, `npm run lint`, and `npx tsc --noEmit` pass.
  `pages/`, `tailwind.config.js`, and `db.json` no longer exist

## Notes

- CoinGecko's public endpoint answered 200 without a key on
  12 October 2026. It is rate limited; two queries per page plus a
  prefetch is close to the limit on fast clicking. A 429 is an
  upstream limit, not an upgrade bug
- **Leftover on you:** the portfolio card's demo link is fixed in
  spec 1 of the `portfolio` repo. The custom subdomain
  `cryptocurrency.heidariomid.com` is gone with the domain
- The repo was cloned to `Github/list-of-currencies` on
  12 October 2026 so this spec has a home. The last push before
  that was December 2022

## References

- @context/project-overview.md
- @context/stack.md
- `interview-practice/stack-upgrade.md`
- `../amazon/context/features/spec3-tanstack-query-5.md` for the
  same version 5 changes in a larger app
