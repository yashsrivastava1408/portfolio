# Yash Srivastava | Portfolio

[![CI](https://github.com/yashsrivastava1408/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/yashsrivastava1408/portfolio/actions/workflows/ci.yml)

Live: https://portfolio-theta-lyart-35.vercel.app

This is a modern, premium portfolio website built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [Framer Motion](https://www.framer.com/motion/).

## Features

- **Modern UI/UX**: Designed with a premium aesthetic using glassmorphism, gradients, and smooth animations.
- **Responsive Design**: Fully responsive layout that looks great on all devices.
- **Dynamic Content**: Data is separated into `src/data/portfolio.ts` for easy updates.
- **Animations**: Framer Motion, GSAP, Lenis
- **3D**: three.js with react-three-fiber and GSAP for entrance and scroll animations, Lenis for smooth scrolling, and a react-three-fiber 3D hero.
- **Reduced motion**: The intro, smooth scrolling and marquees switch off when the OS asks for reduced motion.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Animations**: Framer Motion, GSAP, Lenis
- **3D**: three.js with react-three-fiber

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no output files |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |

## CI

`.github/workflows/ci.yml` runs on every push to `main` and on every pull request: `npm ci`, lint, typecheck, then a production build. Node version comes from `.nvmrc`.

## Updating content

Almost everything on the page comes from `src/data/portfolio.ts`:

- `projects`: set `featured: true` to show a project as a large card; the rest appear in the "More builds" grid.
- `leetcode`: fallback numbers only. The live ones are fetched by `src/lib/stats.ts`.
- `achievements`: the strip under the hero. The LeetCode tile is added automatically.
- `testimonials`: empty by default, and the section stays hidden until a real quote is added.
- `personal.currentlyBuilding`: the "Currently building" line in About.
- `experience`, `skills`, `gallery`, `personal`: plain lists.

### Live stats

`src/lib/stats.ts` fetches GitHub (repo count, top languages, latest pushes) and LeetCode numbers when the page is built, and the page rebuilds itself at most once a day. If either API cannot be reached, the GitHub card is hidden and LeetCode falls back to the numbers in `portfolio.ts`, so a build never fails because of them. Setting a `GITHUB_TOKEN` environment variable is optional and only raises GitHub's rate limit.

Set `NEXT_PUBLIC_BASE_URL` if the site moves to a different domain; it feeds the canonical URL, share image and structured data.

## Project Structure

- `src/app`: Application routes and layouts. `opengraph-image.tsx`, `icon.tsx` and `apple-icon.tsx` generate the share image and icons at build time.
- `src/components`: UI components (`DeskScene` is the 3D hero, then About, Skills, Projects, etc.).
- `src/data`: Static data for the portfolio (modify `portfolio.ts` to update content).
- `public`: Static assets like images.

## Legacy Code

The previous HTML/CSS version of this portfolio has been moved to the `legacy_backup/` directory.
