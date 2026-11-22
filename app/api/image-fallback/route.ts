const PLACEHOLDER_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="#E8943A"/>
</svg>`

/** Mango-colored stand-in for /images files that are not in /public yet. */
export function GET() {
  return new Response(PLACEHOLDER_SVG, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
