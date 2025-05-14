# docker-assignment
## Task 5: Creative Enhancement – Local Weather Cache via Docker Volume

### What it does
- Caches API responses in `cache/cache.json` so repeat requests for the same city come from disk, not the network.
- Uses a Docker **named volume** (`weather-cache`) to persist cache between container restarts.

### How it works
1. Backend checks `cache.json` for `cache[city]`.
2. If found → returns with `{ source: 'cache' }`.
3. If missing → fetches from OpenWeatherMap, writes to cache, then returns with `{ source: 'api' }`.

### How to run
```bash
docker-compose up --build
