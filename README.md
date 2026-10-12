# Cryptocurrency Prices

A table of cryptocurrency prices. Search, sort, and page changes run in the browser.

Live demo: https://cryptocurrenciesprice.vercel.app/

## Data

CoinGecko's public API allows only a few requests per minute. One request loads the top 250 coins. TanStack Query caches that response for 5 minutes. Pagination and search use the cached list, and HTTP 429 is not retried.

Page, search, and sort live in the query string:

```
?page=2&q=sol&sort=current_price&dir=desc
```

## Scripts

```bash
npm run dev
npm run build
npm test
```
