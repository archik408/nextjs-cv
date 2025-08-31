# Artur Basak - Portfolio Website

A modern, responsive portfolio website built with Next.js 15, showcasing professional experience, skills, and projects.

## Features

- 🌐 **Multilingual Support**: English and Russian translations
- 📱 **Responsive Design**: Optimized for all devices
- ⚡ **Next.js 15**: Latest features with App Router
- 🎨 **Modern UI**: Dark theme with smooth animations
- 🔧 **TypeScript**: Full type safety
- 📸 **Optimized Images**: Next.js Image component for performance
- 🎯 **SEO Optimized**: Complete meta tags and Open Graph
- ♿ **Accessible**: WCAG compliant with proper focus management
- 🚀 **Performance**: Optimized for Core Web Vitals

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Font**: Rubik

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/archik408/nextjs-cv.git
cd nextjs-cv
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with SEO metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ...
├── lib/                   # Utilities and hooks
│   ├── ...
├── public/               # Static assets
│   ├── *.jpg, *.jpeg, *.avif  # Portfolio images
│   └── *.svg             # Icons and graphics
```

### Performance Optimizations

- Server-side rendering (SSR) for better SEO
- Image optimization with Next.js Image component
- Automatic code splitting
- Optimized font loading with next/font

### Modern Architecture

- Component-based architecture with TypeScript
- Context API for state management
- Tailwind CSS 4 for styling
- Proper error boundaries and loading states

### SEO Enhancements

- Complete meta tags setup
- Open Graph and Twitter cards
- Structured data for better search visibility
- Semantic HTML structure

### Developer Experience

- Hot module replacement
- TypeScript for type safety
- ESLint & Prettier configuration
- Better project structure

## Deployment

### Vercel (Recommended)

```bash
npm run build
```

The project is optimized for Vercel deployment with automatic optimizations.

### Other Platforms

```bash
npm run build
npm start
```

## Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: WebP/AVIF format with responsive sizing
- **Bundle Size**: Optimized with tree shaking and code splitting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This is a personal portfolio website. For suggestions or bug reports, please open an issue.

## License

© 2024 Artur Basak. All rights reserved.

## Contact

- **Email**: artur.basak.devingrodno@gmail.com
- **LinkedIn**: [arturbasak](https://www.linkedin.com/in/arturbasak)
- **GitHub**: [archik408](https://github.com/archik408)
- **Articles**: [Smashing Magazine](https://www.smashingmagazine.com/author/artur-basak)
