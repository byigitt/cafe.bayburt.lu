# Cafe Reviews - 90s Style Static Website

A retro 90s-styled static website for cafe reviews. Built with Vite, TypeScript, and vanilla CSS.

## Live Demo

[cafe.bayburt.lu](https://cafe.bayburt.lu)

## Features

- Retro 90s web design aesthetic
- Markdown support for reviews (headings, images, lists, code blocks, etc.)
- City and cafe filtering
- SEO optimized with dynamic meta tags
- Docker ready for easy deployment
- Fully static - no backend required

## Quick Start

```bash
# Clone the repository
git clone https://github.com/byigitt/cafe.bayburt.lu.git
cd cafe.bayburt.lu

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Customization Guide

### 1. Change Site Title and Author

Edit `index.html`:
```html
<title>Your Site Title</title>
<meta name="author" content="Your Name" />
```

Edit `src/main.ts` - search for "Baris" and replace with your name in:
- `updateSEO()` calls
- `renderHome()` - home title
- `renderCafePage()` - page title

### 2. Add Your Cafe Reviews

Create `.mdx` files in the `content/` folder:

```mdx
---
name: Cafe Name
location: Neighborhood, City
rating: 8
date: 2025-01-15
---

Your review content here with **Markdown** support!

## Sections

You can use headings, lists, images, and more.

- Item 1
- Item 2

> Blockquotes work too!

![Image description](/path/to/image.jpg)
```

### 3. Customize Colors

Edit `src/style.css`. Key colors:
- Background: `#008080` (teal)
- Header/Nav: `#000080` (navy blue)
- Text highlight: `#ffff00` (yellow)
- Links: `#00ffff` (cyan)
- Accent: `#ff00ff` (magenta)

### 4. Change Domain

Update these files with your domain:
- `index.html` - canonical URL and og:url
- `src/main.ts` - URLs in `updateSEO()` calls

### 5. Update GitHub Link

Search for `github.com/byigitt/cafe.bayburt.lu` in `src/main.ts` and replace with your repo URL.

## Project Structure

```
cafe.bayburt.lu/
├── content/           # Your .mdx cafe reviews
│   └── cafe-name.mdx
├── src/
│   ├── main.ts        # Main application logic
│   ├── style.css      # 90s styling
│   └── cafes.json     # Generated from content (gitignored)
├── scripts/
│   └── build-content.js  # MDX to JSON converter
├── Dockerfile         # Docker deployment
└── index.html         # Entry point
```

## MDX Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Cafe name |
| `location` | string | Format: "Neighborhood, City" |
| `rating` | number | Rating out of 10 |
| `date` | string | Visit date (YYYY-MM-DD) |

## Deployment

### Docker

```bash
docker build -t cafe-reviews .
docker run -p 3000:3000 cafe-reviews
```

### Dokploy / Traefik

The included Dockerfile works with Dokploy. Just connect your GitHub repo and deploy.

### Static Hosting (Vercel, Netlify, etc.)

```bash
pnpm build
# Upload the `dist` folder
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm content` - Generate cafes.json from MDX files
- `pnpm preview` - Preview production build

## License

MIT - Feel free to use this for your own cafe reviews!

## Credits

Created by [Baris](https://github.com/byigitt)
